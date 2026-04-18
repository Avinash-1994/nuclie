/**
 * @sparx/plugin-sitemap
 * Sitemap generation
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createSitemapPlugin(): PluginAdapter {
    return {
        name: '@sparx/plugin-sitemap',
        originalPlugin: 'sparx-native',
        
        async transform(code: string, id: string) {
            // Utility: Sitemap generation
            return { code };
        }
    };
}

export default createSitemapPlugin;
