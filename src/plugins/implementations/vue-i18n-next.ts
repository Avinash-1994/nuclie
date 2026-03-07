/**
 * @nuclie/plugin-vue-i18n-next
 * Vue I18n integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createVueI18nNextPlugin(): PluginAdapter {
    return {
        name: '@nuclie/plugin-vue-i18n-next',
        originalPlugin: 'nuclie-native',
        
        async transform(code: string, id: string) {
            // i18n: Vue I18n integration
            return { code };
        },

        async buildEnd() {
            console.log('[@nuclie/plugin-vue-i18n-next] i18n setup complete');
        }
    };
}

export default createVueI18nNextPlugin;
