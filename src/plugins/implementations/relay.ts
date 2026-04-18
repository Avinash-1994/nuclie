/**
 * @sparx/plugin-relay
 * Relay integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createRelayPlugin(): PluginAdapter {
    return {
        name: '@sparx/plugin-relay',
        originalPlugin: 'sparx-native',
        
        async transform(code: string, id: string) {
            // Utility: Relay integration
            return { code };
        }
    };
}

export default createRelayPlugin;
