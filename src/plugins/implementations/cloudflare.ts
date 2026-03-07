/**
 * @nuclie/plugin-cloudflare
 * Cloudflare Pages adapter
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createCloudflarePlugin(): PluginAdapter {
    return {
        name: '@nuclie/plugin-cloudflare',
        originalPlugin: 'nuclie-native',
        
        async buildEnd() {
            console.log('[@nuclie/plugin-cloudflare] Deployment adapter ready');
            // Generate deployment config
        }
    };
}

export default createCloudflarePlugin;
