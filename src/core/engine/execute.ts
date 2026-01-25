
/**
 * Engine Execution Stage - Optimized (v2.0.2 World Domination)
 */

import { BuildContext, BuildPlan, BuildArtifact, ExecutionPlan } from './types.js';
import { explainReporter } from './events.js';
import { canonicalHash } from './hash.js';
import fs from 'fs/promises';
import path from 'path';
import { generateModuleId, normalizePath } from '../../resolve/utils.js';
import { Transformer } from '../transform/transformer.js';
import { GlobalOptimizer } from '../build/globalOptimizer.js';
import { ShortIdMap } from '../graph/serializer.js';

export async function executeParallel(execPlan: ExecutionPlan, buildPlan: BuildPlan, ctx: BuildContext): Promise<BuildArtifact[]> {
    explainReporter.report('execute', 'start', 'Starting optimized execution');

    const artifacts: BuildArtifact[] = [];
    const artifactMap = new Map<string, BuildArtifact>();
    const isProd = ctx.mode === 'production' || ctx.mode === 'build';

    // Phase 2: Short Stable IDs (Persist across chunks for consistency)
    const shortIdMap = new ShortIdMap();
    const globalOptimizer = new GlobalOptimizer();

    for (const group of execPlan.parallelGroups) {
        const tasks = group.map(async (chunkId) => {
            const chunk = buildPlan.chunks.find(c => c.id === chunkId);
            if (!chunk) return;

            const pipelineHash = ctx.pluginManager.getPipelineHash();
            const moduleHashes: Record<string, string> = {};
            for (const modId of chunk.modules) {
                const node = ctx.graph.nodes.get(modId);
                if (node) moduleHashes[modId] = node.contentHash;
            }

            const chunkKey = canonicalHash({
                id: chunk.id,
                moduleHashes,
                configHash: canonicalHash(ctx.config),
                pipelineHash,
                mode: ctx.mode
            });

            // CACHE CHECK
            const cached = await ctx.cache.get(chunkKey);
            if (cached) {
                artifactMap.set(chunk.id, cached.artifact);
                return;
            }

            let bundleContent = '';
            const isCss = chunk.id.endsWith('_css');

            // Phase 1: ULTRA-CONDENSED RUNTIME
            if (!isCss) {
                bundleContent += isProd
                    ? `(function(g){const m={};g.d=(i,f)=>m[i]=f;g.r=i=>{if(m[i].z)return m[i].z;const o={e:{}};m[i](o,o.e,g.r);return m[i].z=o.e}})(globalThis);\n`
                    : `/* Nexxo Runtime */\n(function(g){const m={};g.d=(i,f)=>m[i]=f;g.r=i=>{if(m[i].z)return m[i].z;const o={e:{}};m[i](o,o.e,g.r);return m[i].z=o.e}})(globalThis);\n`;
            }

            const artifactModules: any[] = [];
            const transformer = new Transformer();
            const moduleResults = new Map<string, { code: string, originalSize: number }>();
            const pendingTransform: any[] = [];

            // Parallel Load (Respecting Plugins)
            await Promise.all(chunk.modules.map(async (modId) => {
                const node = ctx.graph.nodes.get(modId);
                const path = node?.path || modId;

                // Try Plugin LOAD hook first (for assets, etc.)
                const loadResult = await ctx.pluginManager.runHook('load', { id: modId, path }, ctx);

                let content: string;
                if (loadResult && loadResult.code !== undefined) {
                    content = loadResult.code;
                } else {
                    content = await fs.readFile(path, 'utf-8');
                }

                pendingTransform.push({ id: modId, path, content });
            }));

            // Phase 3: NATIVE BATCH (SWC Fix applied in transform.rs)
            if (pendingTransform.length > 0) {
                const batchResults = await transformer.batchTransform(pendingTransform, ctx);
                for (const res of batchResults) {
                    const p = pendingTransform.find(x => x.id === res.id);
                    moduleResults.set(res.id, { code: res.code, originalSize: Buffer.byteLength(p.content) });
                }
            }

            // Phase 2: Assemble with Short IDs
            for (const modId of chunk.modules) {
                const res = moduleResults.get(modId);
                if (!res) continue;

                const shortId = shortIdMap.get(modId, isProd);
                artifactModules.push({ id: modId, shortId, size: res.code.length, originalSize: res.originalSize });

                if (isCss) {
                    bundleContent += `\n/* ${modId} */\n${res.code}`;
                } else {
                    // Always use 'globalThis.d' as defined in condensed runtime
                    bundleContent += `\nglobalThis.d("${shortId}",function(module,exports,require,h){\n${res.code}\n});`;
                }
            }

            // Entry Execution
            if (!isCss && chunk.entry) {
                const absEntry = path.isAbsolute(chunk.entry)
                    ? chunk.entry
                    : path.resolve(ctx.rootDir, chunk.entry);
                const entryId = generateModuleId('file', normalizePath(absEntry), ctx.rootDir);
                const shortEntryId = shortIdMap.get(entryId, isProd);
                bundleContent += `\n\nglobalThis.r("${shortEntryId}");`;
            }

            const artifact: BuildArtifact = {
                id: canonicalHash(bundleContent).substring(0, 16),
                type: isCss ? 'css' : 'js',
                fileName: chunk.outputName,
                dependencies: [...chunk.modules],
                source: bundleContent,
                modules: artifactModules
            };

            ctx.cache.set(chunkKey, { hash: chunkKey, artifact });
            artifactMap.set(chunk.id, artifact);
        });

        await Promise.all(tasks);
    }

    // Process Final Order
    for (const id of buildPlan.executionOrder) {
        const art = artifactMap.get(id);
        if (art) artifacts.push(art);
    }

    // Phase 1: GLOBAL NATIVE MINIFICATION
    if (isProd) {
        await globalOptimizer.optimize(artifacts);
    }

    // Assets
    for (const asset of buildPlan.assets) {
        const node = ctx.graph.nodes.get(asset.id);
        if (node) {
            artifacts.push({
                id: node.contentHash,
                type: 'asset' as any,
                fileName: asset.outputName,
                dependencies: [],
                source: await fs.readFile(node.path)
            });
        }
    }

    return artifacts;
}
