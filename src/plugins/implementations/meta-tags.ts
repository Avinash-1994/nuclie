/**
 * @sparx/plugin-meta-tags
 * SEO meta tags
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createMetaTagsPlugin(): PluginAdapter {
    return {
        name: '@sparx/plugin-meta-tags',
        originalPlugin: 'sparx-native',
        
        async transform(code: string, id: string) {
            // Utility: SEO meta tags
            return { code };
        }
    };
}

export default createMetaTagsPlugin;
