/**
 * @nuclie/plugin-observability
 * Build observability
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createObservabilityPlugin(): PluginAdapter {
    return {
        name: '@nuclie/plugin-observability',
        originalPlugin: 'nuclie-native',
        
        async transform(code: string, id: string) {
            // Utility: Build observability
            return { code };
        }
    };
}

export default createObservabilityPlugin;
