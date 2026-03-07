/**
 * @nuclie/plugin-analytics
 * Build analytics
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createAnalyticsPlugin(): PluginAdapter {
    return {
        name: '@nuclie/plugin-analytics',
        originalPlugin: 'nuclie-native',
        
        async transform(code: string, id: string) {
            // Utility: Build analytics
            return { code };
        }
    };
}

export default createAnalyticsPlugin;
