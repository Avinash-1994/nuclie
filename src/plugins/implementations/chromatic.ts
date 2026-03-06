/**
 * @urja/plugin-chromatic
 * Chromatic visual testing
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createChromaticPlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-chromatic',
        originalPlugin: 'urja-native',
        
        async transform(code: string, id: string) {
            // Utility: Chromatic visual testing
            return { code };
        }
    };
}

export default createChromaticPlugin;
