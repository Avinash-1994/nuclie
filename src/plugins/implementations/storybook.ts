/**
 * @nuclie/plugin-storybook
 * Storybook integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createStorybookPlugin(): PluginAdapter {
    return {
        name: '@nuclie/plugin-storybook',
        originalPlugin: 'nuclie-native',
        
        async transform(code: string, id: string) {
            // Utility: Storybook integration
            return { code };
        }
    };
}

export default createStorybookPlugin;
