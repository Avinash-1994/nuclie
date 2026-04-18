/**
 * @sparx/hmr-client — Phase 3.4
 *
 * Browser-side HMR runtime. Zero external dependencies.
 * Bundled as ES module. Target: < 5KB.
 *
 * Injected automatically by dev server as:
 *   <script type="module" src="/@sparx/hmr-client"></script>
 */

// ─── Config ───────────────────────────────────────────────────────────────────

declare const __SPARX_HMR_URL__: string | undefined;

function resolveHmrUrl(): string {
  // 1. Build-time override
  if (typeof __SPARX_HMR_URL__ !== 'undefined') return __SPARX_HMR_URL__;
  // 2. Vite-style env var
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.SPARX_HMR_URL) {
    return (import.meta as any).env.SPARX_HMR_URL;
  }
  // 3. Auto-detect from current page
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${location.host}/__sparx_hmr`;
}

// ─── Connection State ─────────────────────────────────────────────────────────

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectDelay = 1000;
const MAX_RECONNECT_DELAY = 30_000;

// ─── Message Handlers ─────────────────────────────────────────────────────────

async function handleUpdate(modules: string[]): Promise<void> {
  for (const mod of modules) {
    const url = mod + '?t=' + Date.now();
    try {
      await import(/* @vite-ignore */ url);
    } catch (err) {
      console.error('[sparx:hmr] Failed to hot-update', mod, err);
      location.reload();
      return;
    }
  }
}

function handleCssUpdate(href: string): void {
  const links = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');
  links.forEach(link => {
    const linkHref = link.getAttribute('href') || '';
    if (linkHref.startsWith(href.split('?')[0])) {
      const newLink = link.cloneNode() as HTMLLinkElement;
      newLink.href = href.split('?')[0] + '?t=' + Date.now();
      newLink.addEventListener('load', () => link.remove());
      link.parentNode?.insertBefore(newLink, link.nextSibling);
    }
  });
}

function handleFullReload(): void {
  location.reload();
}

type HmrMessage =
  | { type: 'connected' }
  | { type: 'update'; modules: string[] }
  | { type: 'css-update'; href: string }
  | { type: 'full-reload' }
  | { type: 'error'; message: string; stack?: string };

function onMessage(raw: string): void {
  let msg: HmrMessage;
  try {
    msg = JSON.parse(raw);
  } catch {
    return;
  }

  switch (msg.type) {
    case 'connected':
      console.debug('[sparx:hmr] connected');
      reconnectDelay = 1000; // reset backoff on successful handshake
      break;

    case 'update':
      handleUpdate(msg.modules);
      break;

    case 'css-update':
      handleCssUpdate(msg.href);
      break;

    case 'full-reload':
      handleFullReload();
      break;

    case 'error':
      console.error('[sparx:hmr]', msg.message, msg.stack ?? '');
      break;
  }
}

// ─── WebSocket Connection ─────────────────────────────────────────────────────

function connect(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  const url = resolveHmrUrl();
  ws = new WebSocket(url);

  ws.addEventListener('open', () => {
    reconnectDelay = 1000;
  });

  ws.addEventListener('message', (ev) => {
    onMessage(ev.data as string);
  });

  ws.addEventListener('close', () => {
    ws = null;
    // Exponential back-off reconnect
    reconnectTimer = setTimeout(() => {
      reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY);
      connect();
    }, reconnectDelay);
  });

  ws.addEventListener('error', () => {
    ws?.close();
  });
}

// ─── import.meta.hot shim ─────────────────────────────────────────────────────

export function createHotContext(moduleId: string) {
  return {
    accept(cb?: (newModule: unknown) => void) {
      // Modules call this to opt-in to HMR
      // The actual swap is performed by handleUpdate above
    },
    dispose(cb: () => void) {
      // Called before old module is replaced
    },
    invalidate() {
      handleFullReload();
    },
    data: {} as Record<string, unknown>,
  };
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

connect();
