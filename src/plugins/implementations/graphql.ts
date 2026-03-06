/**
 * @urja/plugin-graphql
 * GraphQL integration
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createGraphqlPlugin(): PluginAdapter {
    return {
        name: '@urja/plugin-graphql',
        originalPlugin: 'urja-native',
        
        async transform(code: string, id: string) {
            // Utility: GraphQL integration
            return { code };
        }
    };
}

export default createGraphqlPlugin;
