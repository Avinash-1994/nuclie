import { adaptPlugin } from '../src/marketplace/plugin-adapter.js';
import { strict as assert } from 'assert';

async function runTests() {
    console.log('🧪 Testing Plugin Adapter Layer...');

    await testBasicStructure();
    await testTransformHook();
    await testResolveIdHook();

    console.log('✅ All Adapter Tests Passed!');
}

async function testBasicStructure() {
    console.log('[Test] Basic Structure');
    const plugin = { name: 'demo' };
    const adapter = adaptPlugin(plugin);

    assert.strictEqual(adapter.manifest.name, 'adapter:demo');
    assert.ok(adapter.id.startsWith('adapter:demo-'));
    assert.strictEqual(adapter.manifest.version, '0.0.0-adapter');
}

async function testTransformHook() {
    console.log('[Test] Transform Hook');
    const plugin = {
        name: 'transform-demo',
        transform: (code: string, id: string) => code + ' // ' + id
    };
    const adapter = adaptPlugin(plugin);

    const input = { code: 'const a=1;', path: 'file.js' };
    const result: any = await adapter.runHook('transformModule', input);

    assert.strictEqual(result.code, 'const a=1; // file.js');
}

async function testResolveIdHook() {
    console.log('[Test] ResolveId Hook');
    const plugin = {
        name: 'resolve-demo',
        resolveId: (source: string) => source === 'virtual' ? '\0virtual' : null
    };
    const adapter = adaptPlugin(plugin);

    const input = { source: 'virtual', importer: 'main.js' };
    const result: any = await adapter.runHook('resolveId', input);

    assert.strictEqual(result.id, '\0virtual');

    const nullInput = { source: 'missing', importer: 'main.js' };
    const nullResult = await adapter.runHook('resolveId', nullInput);
    assert.strictEqual(nullResult, null);
}

runTests().catch(e => {
    console.error('❌ Test Failed:', e);
    process.exit(1);
});
