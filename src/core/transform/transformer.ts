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
        const sizeInMB = Buffer.byteLength(code, 'utf8') / (1024 * 1024);
        // Skip minification for very large files (>100MB) to avoid memory issues
        if (sizeInMB > 100) {
            log.warn(`Skipping minification for large bundle (${sizeInMB.toFixed(2)}MB). Consider code splitting.`, { category: 'build' });
            return code;
        }

        try {
            const result = minifySync(code);
            if (result && result.length > 0) {
                return result;
            }
            throw new Error('Native minifier returned empty result');
        } catch (e: any) {
            // Fallback to esbuild minification if native fails
            log.debug(`Native minify failed (${e.message}), falling back to esbuild`, { category: 'build' });
            try {
                const esbuild = require('esbuild');
                // Use 'iife' format to avoid import/export statements in output.
                // Our bundle uses a custom runtime (globalThis.d/r) which is CJS-compatible.
                const result = esbuild.transformSync(code, {
                    minify: true,
                    target: 'es2020',
                    loader: 'js',
                    format: 'iife',
                    treeShaking: false,
                    legalComments: 'none',
                    // Don't try to re-interpret import/export - it's a runtime module system
                    platform: 'browser'
                });
                if (result.code && result.code.length > 0) {
                    return result.code;
                }
                throw new Error('esbuild returned empty result');
            } catch (esbuildError: any) {
                log.debug(`esbuild minification also failed (${esbuildError.message.substring(0, 120)}). Bundle size: ${sizeInMB.toFixed(2)}MB. Returning original code.`, { category: 'build' });
                return code;
            }
        }
    }

    async batchTransform(modules: any[], ctx: BuildContext) {
        if (modules.length === 0) return [];

        const results: any[] = [];
        const nativeBatch: any[] = [];
        const pluginBatch: any[] = [];

        modules.forEach(m => {
            const ext = m.path.split('.').pop()?.toLowerCase() || 'js';
            const content = m.content;

            // Conservative Native Routing (Phase G1)
            // We only use the native worker for plain JS files without framework-specific syntax.
            // TS, JSX, and anything with decorators or assets MUST go to the plugin system.
            const hasFrameworkSyntax = /<[a-zA-Z]/.test(content) || /@\w+/.test(content);
            const isPlainJs = ['js', 'mjs', 'cjs'].includes(ext);
            const isCss = ext === 'css';
            const isVue = ext === 'vue';
            const hasAssetImport = /import\s+.*from\s+['"].*\.(png|jpg|jpeg|gif|svg|css|less|scss|sass|json)['"]/.test(content) ||
                /require\(['"].*\.(png|jpg|jpeg|gif|svg|css|less|scss|sass|json)['"]\)/.test(content);

            // Day 28: Enable native CSS processing via LightningCSS
            // Day 29: Enable native Vue SFC processing
            if (this.available && (isPlainJs || isCss || isVue) && !hasFrameworkSyntax && !hasAssetImport) {
                nativeBatch.push(m);
            } else {
                pluginBatch.push(m);
            }
        });

        // A) Plugin Batch
        if (pluginBatch.length > 0) {
            const pluginResults = await Promise.all(pluginBatch.map(async (m) => {
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
            results.push(...pluginResults);
        }

        // B) Native Batch
        if (nativeBatch.length > 0) {
            const batches: Record<string, any[]> = {};
            const isProd = ctx.mode === 'production' || ctx.mode === 'build';
            const minifyEnabled = isProd;

            nativeBatch.forEach(m => {
                const ext = m.path.split('.').pop() || 'js';
                let loader = 'js';
                if (['tsx', 'ts', 'jsx', 'js'].includes(ext)) loader = ext;
                else if (ext === 'css') loader = 'css';
                else if (ext === 'vue') loader = 'vue';

                if (!batches[loader]) batches[loader] = [];
                batches[loader].push(m);
            });

            for (const [loader, batch] of Object.entries(batches)) {
                const config = batch.map(m => ({
                    path: m.path,
                    content: m.content,
                    loader: loader,
                    minify: minifyEnabled
                }));

                try {
                    const batchResults = await this.nativeWorker.batchTransform(config);
                    batchResults.forEach((res: any, i: number) => {
                        let code = res.code;
                        if (isProd) {
                            code = Transformer.removeEsbuildWrappers(code);
                        }
                        results.push({ id: batch[i].id, code });
                    });
                } catch (e) {
                    const fallbackResults = await Promise.all(batch.map(async (m) => {
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
                    results.push(...fallbackResults);
                }
            }
        }

        return results;
    }

    static removeEsbuildWrappers(code: string): string {
        // High-performance boilerplate removal for Nuclie minified
        let clean = code;

        // Pattern 1: ESM exports wrapper (Minified)
        // a={};u(a,{...}),module.exports=v(a);
        clean = clean.replace(
            /(\w+)\s*=\s*\{\};u\(\1,\{([^}]+)\}\),(?:module\.)?exports=v\(\1\);/,
            (_, varName, exports) => {
                const exportsClean = exports.replace(/:\s*\(\)\s*=>\s*/g, ':');
                return `exports={${exportsClean}};`;
            }
        );

        // Pattern 2: i={};u(i,{...}),module.exports=v(i);
        clean = clean.replace(
            /i\s*=\s*\{\};u\(i,\{([^}]+)\}\),(?:module\.)?exports=v\(i\);/,
            (_, exports) => {
                const exportsClean = exports.replace(/:\s*\(\)\s*=>\s*/g, ':');
                return `exports={${exportsClean}};`;
            }
        );

        // Pattern 3: module.exports wrapper (Unminified)
        clean = clean.replace(
            /var\s+([\w$]+)\s*=\s*\{\};[\w$]+\.u\(\1,\{([^}]+)\}\),[\w$]+\.exports=[\w$]+\.v\(\1\);/,
            (_, varName, exports) => {
                const exportsClean = exports.replace(/:\s*\(\)\s*=>\s*/g, ':');
                return `exports={${exportsClean}};`;
            }
        );

        // Safe helper removal (only if they are at the top and don't contain too much code)
        clean = clean.replace(/^var [a-zA-Z_$]+=Object\.defineProperty,[a-zA-Z_$]+=Object\.getOwnPropertyDescriptor,[a-zA-Z_$]+=Object\.getOwnPropertyNames,[a-zA-Z_$]+=Object\.prototype\.hasOwnProperty;.*?;/m, '');

        // Final ESM keyword cleanup for remaining cases
        if (clean.includes('export ')) {
            clean = clean.replace(/^export\s+const\s+(\w+)\s*=\s*/gm, 'exports.$1 = ');
            clean = clean.replace(/^export\s+default\s+/gm, 'exports.default = ');
            clean = clean.replace(/^export\s+\{([^}]+)\}/gm, (_, exports) => {
                return (exports as string).split(',').map((e: string) => {
                    const trimmed = e.trim();
                    return `exports.${trimmed} = ${trimmed}`;
                }).join(';');
            });
        }

        return clean;
    }
}
