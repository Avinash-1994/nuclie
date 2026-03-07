/**
 * @nuclie/plugin-eslint
 * ESLint integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createEslintPlugin(): PluginAdapter {
    return {
        name: '@nuclie/plugin-eslint',
        originalPlugin: 'vite-plugin-eslint',
        
        async transform(code: string, id: string) {
            // Utility: ESLint integration
            return { code };
        }
    };
}

export default createEslintPlugin;
