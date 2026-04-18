/**
 * @sparx/plugin-pwa
 * Progressive Web App support
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createPwaPlugin(): PluginAdapter {
    return {
        name: '@sparx/plugin-pwa',
        originalPlugin: 'vite-plugin-pwa',
        
        async transform(code: string, id: string) {
            // Utility: Progressive Web App support
            return { code };
        }
    };
}

export default createPwaPlugin;
