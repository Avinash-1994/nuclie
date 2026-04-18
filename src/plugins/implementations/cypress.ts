/**
 * @sparx/plugin-cypress
 * Cypress integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createCypressPlugin(): PluginAdapter {
    return {
        name: '@sparx/plugin-cypress',
        originalPlugin: 'sparx-native',
        
        async transform(code: string, id: string) {
            // Utility: Cypress integration
            return { code };
        }
    };
}

export default createCypressPlugin;
