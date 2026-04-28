import { createRequire } from 'module';
import * as path from 'path';
import * as crypto from 'crypto';
import Database from 'better-sqlite3';

const require = createRequire(import.meta.url);

export interface AngularAdapterOptions {
  jit?: boolean;
  tsconfig?: string;
}

export class AngularCompilerAdapter {
  private cacheDb: Database.Database;
  private compilerCli: any;
  
  constructor(private rootPath: string, private options: AngularAdapterOptions = {}) {
    // Initialize SQLite Cache
    const cacheDir = path.join(this.rootPath, '.sparx');
    try {
      // Create cache dir if it doesn't exist. In real world we use fs.mkdirSync
      import('fs').then(fs => {
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      });
      this.cacheDb = new Database(path.join(cacheDir, 'angular-cache.db'));
      this.cacheDb.exec(`
        CREATE TABLE IF NOT EXISTS ng_cache (
          hash TEXT PRIMARY KEY,
          code TEXT,
          map TEXT,
          timestamp INTEGER
        )
      `);
    } catch (e) {
      // Fallback to in-memory if DB fails
      this.cacheDb = new Database(':memory:');
    }

    // Try resolving @angular/compiler-cli
    try {
      this.compilerCli = require('@angular/compiler-cli');
    } catch (e) {
      this.compilerCli = null; // Will fallback to SWC/stub in tests
    }
  }

  private getCache(hash: string): { code: string, map?: string } | null {
    try {
      const stmt = this.cacheDb.prepare('SELECT code, map FROM ng_cache WHERE hash = ?');
      const row = stmt.get(hash) as any;
      if (row) return { code: row.code, map: row.map };
    } catch (e) { /* ignore */ }
    return null;
  }

  private setCache(hash: string, code: string, map?: string) {
    try {
      const stmt = this.cacheDb.prepare('INSERT OR REPLACE INTO ng_cache (hash, code, map, timestamp) VALUES (?, ?, ?, ?)');
      stmt.run(hash, code, map || '', Date.now());
    } catch (e) { /* ignore */ }
  }

  private hashSource(source: string, id: string): string {
    return crypto.createHash('sha256').update(source).update(id).digest('hex');
  }

  /**
   * Main transform hook for Sparx Plugin Runner
   */
  async transform(code: string, id: string): Promise<{ code: string; map?: any } | null> {
    if (!id.endsWith('.ts') && !id.endsWith('.html') && !id.endsWith('.css') && !id.endsWith('.scss')) {
      return null;
    }

    const hash = this.hashSource(code, id);
    const cached = this.getCache(hash);
    if (cached) {
      return { code: cached.code, map: cached.map ? JSON.parse(cached.map) : undefined };
    }

    let transformedCode = code;
    let sourceMap = undefined;

    if (id.endsWith('.ts')) {
      // 1. Angular Compiler CLI hooks (mocked behavior for now)
      if (this.compilerCli && code.includes('@Component')) {
        // Pseudo-integration with ngcc / compiler-cli
        // transformedCode = this.compilerCli.compile(code);
        transformedCode = code.replace(/@Component\s*\({[\s\S]*?}\)/g, '/* Angular Component Compiled */');
      }

      // 2. SWC Downlevel
      try {
        const swc = require('@swc/core');
        const res = await swc.transform(transformedCode, {
          jsc: {
            parser: { syntax: 'typescript', decorators: true },
            transform: { legacyDecorator: true, decoratorMetadata: true },
            target: 'es2022'
          },
          sourceMaps: true
        });
        transformedCode = res.code;
        sourceMap = res.map;
      } catch (e) {
        // Fallback if SWC not installed
        transformedCode = transformedCode.replace(/import /g, '// import '); // Dummy transform
      }
    } 
    else if (id.endsWith('.css') || id.endsWith('.scss')) {
      // 3. LightningCSS Styles & ViewEncapsulation
      try {
        const lightningcss = require('lightningcss');
        const res = lightningcss.transform({
          filename: id,
          code: Buffer.from(code),
          minify: true,
          sourceMap: true,
          cssModules: false // Angular uses its own ViewEncapsulation mapping
        });
        transformedCode = res.code.toString();
        // Emulate ViewEncapsulation by adding fake host attributes
        transformedCode = transformedCode.replace(/([\.#a-zA-Z0-9_-]+)\s*\{/g, '$1[_ngcontent-app-c] {');
      } catch (e) {
        // Fallback
        transformedCode = code.replace(/([\.#a-zA-Z0-9_-]+)\s*\{/g, '$1[_ngcontent-app-c] {');
      }
    }

    this.setCache(hash, transformedCode, sourceMap ? JSON.stringify(sourceMap) : undefined);
    return { code: transformedCode, map: sourceMap ? JSON.parse(sourceMap) : undefined };
  }

  createPlugin() {
    return {
      name: 'sparx-angular-adapter',
      transform: (code: string, id: string) => this.transform(code, id)
    };
  }
}
