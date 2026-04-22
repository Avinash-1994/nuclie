/**
 * Phase 1.8 — Chunker + DCE Tests
 * Validates the native sparxChunk function for splitting graphs and tree shaking.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const _require = createRequire(import.meta.url);

function log(msg) { process.stdout.write(msg + '\n'); }
function pass(label, detail = '') { log(`  ✅ ${label}${detail ? ' — ' + detail : ''}`); }
function fail(label, reason)     { throw new Error(`FAIL [${label}]: ${reason}`); }

async function getNative() {
    const candidates = [
        path.resolve(__dirname, '../../../sparx_native.node'),
        path.resolve(__dirname, '../../sparx_native.node'),
        path.resolve(process.cwd(), 'sparx_native.node'),
        path.resolve(process.cwd(), 'dist/sparx_native.node'),
    ];
    for (const p of candidates) {
        try { return _require(p); } catch {}
    }
    return null;
}

async function run() {
    log('\n══════════════════════════════════════════════════');
    log(' Phase 1.8 — Chunker + DCE (Tree Shaking) Tests');
    log('══════════════════════════════════════════════════\n');

    const native = await getNative();
    if (!native) {
        throw new Error("Native module not found");
    }

    // 1. Generate a mock dependency graph as it would be produced by SWC/Esbuild trace
    const graphJson = JSON.stringify({
        modules: [
            { id: 'src/main.jsx', sizeBytes: 1500, imports: ['react', 'react-dom/client', 'routes/Home.jsx', 'routes/Cart.jsx'] },
            { id: 'react', sizeBytes: 50000, imports: [] },
            { id: 'react-dom/client', sizeBytes: 150000, imports: ['react'] },
            { id: 'routes/Home.jsx', sizeBytes: 3000, imports: ['store/cartStore.js', 'utils/dateFormatter.js', 'date-fns'] },
            { id: 'routes/Cart.jsx', sizeBytes: 2500, imports: ['store/cartStore.js'] },
            { id: 'store/cartStore.js', sizeBytes: 5000, imports: ['zustand'] },
            { id: 'zustand', sizeBytes: 25000, imports: ['react'] },
            { id: 'utils/dateFormatter.js', sizeBytes: 1200, imports: ['date-fns'] },
            { id: 'date-fns', sizeBytes: 80000, imports: [] },
            
            // This file is NOT imported anywhere. It should be eliminated.
            { id: 'utils/deadCode.js', sizeBytes: 1000, imports: [] }
        ]
    });

    const config = {
        strategy: 'optimal',
        maxChunkSizeKb: 100, // Make chunks relatively small to force splitting
        entryPoints: ['src/main.jsx']
    };

    // Call the native chunk algorithm
    const result = native.sparxChunk(graphJson, config);

    // TEST 1: Dead Code Elimination (Module Level)
    log('TEST 1: Module-level DCE (Unreachable code eliminated)');
    if (!result.eliminated.includes('utils/deadCode.js')) {
        fail('DCE1', 'utils/deadCode.js was not eliminated');
    }
    if (result.eliminated.includes('src/main.jsx') || result.eliminated.includes('react')) {
         fail('DCE1', 'Live code was incorrectly eliminated');
    }
    pass('Unreachable modules correctly eliminated', `Eliminated: ${result.eliminated.join(', ')}`);

    // TEST 2: Chunk Limit & Distribution
    log('TEST 2: Chunk sizing and splitting thresholds');
    let violatedChunks = result.chunks.filter(c => c.sizeBytes > 105 * 1024); // Give slight slack
    // We expect react-dom to violate because it is 150KB alone, meaning it goes into its own chunk, but everything else is bound
    const domChunk = violatedChunks.find(c => c.modules.includes('react-dom/client'));
    if (domChunk) {
        violatedChunks = violatedChunks.filter(c => c !== domChunk);
    }
    if (violatedChunks.length > 0) {
        fail('LIMIT1', `Chunks exceeded size limit: ${JSON.stringify(violatedChunks)}`);
    }
    if (result.chunks.length < 2) {
        fail('LIMIT1', 'Modules were not split into chunks');
    }
    pass('Chunk size limits respected', `Generated ${result.chunks.length} chunks`);

    // TEST 3: Common Deduplication
    log('TEST 3: Common vendor modules distributed successfully');
    // Ensure 'react' isn't placed in multiple disjoint chunks.
    const chunksWithReact = result.chunks.filter(c => c.modules.includes('react'));
    if (chunksWithReact.length > 1) {
        fail('DEDUP1', 'React was placed in multiple chunks');
    } else if (chunksWithReact.length === 0) {
        fail('DEDUP1', 'React missing from chunks');
    }
    pass('Vendor modulus deduplicated successfully', 'React placed exactly once');

    // TEST 4: Stats calculation
    log('TEST 4: Graph health metrics calculated correctly');
    if (result.totalModules !== 10) fail('STATS1', `Expected 10 total modules, got ${result.totalModules}`);
    if (result.liveModules !== 9) fail('STATS1', `Expected 9 live modules, got ${result.liveModules}`);
    pass('Graph statistics computed accurately', `${result.liveModules} / ${result.totalModules} modules active`);

    log('\n══════════════════════════════════════════════════');
    log(' ✅ Phase 1.8 — ALL TESTS PASSED');
    log('══════════════════════════════════════════════════\n');
}

run().catch(e => {
    log(`\nFatal Test Error: ${e.message ?? e}`);
    process.exit(1);
});
