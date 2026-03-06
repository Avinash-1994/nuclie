/**
 * @urja/plugin-netlify
 * Netlify deployment adapter
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createNetlifyPlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-netlify',
        originalPlugin: 'urja-native',
        
        async buildEnd() {
            console.log('[@urja/plugin-netlify] Deployment adapter ready');
            // Generate deployment config
        }
    };
}

export default createNetlifyPlugin;
