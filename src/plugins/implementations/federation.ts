/**
 * @urja/plugin-federation
 * Module federation
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createFederationPlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-federation',
        originalPlugin: 'urja-native',
        
        async transform(code: string, id: string) {
            // Utility: Module federation
            return { code };
        }
    };
}

export default createFederationPlugin;
