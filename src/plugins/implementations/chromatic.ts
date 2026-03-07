/**
 * @nuclie/plugin-chromatic
 * Chromatic visual testing
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createChromaticPlugin(): PluginAdapter {
    return {
        name: '@nuclie/plugin-chromatic',
        originalPlugin: 'nuclie-native',
        
        async transform(code: string, id: string) {
            // Utility: Chromatic visual testing
            return { code };
        }
    };
}

export default createChromaticPlugin;
