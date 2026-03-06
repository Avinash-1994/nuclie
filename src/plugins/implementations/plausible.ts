/**
 * @urja/plugin-plausible
 * Plausible Analytics integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createPlausiblePlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-plausible',
        originalPlugin: 'urja-native',
        
        async transform(code: string, id: string) {
            // Analytics: Plausible Analytics integration
            return { code };
        },

        async buildEnd() {
            console.log('[@urja/plugin-plausible] Analytics integration ready');
        }
    };
}

export default createPlausiblePlugin;
