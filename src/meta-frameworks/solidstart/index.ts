import type { NuclieAdapter, Plugin, NuclieConfig, PackageJson, Middleware } from '@nuclie/adapter-core';
import { detectDependencies, registry } from '@nuclie/adapter-core';
import { solidStartRouterPlugin } from './router-plugin.js';

export interface SolidStartConfig {
  ssr?: 'async' | 'sync' | 'stream'; // default: stream
  islands?: boolean;                   // default: false
}

export class SolidStartAdapter implements NuclieAdapter {
  name = 'solid-start';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['@solidjs/start']);
  }

  plugins(): Plugin[] {
    return [
      solidStartRouterPlugin()
    ];
  }

  config(config: NuclieConfig): NuclieConfig {
    if (!config.solid) config.solid = {};
    config.solid.start = {
      ssr: 'stream',
      islands: false,
      ...(config.solid.start || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    // Inject uWS -> SolidStart Node.js Streams H3 shim securely without utilizing Vinxi
    return [
      async (req: any, res: any, next: any) => {
        const url = req.url || '/';
        try {
          const manifestModule = 'virtual:nuclie/solidstart-routes';
          let manifest: any;
          try {
             manifest = await import(manifestModule);
          } catch(e) {
             return next();
          }

          const match = manifest.routes.find((r: any) => url.startsWith(r.uri));
          if (match && match.isApiRoute) {
             const routeExports = await match.loader();
             const handler = routeExports[req.method?.toUpperCase() || 'GET'];
             
             if (handler) {
                // Map Vinxi/H3 event signature pattern for legacy SolidStart bridging
                const event = {
                   node: { req, res },
                   path: url,
                   method: req.method
                };
                
                const response = await handler(event);
                
                if (response instanceof Response) {
                   // Standard Response pattern mapping
                   res.writeStatus(`${response.status}`);
                   response.headers.forEach((val, key) => res.writeHeader(key, val));
                   
                   // Core streaming implementation mapping SolidJS renderToStream() natively to uWS
                   if (response.body) {
                      const reader = response.body.getReader();
                      while (true) {
                         const { done, value } = await reader.read();
                         if (done) break;
                         res.write(value);
                      }
                      res.end();
                      return;
                   } else {
                      res.end(await response.text());
                      return; // Handled
                   }
                }
             }
          }
          next();
        } catch (e) {
          console.error('[Nuclie:SolidStart] SSR Component Route failure', e);
          next();
        }
      }
    ];
  }

  ssrEntry(): string {
     return 'virtual:nuclie/solidstart-routes';
  }
}

registry.register(new SolidStartAdapter());
