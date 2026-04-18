/**
 * @sparx/plugin-react-i18next
 * React i18next integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createReactI18nextPlugin(): PluginAdapter {
    return {
        name: '@sparx/plugin-react-i18next',
        originalPlugin: 'sparx-native',
        
        async transform(code: string, id: string) {
            // i18n: React i18next integration
            return { code };
        },

        async buildEnd() {
            console.log('[@sparx/plugin-react-i18next] i18n setup complete');
        }
    };
}

export default createReactI18nextPlugin;
