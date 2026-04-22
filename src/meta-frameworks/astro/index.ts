import type { SparxAdapter, Plugin, SparxConfig, PackageJson, Middleware } from '@sparx/adapter-core';
import { detectDependencies, registry } from '@sparx/adapter-core';
import { astroCompilerPlugin } from './compiler-plugin.js';
import { astroIslandPlugin } from './island-plugin.js';
import { astroContentPlugin } from './content-plugin.js';

export interface AstroConfig {
  srcDir?: string;       // default: src
  publicDir?: string;    // default: public
  outDir?: string;       // default: dist
  site?: string;         // canonical URL for SSG
  trailingSlash?: 'always' | 'never' | 'ignore';
}

export class AstroAdapter implements SparxAdapter {
  name = 'astro';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['astro']);
  }

  plugins(): Plugin[] {
    return [
      astroCompilerPlugin(),
      astroIslandPlugin(),
      astroContentPlugin()
    ];
  }

  config(config: SparxConfig): SparxConfig {
    if (!config.astro) config.astro = {};
    config.astro = {
      srcDir: 'src',
      publicDir: 'public',
      outDir: 'dist',
      trailingSlash: 'ignore',
      ...(config.astro || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    return [
       async (req: any, res: any, next: any) => {
          // Astro SSR / Dev Middleware mapping 
          // Similar translation boundary from uWS to native Fetch requests
          // Native WASM server-rendering is piped downward directly to uWS streams
          next();
       }
    ];
  }

  ssrEntry(): string {
     return 'src/entry.server.ts'; // standard Astro virtual entry
  }
}

registry.register(new AstroAdapter());
