/**
 * @sparx/ssr — Phase 3.6
 *
 * Framework-agnostic SSR runner using Node.js vm.Module.
 * renderToString(entryPath, context) -> { html, head, state }
 *
 * Framework-specific rendering (React/Vue/Svelte) is delegated to the
 * existing framework adaptors, not this module.
 */

import { createContext, Script } from 'vm';
import path from 'path';
import fs from 'fs/promises';
import { createRequire } from 'module';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SSRContext {
  /** Current URL being rendered */
  url: string;
  /** Server-side initial data to hydrate on the client */
  initialData?: Record<string, unknown>;
  /** Custom HTML attributes to inject into <html> */
  htmlAttrs?: string;
  /** Custom attributes for <body> */
  bodyAttrs?: string;
}

export interface SSRResult {
  /** Rendered HTML body content (goes inside #app or equivalent) */
  html: string;
  /** Tags to inject into <head> (title, meta, link, style) */
  head: string;
  /** Serialised state for client hydration */
  state: string;
}

export interface SSRRunnerOptions {
  /** Project root — used to resolve node_modules */
  root: string;
  /** Additional globals to expose in the SSR sandbox context */
  globals?: Record<string, unknown>;
  /** Timeout in ms for render execution (default: 10_000) */
  timeoutMs?: number;
}

// ─── Module Cache ─────────────────────────────────────────────────────────────

const moduleCache = new Map<string, unknown>();

function clearCache(entryPath?: string): void {
  if (entryPath) {
    moduleCache.delete(entryPath);
  } else {
    moduleCache.clear();
  }
}

// ─── SSR Runner ───────────────────────────────────────────────────────────────

/**
 * Render an entry module to string in a Node.js vm context.
 *
 * The entry module must export one of:
 *   - render(context): string | Promise<string>
 *   - default.render(context): string | Promise<string>
 *   - default(context): string | Promise<string>
 *
 * @param entryPath  Absolute path to the compiled SSR entry file
 * @param context    Request context (url, initialData, …)
 * @param options    Runner configuration
 */
export async function renderToString(
  entryPath: string,
  context: SSRContext,
  options: SSRRunnerOptions = { root: process.cwd() }
): Promise<SSRResult> {
  const timeoutMs = options.timeoutMs ?? 10_000;

  // Head/state accumulators — populated by framework hooks if available
  const headTags: string[] = [];
  let stateObj: Record<string, unknown> = context.initialData ?? {};

  // ─── 1. Load the entry module ────────────────────────────────────────────

  let mod: any;

  // Use cached module if available (perf: avoid repeated disk reads in dev)
  if (moduleCache.has(entryPath)) {
    mod = moduleCache.get(entryPath);
  } else {
    const source = await fs.readFile(entryPath, 'utf-8');

    // Build a sandbox that looks like a browser + Node.js hybrid
    const sandboxGlobals: Record<string, unknown> = {
      process,
      Buffer,
      console,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      URL,
      URLSearchParams,
      TextEncoder,
      TextDecoder,
      fetch: globalThis.fetch,
      __SPARX_SSR__: true,
      __SPARX_URL__: context.url,
      // Framework-specific SSR globals
      __sparx_head__: {
        push: (tag: string) => headTags.push(tag),
      },
      // Allow entry to import other modules via CommonJS require
      require: createRequire(entryPath),
      ...(options.globals ?? {}),
    };

    const vmContext = createContext(sandboxGlobals);
    const script = new Script(
      `(function(module, exports, require) { ${source}\n })(` +
      `{ exports: {} }, {}, require);`,
      { filename: entryPath }
    );

    const exports: Record<string, unknown> = {};
    // timeout is a runInContext option (not Script constructor option)
    script.runInContext(vmContext, { timeout: timeoutMs });

    // Resolve the module exports from the sandbox
    mod = (sandboxGlobals as any).module?.exports ?? exports;
    moduleCache.set(entryPath, mod);
  }

  // ─── 2. Resolve the render function ──────────────────────────────────────

  let renderFn: ((ctx: SSRContext) => string | Promise<string>) | undefined;

  if (typeof mod?.render === 'function') {
    renderFn = mod.render;
  } else if (typeof mod?.default?.render === 'function') {
    renderFn = mod.default.render;
  } else if (typeof mod?.default === 'function') {
    renderFn = mod.default;
  }

  if (!renderFn) {
    throw new Error(
      `[sparx:ssr] Entry "${entryPath}" must export a render() function. ` +
      `Got: ${Object.keys(mod ?? {}).join(', ') || 'empty module'}`
    );
  }

  // ─── 3. Execute render with timeout guard ─────────────────────────────────

  const renderPromise = Promise.resolve(renderFn(context));
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`[sparx:ssr] Render timeout after ${timeoutMs}ms`)),
      timeoutMs
    )
  );

  const html = await Promise.race([renderPromise, timeoutPromise]) as string;

  // ─── 4. Assemble state (merge server data + any state emitted by framework)

  if (typeof (mod as any).getState === 'function') {
    stateObj = { ...stateObj, ...(await (mod as any).getState()) };
  }

  return {
    html,
    head: headTags.join('\n'),
    state: JSON.stringify(stateObj),
  };
}

// ─── Cache helpers ────────────────────────────────────────────────────────────

export { clearCache as invalidateSsrCache };
