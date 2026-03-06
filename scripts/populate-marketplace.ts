
/**
 * populate-marketplace.ts
 * Mass publishes 20 Core Plugins to local Urja Registry
 * Day 12: Curated Plugin Suite Lock
 */

import { MarketplaceClient } from '../src/marketplace/client.js';
import * as fs from 'fs';
import * as path from 'path';

const PLUGINS = [
    { name: '@urja/plugin-react', desc: 'Secure React Fast Refresh & JSX' },
    { name: '@urja/plugin-vue', desc: 'Vue 3 SFC Compiler (Sandboxed)' },
    { name: '@urja/plugin-svelte', desc: 'Svelte 5 Compiler & HMR' },
    { name: '@urja/plugin-solid', desc: 'SolidJS Fine-grained Reactivity' },
    { name: '@urja/plugin-lit', desc: 'Web Components & Lit Support' },
    { name: '@urja/plugin-angular', desc: 'Angular Ivy Compat' },
    { name: '@urja/plugin-postcss', desc: 'PostCSS 8 Adapter' },
    { name: '@urja/plugin-tailwindcss', desc: 'Tailwind JIT Engine' },
    { name: '@urja/plugin-sass', desc: 'Dart Sass (WASM)' },
    { name: '@urja/plugin-less', desc: 'Less CSS Support' },
    { name: '@urja/plugin-mdx', desc: 'Markdown to JSX' },
    { name: '@urja/plugin-optimize-css', desc: 'CSS Minification' },
    { name: '@urja/plugin-terser', desc: 'JS Minification (Terser)' },
    { name: '@urja/plugin-visualizer', desc: 'Bundle Analysis UI' },
    { name: '@urja/plugin-audit', desc: 'Lighthouse & Performance Audit' },
    { name: '@urja/plugin-pwa', desc: 'PWA Manifest & Service Workers' },
    { name: '@urja/plugin-legacy', desc: 'Polyfills for older browsers' },
    { name: '@urja/plugin-compression', desc: 'Gzip/Brotli Compression' },
    { name: '@urja/plugin-inspector', desc: 'DevTools & Debugging Overlay' },
    { name: '@urja/plugin-wasm', desc: 'Native WASM Modules Support' }
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
            author: 'Urja Core Team',
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
