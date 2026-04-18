
import { SparxPlugin, PluginHookName, PluginManifest } from './types.js';
import { canonicalHash } from '../engine/hash.js';

export class WASMPluginSandbox implements SparxPlugin {
    manifest: PluginManifest;
    id: string;
    private instance: WebAssembly.Instance;
    private memory: WebAssembly.Memory;
    private nextStringPtr = 1024;

    constructor(wasmBuffer: Buffer, manifest: PluginManifest, instance: WebAssembly.Instance) {
        this.manifest = manifest;
        this.id = canonicalHash(`${manifest.name}@${manifest.version}`);
        this.instance = instance;
        this.memory = (instance.exports.memory as WebAssembly.Memory);
    }

    static async create(wasmBuffer: Buffer): Promise<WASMPluginSandbox> {
        const memory = new WebAssembly.Memory({ initial: 10, maximum: 100 });

        // No FS / network imports allowed for WASM plugins.
        const importObject = {
            env: {
                memory,
                abort: () => { throw new Error('WASM Plugin Aborted'); }
            }
        };

        const wasmResult = await WebAssembly.instantiate(wasmBuffer, importObject) as any;
        const instance = wasmResult.instance || wasmResult;
        const exports = instance.exports as any;

        if (exports._init) {
            exports._init();
        }

        if (!exports._get_manifest) {
            throw new Error('WASM Plugin missing _get_manifest');
        }

        const manifestPtr = exports._get_manifest();
        const manifestJson = readString(memory, manifestPtr);
        const manifest = JSON.parse(manifestJson) as PluginManifest;

        if (manifest.type !== 'wasm') {
            throw new Error('WASM Plugin manifest must declare type "wasm"');
        }

        return new WASMPluginSandbox(wasmBuffer, manifest, instance);
    }

    async runHook(hookName: PluginHookName, input: any): Promise<any> {
        const exports = this.instance.exports as any;

        if (!exports._run_hook) {
            return input;
        }

        const inputJson = JSON.stringify(input);
        const inputPtr = this.writeString(exports, inputJson);
        const hookNamePtr = this.writeString(exports, hookName);

        const resultPtr = exports._run_hook(hookNamePtr, inputPtr, inputJson.length);
        const resultJson = readString(this.memory, resultPtr);

        return JSON.parse(resultJson);
    }

    private writeString(exports: any, str: string): number {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);

        let ptr: number;
        if (exports.malloc) {
            ptr = exports.malloc(bytes.length + 1);
            if (ptr === 0) {
                throw new Error('WASM Plugin out of memory while allocating string');
            }
        } else {
            ptr = this.nextStringPtr;
            this.nextStringPtr += bytes.length + 1;
            if (this.nextStringPtr > this.memory.buffer.byteLength) {
                throw new Error('WASM Plugin out of memory while allocating string');
            }
        }

        const view = new Uint8Array(this.memory.buffer, ptr, bytes.length + 1);
        view.set(bytes);
        view[bytes.length] = 0;

        return ptr;
    }
}

function readString(memory: WebAssembly.Memory, ptr: number): string {
    const bytes = new Uint8Array(memory.buffer, ptr);
    let end = 0;
    while (bytes[end] !== 0) {
        end++;
    }
    return new TextDecoder().decode(bytes.slice(0, end));
}
