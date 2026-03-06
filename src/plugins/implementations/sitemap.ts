/**
 * @urja/plugin-sitemap
 * Sitemap generation
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createSitemapPlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-sitemap',
        originalPlugin: 'urja-native',
        
        async transform(code: string, id: string) {
            // Utility: Sitemap generation
            return { code };
        }
    };
}

export default createSitemapPlugin;
