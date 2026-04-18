/**
 * @sparx/plugin-analytics
 * Build analytics
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createAnalyticsPlugin(): PluginAdapter {
    return {
        name: '@sparx/plugin-analytics',
        originalPlugin: 'sparx-native',
        
        async transform(code: string, id: string) {
            // Utility: Build analytics
            return { code };
        }
    };
}

export default createAnalyticsPlugin;
