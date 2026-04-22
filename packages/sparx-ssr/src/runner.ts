import vm from 'vm';
import { pathToFileURL } from 'url';
import fs from 'fs';
import path from 'path';

export interface SsrRenderResult {
    html: string;
    head: string;
    state?: any;
    error?: Error;
}

export interface SsrContext {
    url: string;
    [key: string]: any;
}

/**
 * Advanced SSR Runner using Node.js experimental 'vm.Module'
 * Isolates memory and avoids cross-request pollution.
 */
export class SsrRunner {
    private contexts: Map<string, vm.Context> = new Map();

    async renderToString(entryPath: string, context: SsrContext): Promise<SsrRenderResult> {
        try {
            const entryCode = await fs.promises.readFile(entryPath, 'utf-8');
            
            // Build an isolated context execution environment
            const sandbox = {
                console,
                setTimeout,
                clearTimeout,
                Buffer,
                process: { env: { NODE_ENV: 'production' } },
                // Allow fetching polyfill and other browser mocks if needed
                URL,
                URLSearchParams,
                globalThis: {} as any,
            };
            sandbox.globalThis = sandbox;
            
            const vmContext = vm.createContext(sandbox);

            // Create synthetic module inside the VM context
            // Note: Since experimental modules in VM are complex to set up without CLI flags,
            // we will use robust context evaluation for the bundled SSR entry logic.
            
            // Expected SSR entry exposes `render(context)`
            const script = new vm.Script(`
                const module = { exports: {} };
                const exports = module.exports;
                (function(module, exports) {
                    ${entryCode}
                })(module, exports);
                module.exports;
            `);

            const exported = script.runInContext(vmContext);
            
            if (typeof exported.render !== 'function') {
                if (exported.default && typeof exported.default.render === 'function') {
                    exported.render = exported.default.render;
                } else {
                    throw new Error("SSR Entry module does not export a 'render' function. Ensure the bundle exports render().");
                }
            }

            const { html, head, state } = await exported.render(context);

            return { html: html || '', head: head || '', state };
        } catch (error: any) {
            return {
                html: '',
                head: '',
                error: (error instanceof Error) ? error : new Error(String(error))
            };
        }
    }

    clearCache() {
        this.contexts.clear();
    }
}
