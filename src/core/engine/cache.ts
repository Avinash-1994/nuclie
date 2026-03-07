
import { BuildCache, CachedResult } from './types.js';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export class InMemoryBuildCache implements BuildCache {
    private store = new Map<string, CachedResult>();

    get(key: string): CachedResult | null {
        return this.store.get(key) || null;
    }

    set(key: string, value: CachedResult): void {
        this.store.set(key, value);
    }

    clear() {
        this.store.clear();
    }

    close() { }
}

export class PersistentBuildCache implements BuildCache {
    private cacheDir: string;

    constructor(rootDir: string) {
        this.cacheDir = path.join(rootDir, '.nuclie_cache');
    }

    private async getDb() {
        try {
            const { getLazyCacheDatabase } = await import('../cache/lazy-init.js');
            return await getLazyCacheDatabase(this.cacheDir);
        } catch (e: any) {
            // Fallback to Memory Cache on Lock Error (Robustness)
            if (e.message?.includes('Lock') || e.message?.includes('IO error') || e.message?.includes('Resource temporarily unavailable')) {
                const { log } = await import('../../utils/logger.js');
                log.warn(`Cache locked, falling back to in-memory cache: ${e.message}`, { category: 'cache' });

                // Return a mock DB interface that uses an in-memory map
                const store = new Map<string, string>();
                return {
                    get: (k: string) => store.get(k),
                    set: (k: string, v: string) => store.set(k, v),
                    clearAll: () => store.clear(),
                    close: () => { }
                };
            }
            throw e;
        }
    }

    get(key: string): CachedResult | null {
        // BuildCache.get is synchronous in type, but RocksDB is fast enough 
        // that we can potentially use a sync bridge or just handle it.
        // Actually, the BuildCache interface expects sync. 
        // For Module 8, we will use the async version for better perf, 
        // but for compatibility we'll use a trick if needed.
        // Let's assume we can make the engine await cache results.
        return null; // Will be handled by the async flow in engine
    }

    async getAsync(key: string): Promise<CachedResult | null> {
        const db = await this.getDb();
        const val = db.get(key);
        if (val) return JSON.parse(val);
        return null;
    }

    async set(key: string, value: CachedResult): Promise<void> {
        const db = await this.getDb();
        db.set(key, JSON.stringify(value));
    }

    async clear(): Promise<void> {
        const db = await this.getDb();
        db.clearAll();
    }

    async close(): Promise<void> {
        // Managed by global lazy cache
    }
}
