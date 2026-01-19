import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { NativeWorker, minifySync } = require('../../../native/index.js');
import fs from 'fs/promises';
import { BuildContext } from '../engine/types.js';

import { log } from '../../utils/logger.js';
import os from 'os';

export class Transformer {
    private nativeWorker: any = null;
    private available: boolean = false;

    constructor() {
        try {
            this.nativeWorker = new NativeWorker(os.cpus().length || 4);
            this.available = true;
        } catch (e) {
            this.available = false;
        }
    }

    public static minifySync(code: string): string {
        try {
            return minifySync(code);
        } catch (e) {
            log.error('Native minify failed:', { category: 'build', stack: (e as any).stack });
            return code;
        }
    }

    async batchTransform(modules: any[], ctx: BuildContext) {
        if (!this.available || modules.length === 0) {
            log.debug(`[Transformer] Using JS Fallback (${modules.length} modules)`);
            return await Promise.all(modules.map(async (m) => {
                const transformed = await ctx.pluginManager.runHook('transformModule', {
                    code: m.content,
                    path: m.path,
                    id: m.id,
                    target: ctx.target,
                    mode: ctx.mode,
                    format: 'cjs'
                }, ctx);
                return { id: m.id, code: transformed.code };
            }));
        }

        log.debug(`[Transformer] Using Native Worker (${modules.length} modules)`);
        const batches: Record<string, any[]> = {};
        const isProd = ctx.mode === 'production' || ctx.mode === 'build';
        const minifyEnabled = isProd; // Only minify in production

        modules.forEach(m => {
            const ext = m.path.split('.').pop() || 'js';
            const loader = ['tsx', 'ts', 'jsx', 'js'].includes(ext) ? ext : 'js';
            if (!batches[loader]) batches[loader] = [];
            batches[loader].push(m);
        });

        const allResults: any[] = [];
        for (const [loader, batch] of Object.entries(batches)) {
            const config = batch.map(m => ({
                path: m.path,
                content: m.content,
                loader: loader,
                minify: minifyEnabled
            }));

            const results = await this.nativeWorker.batchTransform(config);
            results.forEach((res: any, i: number) => {
                let code = res.code;
                if (ctx.mode === 'production' || ctx.mode === 'build') {
                    code = Transformer.removeEsbuildWrappers(code);
                }
                allResults.push({ id: batch[i].id, code });
            });
        }

        return allResults;
    }

    static removeEsbuildWrappers(code: string): string {
        // High-performance boilerplate removal for Nexxo minified output (c=module, i=exports, l=require)
        let clean = code;

        // Pattern 1: ESM exports wrapper (Minified)
        // a={};u(a,{...}),c.exports=v(a);
        clean = clean.replace(
            /(\w+)\s*=\s*\{\};u\(\1,\{([^}]+)\}\),c\.exports=v\(\1\);/,
            (_, varName, exports) => {
                const exportsClean = exports.replace(/:\s*\(\)\s*=>\s*/g, ':');
                return `c.exports={${exportsClean}};`;
            }
        );

        // Pattern 2: i={};u(i,{...}),c.exports=v(i);
        clean = clean.replace(
            /i\s*=\s*\{\};u\(i,\{([^}]+)\}\),c\.exports=v\(i\);/,
            (_, exports) => {
                const exportsClean = exports.replace(/:\s*\(\)\s*=>\s*/g, ':');
                return `c.exports={${exportsClean}};`;
            }
        );

        // Pattern 3: module.exports wrapper (Unminified)
        clean = clean.replace(
            /var\s+([\w$]+)\s*=\s*\{\};[\w$]+\.u\(\1,\{([^}]+)\}\),[\w$]+\.exports=[\w$]+\.v\(\1\);/,
            (_, varName, exports) => {
                const exportsClean = exports.replace(/:\s*\(\)\s*=>\s*/g, ':');
                return `c.exports={${exportsClean}};`;
            }
        );

        // Remove helper definitions (Object.defineProperty, etc.)
        clean = clean.replace(/var\s+[a-zA-Z_$]+=Object\.defineProperty,[\s\S]*?v=x=>b\(o\(\{\},"__esModule",\{value:!0\}\),x\);/, '');
        clean = clean.replace(/var\s+o=Object\.defineProperty,[\s\S]*?v=x=>b\(o\(\{\},"__esModule",\{value:!0\}\),x\);/, '');

        // If it still has "export" at the start, it's not CJS yet.
        if (clean.includes('export ')) {
            clean = clean.replace(/export\s+const\s+(\w+)\s*=\s*/g, 'c.exports.$1 = ');
            clean = clean.replace(/export\s+default\s+/g, 'c.exports.default = ');
            clean = clean.replace(/export\s+\{([^}]+)\}/g, (_, exports) => {
                return (exports as string).split(',').map((e: string) => {
                    const trimmed = e.trim();
                    return `c.exports.${trimmed} = ${trimmed}`;
                }).join(';');
            });
        }

        return clean;
    }
}
