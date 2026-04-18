import type { NuclieAdapter, Plugin, NuclieConfig, PackageJson, Middleware } from '@nuclie/adapter-core';
import { detectDependencies, registry } from '@nuclie/adapter-core';
import { vitepressMarkdownPlugin } from './press-plugin.js';

export interface VitePressConfig {
  srcDir?: string;       // default '.'
  outDir?: string;       // default '.vitepress/dist'
  cleanUrls?: boolean;   // default false
}

export class VitePressAdapter implements NuclieAdapter {
  name = 'vitepress';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['vitepress']);
  }

  plugins(): Plugin[] {
    return [
      vitepressMarkdownPlugin()
    ];
  }

  config(config: NuclieConfig): NuclieConfig {
    if (!config.vitepress) config.vitepress = {};
    config.vitepress = {
      srcDir: '.',
      outDir: '.vitepress/dist',
      cleanUrls: false,
      ...(config.vitepress || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    return [
       async (req: any, res: any, next: any) => {
          // Typically VitePress relies entirely on statically generated Vue chunks + Markdown
          // Server middleware here just handles direct Dev Server SSR Markdown resolution on the fly
          next();
       }
    ];
  }

  ssrEntry(): string {
     return 'vitepress/dist/client/app/exports.js';
  }
}

registry.register(new VitePressAdapter());
