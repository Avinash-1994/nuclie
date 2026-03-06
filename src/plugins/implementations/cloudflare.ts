/**
 * @urja/plugin-cloudflare
 * Cloudflare Pages adapter
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createCloudflarePlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-cloudflare',
        originalPlugin: 'urja-native',
        
        async buildEnd() {
            console.log('[@urja/plugin-cloudflare] Deployment adapter ready');
            // Generate deployment config
        }
    };
}

export default createCloudflarePlugin;
