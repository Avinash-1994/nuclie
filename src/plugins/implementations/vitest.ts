/**
 * @urja/plugin-vitest
 * Vitest integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createVitestPlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-vitest',
        originalPlugin: 'urja-native',
        
        async transform(code: string, id: string) {
            // Utility: Vitest integration
            return { code };
        }
    };
}

export default createVitestPlugin;
