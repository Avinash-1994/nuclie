/**
 * @sparx/module-registry — Phase 3.5
 *
 * Lightweight browser-side MFE remote module registry.
 *
 * Initialised once per page via __sparx_registry_init__ bootstrap script
 * injected by the dev server. Remote MFE modules are registered here and
 * loaded on demand. The HMR client calls invalidate() on update events.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

type RemoteFactory = () => Promise<unknown>;

interface RegistryEntry {
  url: string;
  factory?: RemoteFactory;
  cache: Map<string, unknown>;
}

// ─── Registry Store ───────────────────────────────────────────────────────────

const registry: Map<string, RegistryEntry> = new Map();

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Register a remote scope with its container URL.
 * Safe to call multiple times — subsequent calls update the URL only.
 *
 * @param scope  Remote scope name (e.g. "shell", "dashboard")
 * @param url    URL of the remote container entry (remoteEntry.js)
 */
export function register(scope: string, url: string): void {
  const existing = registry.get(scope);
  if (existing) {
    existing.url = url;
    existing.factory = undefined; // invalidate cached factory on URL change
    existing.cache.clear();
  } else {
    registry.set(scope, { url, cache: new Map() });
  }
}

/**
 * Load a module from a registered remote scope.
 *
 * @param scope   Remote scope name
 * @param module  Module path within the scope (e.g. "./Button")
 */
export async function load(scope: string, module: string): Promise<unknown> {
  const entry = registry.get(scope);
  if (!entry) {
    throw new Error(
      `[sparx:registry] Scope "${scope}" is not registered. ` +
      `Call register("${scope}", url) first.`
    );
  }

  const cacheKey = `${scope}/${module}`;
  if (entry.cache.has(cacheKey)) {
    return entry.cache.get(cacheKey);
  }

  // Lazy-load the remote container if not already done
  if (!entry.factory) {
    // Use the Module Federation v1 container protocol
    // The remote exposes a window[scope] global after script load
    await loadScript(entry.url, scope);
    const container = (window as any)[scope];
    if (!container) {
      throw new Error(
        `[sparx:registry] Remote container "${scope}" did not expose a global. ` +
        `Ensure the remote is built with Module Federation.`
      );
    }
    // Initialize with host's shared scope
    await container.init((window as any).__sparx_shared__ ?? {});
    entry.factory = async (mod: string) => {
      const factory = await container.get(mod);
      return factory();
    };
  }

  const result = await entry.factory!(module);
  entry.cache.set(cacheKey, result);
  return result;
}

/**
 * Invalidate a scope's module cache.
 * Called by the HMR client when a remote module update is received.
 *
 * @param scope   Remote scope to invalidate (omit to invalidate everything)
 * @param module  Specific module path to invalidate (omit to clear entire scope)
 */
export function invalidate(scope?: string, module?: string): void {
  if (!scope) {
    // Invalidate everything
    registry.forEach(entry => entry.cache.clear());
    return;
  }
  const entry = registry.get(scope);
  if (!entry) return;

  if (module) {
    entry.cache.delete(`${scope}/${module}`);
  } else {
    entry.cache.clear();
    entry.factory = undefined; // force re-init of container
  }
}

/**
 * List all registered scopes and their URLs.
 */
export function list(): Record<string, string> {
  const out: Record<string, string> = {};
  registry.forEach((entry, scope) => { out[scope] = entry.url; });
  return out;
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

/**
 * __sparx_registry_init__ — called by the dev server bootstrap script.
 * Registers all remotes from the server-provided manifest.
 */
export function __sparx_registry_init__(
  remotes: Record<string, string>
): void {
  for (const [scope, url] of Object.entries(remotes)) {
    register(scope, url);
  }
}

// Expose on globalThis for the bootstrap script
(globalThis as any).__sparx_registry_init__ = __sparx_registry_init__;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadScript(url: string, scope: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Idempotent — skip if already loaded
    if ((window as any)[scope]) { resolve(); return; }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${url}"]`
    );
    if (existing) { existing.addEventListener('load', () => resolve()); return; }

    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () =>
      reject(new Error(`[sparx:registry] Failed to load remote script: ${url}`))
    );
    document.head.appendChild(script);
  });
}
