/**
 * @sparx/plugin-graphql
 * GraphQL integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createGraphqlPlugin(): PluginAdapter {
    return {
        name: '@sparx/plugin-graphql',
        originalPlugin: 'sparx-native',
        
        async transform(code: string, id: string) {
            // Utility: GraphQL integration
            return { code };
        }
    };
}

export default createGraphqlPlugin;
