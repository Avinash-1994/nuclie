/**
 * @nuclie/plugin-og-image
 * Open Graph image generation
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createOgImagePlugin(): PluginAdapter {
    return {
        name: '@nuclie/plugin-og-image',
        originalPlugin: 'nuclie-native',
        
        async transform(code: string, id: string) {
            // Utility: Open Graph image generation
            return { code };
        }
    };
}

export default createOgImagePlugin;
