import type { NuclieAdapter, Plugin, NuclieConfig, PackageJson, Middleware } from '@nuclie/adapter-core';
import { detectDependencies, registry } from '@nuclie/adapter-core';
import { analogCompilerPlugin } from './analog-plugin.js';

export interface AnalogConfig {
  ssr?: boolean;           // default: true
  prerender?: string[];    // default: ['/']
}

export class AnalogAdapter implements NuclieAdapter {
  name = 'analog';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['@analogjs/router', '@analogjs/vite-plugin-angular']);
  }

  plugins(): Plugin[] {
    return [
      analogCompilerPlugin()
    ];
  }

  config(config: NuclieConfig): NuclieConfig {
    if (!config.analog) config.analog = {};
    config.analog = {
      ssr: true,
      prerender: ['/'],
      ...(config.analog || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    return [
       async (req: any, res: any, next: any) => {
          try {
             // Analog operates fundamentally on Vite's SSR APIs + Nitro
             const virtualEntry = 'virtual:nuclie/analog-ssr-entry';
             let render: any;
             try {
                const mod = await import(virtualEntry);
                render = mod.default || mod.render;
             } catch(e) {
                return next();
             }

             if (render) {
                const url = `http://${req.headers.host || 'localhost'}${req.url || '/'}`;
                // Map the request fully
                const html = await render(url, { req, res });
                if (html) {
                   res.writeStatus('200 OK');
                   res.writeHeader('Content-Type', 'text/html');
                   res.end(html);
                   return;
                }
             }
             next();
          } catch(e) {
             console.error('[Nuclie:Analog] SSR Error', e);
             next();
          }
       }
    ];
  }

  ssrEntry(): string {
     return 'src/main.server.ts';
  }
}

registry.register(new AnalogAdapter());
