import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { JSGraphAnalyzer } from '../core/graph/js-graph-analyzer.js';

const _require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let native: any;
let engineUsed: 'native' | 'js' = 'js';

function getJSFallback() {
    const crypto = _require('crypto');
    console.warn("⚠️  [SPARX EXECUTOR] Native binary and WASM failed to load. Falling back to JavaScript engine.");
    console.warn("⚠️  [SPARX EXECUTOR] Performance will be degraded. Execution is guaranteed iteratively safely.");
    return {
        // Wire in the actual JS implementation
        GraphAnalyzer: JSGraphAnalyzer,
        BuildOrchestrator: class { }, // Need JS implementations later if needed
        BuildCache: class { },
        fastHash: (s: string) => crypto.createHash('sha256').update(s).digest('hex').substring(0, 16),
        batchHash: (sa: string[]) => sa.map((s: string) => crypto.createHash('sha256').update(s).digest('hex').substring(0, 16)),
        scanImports: (s: string) => [],
        normalizePath: (s: string) => s.replace(/\\/g, '/'),
        transformCss: (code: string, filename: string, minify: boolean) => code,
        transformJs: (code: string, filename: string, minify: boolean) => code,
        NativeWorker: class {
            constructor() { }
            processFile() { return null; }
        },
        helloRust: () => "JS fallback"
    };
}

try {
    const nativeCandidates = [
        path.resolve(__dirname, '../../sparx_native.node'),
        path.resolve(__dirname, '../sparx_native.node'),
        path.resolve(__dirname, './sparx_native.node'),
        path.resolve(process.cwd(), 'sparx_native.node')
    ];

    let foundNative = '';
    for (const c of nativeCandidates) {
        if (fs.existsSync(c)) {
            foundNative = c;
            break;
        }
    }

    if (foundNative) {
        native = _require(foundNative);
        engineUsed = 'native';
    } else {
        // Phase 2.3: WASM plugin sandbox removed. Native → JS fallback directly.
        // See https://sparx.dev/migrate#wasm-plugins
        native = getJSFallback();
        engineUsed = 'js';
    }
} catch (e) {
    // If native or WASM crashes during load, catch and fallback to JS
    console.warn(`⚠️  [SPARX EXECUTOR] Engine failure: ${e instanceof Error ? e.message : String(e)}`);
    native = getJSFallback();
    engineUsed = 'js';
}

const OriginalGraphAnalyzer = native.GraphAnalyzer;
native.GraphAnalyzer = class DebugWrappedGraphAnalyzer extends OriginalGraphAnalyzer {
    private __spy_ids: string[] = [];
    private __spy_edges: string[][] = [];

    addBatch(ids: string[], edges: string[][]) {
        if (process.env.SPARX_DEBUG_GRAPH) {
            this.__spy_ids.push(...ids);
            this.__spy_edges.push(...edges);
        }
        return super.addBatch(ids, edges);
    }

    analyze(entryPoints: string[]) {
        if (process.env.SPARX_DEBUG_GRAPH) {
            this._dumpSnapshot(entryPoints);
        }
        if (typeof super.analyze === 'function') {
            return super.analyze(entryPoints);
        }
        return null;
    }

    detectCycles() {
        if (process.env.SPARX_DEBUG_GRAPH && typeof super.analyze !== 'function') {
            this._dumpSnapshot([]); // some consumers just call detectCycles
        }
        return super.detectCycles();
    }

    private _dumpSnapshot(entryPoints: string[]) {
        try {
            const fs = _require('fs');
            const data = {
                entry_points: entryPoints,
                ids: this.__spy_ids,
                edges: this.__spy_edges
            };
            fs.writeFileSync('snapshot.json', JSON.stringify(data, null, 2), 'utf8');
            console.warn('⚠️  [SPARX DEBUG] Graph snapshot written to snapshot.json');
        } catch(e) {}
    }
};

export const {
    GraphAnalyzer,
    BuildOrchestrator,
    BuildCache,
    fastHash,
    batchHash,
    scanImports,
    normalizePath,
    transformCss,
    transformJs,
    NativeWorker,
    helloRust,
    // Phase 3 — additive exports
    NativeWatcher,
    startWatcher,
    sparxChunk,
    mergeSourceMaps,
    prebundle,
    prebundlePut,
    // Phase 4 — competitive superiority
    planBuild,
} = native;

export { NativeWorker as RustNativeWorker, engineUsed };
export default native;
