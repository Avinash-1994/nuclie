import { PluginManager } from '../src/core/plugins/manager.js';
import { WASMPluginSandbox } from '../src/core/plugins/sandbox_wasm.js';

async function run() {
    console.log('🧪 Testing core WASM plugin registration...');

    const originalCreate = WASMPluginSandbox.create;
    try {
        let createCalled = false;

        WASMPluginSandbox.create = async (buffer: Buffer) => {
            createCalled = true;
            return {
                manifest: {
                    name: 'wasm-test-plugin',
                    version: '0.0.1',
                    engineVersion: '^1.0.0',
                    type: 'wasm',
                    hooks: ['transformModule'],
                    permissions: { fs: 'none', network: 'none' }
                },
                id: 'wasm-test-plugin',
                runHook: async (hookName: string, input: any) => {
                    return `${hookName}:${JSON.stringify(input)}`;
                }
            } as any;
        };

        const pluginManager = new PluginManager();
        await pluginManager.registerWasmPlugin(Buffer.from([0x00]));

        if (!createCalled) {
            throw new Error('WASMPluginSandbox.create was not invoked');
        }

        const result = await pluginManager.runHook('transformModule', { value: 42 });
        if (result !== 'transformModule:{"value":42}') {
            throw new Error(`Unexpected hook result: ${result}`);
        }

        console.log('✅ WASM plugin registration and hook execution passed');
    } finally {
        WASMPluginSandbox.create = originalCreate;
    }
}

run().catch(error => {
    console.error('❌ WASM plugin manager regression test failed:', error);
    process.exit(1);
});
