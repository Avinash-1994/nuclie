
/**
 * populate-marketplace.ts
 * Mass publishes 20 Core Plugins to local Nuclie Registry
 * Day 12: Curated Plugin Suite Lock
 */

import { MarketplaceClient } from '../src/marketplace/client.js';
import * as fs from 'fs';
import * as path from 'path';

const PLUGINS = [
    { name: '@nuclie/plugin-react', desc: 'Secure React Fast Refresh & JSX' },
    { name: '@nuclie/plugin-vue', desc: 'Vue 3 SFC Compiler (Sandboxed)' },
    { name: '@nuclie/plugin-svelte', desc: 'Svelte 5 Compiler & HMR' },
    { name: '@nuclie/plugin-solid', desc: 'SolidJS Fine-grained Reactivity' },
    { name: '@nuclie/plugin-lit', desc: 'Web Components & Lit Support' },
    { name: '@nuclie/plugin-angular', desc: 'Angular Ivy Compat' },
    { name: '@nuclie/plugin-postcss', desc: 'PostCSS 8 Adapter' },
    { name: '@nuclie/plugin-tailwindcss', desc: 'Tailwind JIT Engine' },
    { name: '@nuclie/plugin-sass', desc: 'Dart Sass (WASM)' },
    { name: '@nuclie/plugin-less', desc: 'Less CSS Support' },
    { name: '@nuclie/plugin-mdx', desc: 'Markdown to JSX' },
    { name: '@nuclie/plugin-optimize-css', desc: 'CSS Minification' },
    { name: '@nuclie/plugin-terser', desc: 'JS Minification (Terser)' },
    { name: '@nuclie/plugin-visualizer', desc: 'Bundle Analysis UI' },
    { name: '@nuclie/plugin-audit', desc: 'Lighthouse & Performance Audit' },
    { name: '@nuclie/plugin-pwa', desc: 'PWA Manifest & Service Workers' },
    { name: '@nuclie/plugin-legacy', desc: 'Polyfills for older browsers' },
    { name: '@nuclie/plugin-compression', desc: 'Gzip/Brotli Compression' },
    { name: '@nuclie/plugin-inspector', desc: 'DevTools & Debugging Overlay' },
    { name: '@nuclie/plugin-wasm', desc: 'Native WASM Modules Support' }
];

const TEMP_DIR = path.resolve('.temp_plugins');

async function run() {
    console.log('🚀 Populating Marketplace with 20 Core Plugins...');
    fs.mkdirSync(TEMP_DIR, { recursive: true });

    let count = 0;
    const start = performance.now();

    for (const p of PLUGINS) {
        // Create Mock Binary (Header + random filler to be unique)
        const filler = Buffer.from(p.name);
        // Valid WASM Header: 00 61 73 6D 01 00 00 00
        const header = Buffer.from('0061736d01000000', 'hex');
        const binary = Buffer.concat([header, filler]);

        const filePath = path.join(TEMP_DIR, `${p.name.replace('/', '_')}.wasm`);
        fs.writeFileSync(filePath, binary);

        const meta = {
            name: p.name,
            version: '1.0.0',
            author: 'Nuclie Core Team',
            description: p.desc,
            permissions: { network: false, fs: false } // Zero-trust default
        };

        try {
            await MarketplaceClient.publish(filePath, meta);
            count++;
        } catch (e: any) {
            console.error(`Failed to publish ${p.name}:`, e.message);
        }
    }

    // Cleanup
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });

    const totalTime = performance.now() - start;
    console.log(`\n✅ Published ${count}/${PLUGINS.length} plugins in ${totalTime.toFixed(2)}ms`);
    console.log(`⚡ Average: ${(totalTime / count).toFixed(2)}ms/plugin`);
}

run().catch(e => console.error(e));
