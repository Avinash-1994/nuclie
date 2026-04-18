/**
 * @sparx/plugin-vuex
 * Vuex integration
 * Sparx-native
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createVuexPlugin(): PluginAdapter {
    return {
        name: '@sparx/plugin-vuex',
        originalPlugin: 'sparx-native',
        
        async transform(code: string, id: string) {
            // vuex transformation
            if (id.endsWith('.js')) {
                // Add vuex runtime
                const transformed = `
// vuex HMR Runtime
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
            // Resolve vuex imports
            if (source.startsWith('vuex')) {
                return { id: source, external: false };
            }
            return null;
        }
    };
}

export default createVuexPlugin;
