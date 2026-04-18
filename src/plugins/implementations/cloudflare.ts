/**
 * @sparx/plugin-cloudflare
 * Cloudflare Pages adapter
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createCloudflarePlugin(): PluginAdapter {
    return {
        name: '@sparx/plugin-cloudflare',
        originalPlugin: 'sparx-native',
        
        async buildEnd() {
            console.log('[@sparx/plugin-cloudflare] Deployment adapter ready');
            // Generate deployment config
        }
    };
}

export default createCloudflarePlugin;
