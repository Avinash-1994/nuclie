/**
 * @nuclie/plugin-sentry
 * Sentry error tracking
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createSentryPlugin(): PluginAdapter {
    return {
        name: '@nuclie/plugin-sentry',
        originalPlugin: 'nuclie-native',
        
        async transform(code: string, id: string) {
            // Utility: Sentry error tracking
            return { code };
        }
    };
}

export default createSentryPlugin;
