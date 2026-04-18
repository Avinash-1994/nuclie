/**
 * @sparx/plugin-testing-library
 * Testing Library integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createTestingLibraryPlugin(): PluginAdapter {
    return {
        name: '@sparx/plugin-testing-library',
        originalPlugin: 'sparx-native',
        
        async transform(code: string, id: string) {
            // Utility: Testing Library integration
            return { code };
        }
    };
}

export default createTestingLibraryPlugin;
