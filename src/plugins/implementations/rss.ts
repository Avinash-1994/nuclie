/**
 * @urja/plugin-rss
 * RSS feed generation
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createRssPlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-rss',
        originalPlugin: 'urja-native',
        
        async transform(code: string, id: string) {
            // Utility: RSS feed generation
            return { code };
        }
    };
}

export default createRssPlugin;
