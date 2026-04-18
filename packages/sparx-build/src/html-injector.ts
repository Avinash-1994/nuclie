/**
 * @sparx/build — html-injector — Phase 4.5
 *
 * Production output HTML injector with --compat-rollup mode.
 * Injects script/link tags from manifest into the index.html shell.
 * With --compat-rollup flag: output is byte-identical to Vite's format.
 */

export interface InjectorManifest {
    /** Entry JS chunks */
    js: string[];
    /** CSS files */
    css: string[];
    /** Preload hints */
    preload?: string[];
    /** Whether to use Vite-compatible output format */
    compatRollup?: boolean;
    /** Base public path (default: '/') */
    base?: string;
}

export interface InjectorOptions {
    /** Template HTML string */
    html: string;
    manifest: InjectorManifest;
}

/**
 * injectAssets(options) — inject built assets into HTML shell.
 *
 * Standard mode: minimal injection.
 * --compat-rollup mode: byte-identical to Vite 5 production output format.
 */
export function injectAssets(options: InjectorOptions): string {
    const { html, manifest } = options;
    const base = manifest.base ?? '/';
    const compatRollup = manifest.compatRollup ?? false;

    let headInjection = '';
    let bodyInjection = '';

    if (compatRollup) {
        // Vite 5 format:
        // <link rel="modulepreload" crossorigin href="/assets/main.xxxx.js">
        // <link rel="stylesheet" crossorigin href="/assets/index.xxxx.css">
        // <script type="module" crossorigin src="/assets/main.xxxx.js"></script>

        for (const js of manifest.js) {
            headInjection += `    <link rel="modulepreload" crossorigin href="${base}${js}">\n`;
        }
        for (const css of manifest.css) {
            headInjection += `    <link rel="stylesheet" crossorigin href="${base}${css}">\n`;
        }
        for (const js of manifest.js) {
            bodyInjection += `    <script type="module" crossorigin src="${base}${js}"></script>\n`;
        }
    } else {
        // Sparx standard format
        for (const css of manifest.css) {
            headInjection += `    <link rel="stylesheet" href="${base}${css}">\n`;
        }
        for (const js of manifest.preload ?? []) {
            headInjection += `    <link rel="modulepreload" href="${base}${js}">\n`;
        }
        for (const js of manifest.js) {
            bodyInjection += `    <script type="module" src="${base}${js}"></script>\n`;
        }
    }

    let result = html;

    // Inject CSS + preloads into <head>
    if (headInjection) {
        if (result.includes('</head>')) {
            result = result.replace('</head>', `${headInjection}</head>`);
        } else {
            result = headInjection + result;
        }
    }

    // Inject scripts before </body>
    if (bodyInjection) {
        if (result.includes('</body>')) {
            result = result.replace('</body>', `${bodyInjection}</body>`);
        } else {
            result = result + bodyInjection;
        }
    }

    return result;
}

/**
 * generateManifest(artifacts) — build InjectorManifest from build output.
 */
export function generateManifest(artifacts: Array<{ fileName: string; type: string }>): InjectorManifest {
    return {
        js: artifacts.filter(a => a.type === 'js').map(a => a.fileName),
        css: artifacts.filter(a => a.type === 'css').map(a => a.fileName),
        preload: [],
    };
}
