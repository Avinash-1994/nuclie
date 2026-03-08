import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const _require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let native: any;
try {
    const candidates = [
        path.resolve(__dirname, '../../nuclie_native.node'),
        path.resolve(__dirname, '../nuclie_native.node'),
        path.resolve(__dirname, './nuclie_native.node'),
        path.resolve(process.cwd(), 'nuclie_native.node')
    ];

    let found = '';
    for (const c of candidates) {
        if (fs.existsSync(c)) {
            found = c;
            break;
        }
    }

    if (found) {
        native = _require(found);
    } else {
        // Native binary not found — use JS fallback stubs
        const crypto = _require('crypto');
        native = {
            GraphAnalyzer: class { },
            BuildOrchestrator: class { },
            BuildCache: class { },
            fastHash: (s: string) => crypto.createHash('sha256').update(s).digest('hex').substring(0, 16),
            batchHash: (sa: string[]) => sa.map((s: string) => crypto.createHash('sha256').update(s).digest('hex').substring(0, 16)),
            scanImports: (s: string) => [],
            normalizePath: (s: string) => s.replace(/\\/g, '/'),
            PluginRuntime: class { },
            NativeWorker: class {
                constructor() { }
                processFile() { return null; }
            },
            helloRust: () => "JS fallback"
        };
    }
} catch (e) {
    // Load error — use JS fallback stubs
    const crypto = _require('crypto');
    native = {
        GraphAnalyzer: class { },
        BuildOrchestrator: class { },
        BuildCache: class { },
        fastHash: (s: string) => crypto.createHash('sha256').update(s).digest('hex').substring(0, 16),
        batchHash: (sa: string[]) => sa.map((s: string) => crypto.createHash('sha256').update(s).digest('hex').substring(0, 16)),
        scanImports: (s: string) => [],
        normalizePath: (s: string) => s.replace(/\\/g, '/'),
        PluginRuntime: class { },
        NativeWorker: class {
            constructor() { }
            processFile() { return null; }
        },
        helloRust: () => "JS fallback"
    };
}

export const {
    GraphAnalyzer,
    BuildOrchestrator,
    BuildCache,
    fastHash,
    batchHash,
    scanImports,
    normalizePath,
    PluginRuntime,
    NativeWorker,
    helloRust
} = native;

export { NativeWorker as RustNativeWorker };
export default native;
