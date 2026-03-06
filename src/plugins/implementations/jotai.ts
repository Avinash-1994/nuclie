/**
 * @urja/plugin-jotai
 * Jotai state management
 * Urja-native
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createJotaiPlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-jotai',
        originalPlugin: 'urja-native',
        
        async transform(code: string, id: string) {
            // jotai transformation
            if (id.endsWith('.js')) {
                // Add jotai runtime
                const transformed = `
// jotai HMR Runtime
if (import.meta.hot) {
    import.meta.hot.accept();
}

${code}
                `;
                return { code: transformed };
            }
            return { code };
        },

        async resolveId(source: string) {
            // Resolve jotai imports
            if (source.startsWith('jotai')) {
                return { id: source, external: false };
            }
            return null;
        }
    };
}

export default createJotaiPlugin;
