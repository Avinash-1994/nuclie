/**
 * @urja/plugin-mdx
 * MDX support
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createMdxPlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-mdx',
        originalPlugin: 'urja-native',
        
        async transform(code: string, id: string) {
            // Utility: MDX support
            return { code };
        }
    };
}

export default createMdxPlugin;
