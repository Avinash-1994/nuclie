/**
 * @sparx/error-overlay — Phase 5.2
 *
 * Full-screen browser error overlay that surpasses Vite's:
 *   - Shows ORIGINAL source (not compiled) via source maps
 *   - Copy button for error message + stack
 *   - "Open in editor" deep-link: vscode://file/{path}:{line}:{col}
 *   - Keyboard dismiss (Escape)
 *   - Connects to HMR to auto-dismiss on fix
 */

(function () {
    'use strict';

    const OVERLAY_ID = '__sparx_error_overlay__';
    const STYLE_ID = '__sparx_error_overlay_style__';

    // ─── Styles ──────────────────────────────────────────────────────────────────
    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
#${OVERLAY_ID} {
  position: fixed; inset: 0; z-index: 999999;
  display: flex; align-items: flex-start; justify-content: center;
  background: rgba(10, 10, 15, 0.92);
  backdrop-filter: blur(4px);
  padding: 40px 24px;
  font-family: 'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace;
  animation: sparx-overlay-in 0.15s ease-out;
}
@keyframes sparx-overlay-in {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
#${OVERLAY_ID} .sparx-card {
  background: #111118; border: 1px solid #2a2a3a;
  border-radius: 12px; padding: 28px 32px;
  max-width: 860px; width: 100%; box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  max-height: calc(100vh - 80px); overflow-y: auto;
}
#${OVERLAY_ID} .sparx-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: #ff3e3e22; color: #ff6b6b;
  border: 1px solid #ff3e3e44; border-radius: 6px;
  padding: 4px 10px; font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;
}
#${OVERLAY_ID} h1 {
  color: #ff6b6b; font-size: 18px; font-weight: 700; margin: 0 0 8px;
  word-break: break-word;
}
#${OVERLAY_ID} .sparx-file {
  color: #a0a0cc; font-size: 13px; margin: 0 0 20px; word-break: break-all;
}
#${OVERLAY_ID} .sparx-source {
  background: #0d0d16; border: 1px solid #1e1e30; border-radius: 8px;
  padding: 16px; overflow-x: auto; margin-bottom: 20px;
}
#${OVERLAY_ID} .sparx-source pre {
  margin: 0; font-size: 13px; line-height: 1.6; color: #c8c8e8;
  white-space: pre; tab-size: 2;
}
#${OVERLAY_ID} .sparx-line-error {
  background: #ff3e3e18; display: block;
  border-left: 3px solid #ff6b6b; padding-left: 12px; margin-left: -16px;
}
#${OVERLAY_ID} .sparx-stack {
  color: #666688; font-size: 12px; line-height: 1.7;
  white-space: pre-wrap; word-break: break-all;
}
#${OVERLAY_ID} .sparx-actions {
  display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px;
}
#${OVERLAY_ID} button {
  padding: 8px 16px; border-radius: 7px; font-size: 13px;
  font-family: inherit; cursor: pointer; border: none; font-weight: 500;
  transition: opacity 0.15s;
}
#${OVERLAY_ID} button:hover { opacity: 0.85; }
#${OVERLAY_ID} .btn-copy { background: #1e1e30; color: #a0a0cc; }
#${OVERLAY_ID} .btn-editor { background: #0078d4; color: #fff; }
#${OVERLAY_ID} .btn-close { background: #2a1a1a; color: #ff6b6b; margin-left: auto; }
#${OVERLAY_ID} .sparx-hint { color: #444466; font-size: 11px; margin-top: 16px; }
    `.trim();
        document.head.appendChild(style);
    }

    // ─── Core ─────────────────────────────────────────────────────────────────

    /**
     * showError(error) — render the overlay.
     * @param {object} error  { message, stack, file, line, column, frame }
     */
    function showError(error) {
        dismiss();
        injectStyles();

        const file = error.file || '';
        const line = error.line || 0;
        const col = error.column || 1;
        const frame = error.frame || '';
        const vscodeUrl = file
            ? `vscode://file/${encodeURI(file)}:${line}:${col}`
            : null;

        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Build error');

        overlay.innerHTML = `
<div class="sparx-card">
  <div class="sparx-badge">⚠ Sparx Build Error</div>
  <h1>${escHtml(error.message || 'Unknown error')}</h1>
  ${file ? `<p class="sparx-file">${escHtml(file)}${line ? `:${line}:${col}` : ''}</p>` : ''}
  ${frame ? `<div class="sparx-source"><pre>${formatFrame(frame, line)}</pre></div>` : ''}
  ${error.stack ? `<pre class="sparx-stack">${escHtml(cleanStack(error.stack))}</pre>` : ''}
  <div class="sparx-actions">
    <button class="btn-copy" id="sparx-copy-btn">⎘ Copy</button>
    ${vscodeUrl ? `<button class="btn-editor" onclick="window.open('${vscodeUrl}')">⎋ Open in Editor</button>` : ''}
    <button class="btn-close" id="sparx-close-btn">✕ Dismiss</button>
  </div>
  <p class="sparx-hint">Press <kbd>Escape</kbd> to dismiss. Fix the error to auto-dismiss.</p>
</div>
        `.trim();

        document.body.appendChild(overlay);

        document.getElementById('sparx-close-btn')?.addEventListener('click', dismiss);
        document.getElementById('sparx-copy-btn')?.addEventListener('click', () => {
            const text = `${error.message}\n\n${error.stack || ''}`;
            navigator.clipboard?.writeText(text).then(() => {
                const btn = document.getElementById('sparx-copy-btn');
                if (btn) { btn.textContent = '✓ Copied'; setTimeout(() => { btn.textContent = '⎘ Copy'; }, 2000); }
            });
        });
    }

    function dismiss() {
        document.getElementById(OVERLAY_ID)?.remove();
    }

    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function cleanStack(stack) {
        return stack.split('\n').slice(1, 8).join('\n');
    }

    function formatFrame(frame, errorLine) {
        return frame.split('\n').map((l, i) => {
            const lineNo = i + Math.max(1, (errorLine || 1) - 2);
            const isErr = lineNo === errorLine;
            const escaped = escHtml(String(l));
            return isErr
                ? `<span class="sparx-line-error">${String(lineNo).padStart(4)} │ ${escaped}</span>`
                : `${String(lineNo).padStart(4)} │ ${escaped}`;
        }).join('\n');
    }

    // ─── Keyboard dismiss ─────────────────────────────────────────────────────

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') dismiss();
    });

    // ─── HMR auto-dismiss ─────────────────────────────────────────────────────

    if (typeof window !== 'undefined') {
        window.__sparx_overlay_show__ = showError;
        window.__sparx_overlay_dismiss__ = dismiss;
    }

    // ─── HMR WebSocket integration ────────────────────────────────────────────

    function connectHMR() {
        const ws = new WebSocket(`ws://${location.host}/__sparx_hmr`);
        ws.addEventListener('message', (evt) => {
            try {
                const msg = JSON.parse(evt.data);
                if (msg.type === 'error') showError(msg.error);
                if (msg.type === 'update' || msg.type === 'full-reload') dismiss();
            } catch { /* ignore */ }
        });
        ws.addEventListener('close', () => setTimeout(connectHMR, 2000));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', connectHMR);
    } else {
        connectHMR();
    }
})();
