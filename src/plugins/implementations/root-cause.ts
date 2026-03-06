/**
 * @urja/plugin-root-cause
 * Error root cause analysis
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createRootCausePlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-root-cause',
        originalPlugin: 'urja-native',
        
        async transform(code: string, id: string) {
            // Utility: Error root cause analysis
            return { code };
        }
    };
}

export default createRootCausePlugin;
