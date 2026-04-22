import type { SparxAdapter, Plugin, SparxConfig, PackageJson, Middleware } from '@sparx/adapter-core';
import { detectDependencies, registry } from '@sparx/adapter-core';
import { tsRouterPlugin } from './router-plugin.js';

export interface TanStackConfig {
  ssr?: boolean;           // default: true
  serverOnly?: boolean;    // default: false
}

export class TanStackAdapter implements SparxAdapter {
  name = 'tanstack-start';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['@tanstack/start', '@tanstack/react-start']);
  }

  plugins(): Plugin[] {
    return [
      tsRouterPlugin()
    ];
  }

  config(config: SparxConfig): SparxConfig {
    if (!config.tanstack) config.tanstack = {};
    config.tanstack = {
      ssr: true,
      ...(config.tanstack || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    return [
       async (req: any, res: any, next: any) => {
          try {
             const virtualEntry = 'virtual:sparx/tanstack-routes';
             let manifest: any;
             try {
                manifest = await import(virtualEntry);
             } catch(e) {
                return next();
             }

             // Map Tanstack router file executions cleanly over uWS bypassing Vinxi exactly like SolidStart
             const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
             
             // Check if it's an API route or SSR request mapped inside the virtual manifest
             const match = manifest.routes.find((r: any) => url.pathname.startsWith(r.uri));
             
             if (match) {
                const exports = await match.loader();
                const handler = exports[req.method?.toUpperCase()] || exports.default;
                
                if (handler) {
                   const tReq = new Request(url.href, {
                      method: req.method,
                      headers: new Headers(req.headers as any),
                   });
                   
                   const response = await handler(tReq);
                   
                   if (response instanceof Response) {
                      res.writeStatus(`${response.status}`);
                      response.headers.forEach((val: any, key: any) => res.writeHeader(key, val));
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
                         return;
                      }
                   }
                }
             }
             next();
          } catch(e) {
             console.error('[Sparx:TanStack] Dev Middleware SSR Error', e);
             next();
          }
       }
    ];
  }

  ssrEntry(): string {
     return 'virtual:sparx/tanstack-routes';
  }
}

registry.register(new TanStackAdapter());
