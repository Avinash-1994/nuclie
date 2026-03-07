/**
 * @nuclie/plugin-vercel
 * Vercel deployment adapter
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createVercelPlugin(): PluginAdapter {
    return {
        name: '@nuclie/plugin-vercel',
        originalPlugin: 'nuclie-native',
        
        async buildEnd() {
            console.log('[@nuclie/plugin-vercel] Deployment adapter ready');
            // Generate deployment config
        }
    };
}

export default createVercelPlugin;
