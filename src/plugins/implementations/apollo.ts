/**
 * @nuclie/plugin-apollo
 * Apollo Client integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createApolloPlugin(): PluginAdapter {
    return {
        name: '@nuclie/plugin-apollo',
        originalPlugin: 'nuclie-native',
        
        async transform(code: string, id: string) {
            // Utility: Apollo Client integration
            return { code };
        }
    };
}

export default createApolloPlugin;
