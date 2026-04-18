/**
 * @sparx/plugin-visualizer
 * WebGPU dependency visualizer
 */

import { PluginAdapter } from '../ported/adapter.js';

export function createVisualizerPlugin(): PluginAdapter {
    return {
        name: '@sparx/plugin-visualizer',
        originalPlugin: 'sparx-native',
        
        async transform(code: string, id: string) {
            // Utility: WebGPU dependency visualizer
            return { code };
        }
    };
}

export default createVisualizerPlugin;
