/**
 * @urja/plugin-redux
 * Redux integration
 * Urja-native
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createReduxPlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-redux',
        originalPlugin: 'urja-native',
        
        async transform(code: string, id: string) {
            // redux transformation
            if (id.endsWith('.js')) {
                // Add redux runtime
                const transformed = `
// redux HMR Runtime
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
            // Resolve redux imports
            if (source.startsWith('redux')) {
                return { id: source, external: false };
            }
            return null;
        }
    };
}

export default createReduxPlugin;
