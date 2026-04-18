/**
 * DevWatcher — Phase 3.3
 *
 * Tries the native Rust watcher (notify crate) first.
 * Falls back to chokidar if native module is unavailable — zero regression.
 * Per master plan: "Keep chokidar as a fallback. Print one WARN line."
 */

import { EventEmitter } from 'events';
import { explainReporter } from '../core/engine/events.js';

// ─── Try native watcher ───────────────────────────────────────────────────────
let NativeWatcher: any = null;
try {
    // Dynamically imported so chokidar fallback works if native fails to load
    const native = await import('../native/index.js');
    NativeWatcher = native.NativeWatcher;
} catch (e: any) {
    console.warn(`[sparx] Native watcher unavailable, falling back to chokidar: ${e?.message ?? e}`);
}

// ─── DevWatcher ───────────────────────────────────────────────────────────────

export class DevWatcher extends EventEmitter {
    private nativeWatcher: any = null;
    private chokidarWatcher: any = null;
    private batch: Set<string> = new Set();
    private timer: NodeJS.Timeout | null = null;
    private engine: 'native' | 'chokidar' = 'chokidar';

    constructor(private rootDir: string, private debounceMs: number = 50) {
        super();
        this.start();
    }

    private start() {
        const ignoredPatterns = [
            '**/node_modules/**', '**/.git/**', '**/dist/**', '**/.sparx/**', '**/.sparx_cache/**'
        ];

        if (NativeWatcher) {
            try {
                this.nativeWatcher = new NativeWatcher();
                this.nativeWatcher.start([this.rootDir], (_err: any, event: any) => {
                    if (_err) return;
                    // Filter out ignored paths
                    const paths: string[] = (event.paths || []).filter((p: string) =>
                        !ignoredPatterns.some(pat => {
                            const re = pat.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*');
                            return new RegExp(re).test(p);
                        })
                    );
                    if (paths.length > 0 && event.kind !== 'access') {
                        paths.forEach(p => this.addToBatch(p));
                    }
                });
                this.engine = 'native';
                return;
            } catch (err: any) {
                console.warn(`[sparx] Native watcher failed to start (${err.message}), falling back to chokidar.`);
            }
        }

        // Chokidar fallback
        this.startChokidar(ignoredPatterns);
    }

    private async startChokidar(ignored: string[]) {
        try {
            const { default: chokidar } = await import('chokidar');
            this.chokidarWatcher = chokidar.watch(this.rootDir, {
                ignored,
                ignoreInitial: true
            });
            this.chokidarWatcher.on('all', (event: string, filePath: string) => {
                if (event === 'add' || event === 'change' || event === 'unlink') {
                    this.addToBatch(filePath);
                }
            });
            this.engine = 'chokidar';
        } catch (err: any) {
            console.error(`[sparx] Both native watcher and chokidar failed: ${err.message}`);
        }
    }

    private addToBatch(filePath: string) {
        this.batch.add(filePath);
        if (this.timer) clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            const sortedBatch = Array.from(this.batch).sort();
            this.batch.clear();
            explainReporter.report('watcher', 'batch', `Batched ${sortedBatch.length} changes [${this.engine}]`);
            this.emit('change', sortedBatch);
        }, this.debounceMs);
    }

    close() {
        this.nativeWatcher?.stop?.();
        this.chokidarWatcher?.close?.();
    }
}
