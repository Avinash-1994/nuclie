/**
 * @urja/plugin-cypress
 * Cypress integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createCypressPlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-cypress',
        originalPlugin: 'urja-native',
        
        async transform(code: string, id: string) {
            // Utility: Cypress integration
            return { code };
        }
    };
}

export default createCypressPlugin;
