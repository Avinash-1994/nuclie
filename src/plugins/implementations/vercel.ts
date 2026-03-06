/**
 * @urja/plugin-vercel
 * Vercel deployment adapter
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createVercelPlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-vercel',
        originalPlugin: 'urja-native',
        
        async buildEnd() {
            console.log('[@urja/plugin-vercel] Deployment adapter ready');
            // Generate deployment config
        }
    };
}

export default createVercelPlugin;
