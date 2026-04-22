import type { SparxAdapter, Plugin, SparxConfig, PackageJson, Middleware } from '@sparx/adapter-core';
import { detectDependencies, registry } from '@sparx/adapter-core';
import { wakuRscPlugin } from './rsc-plugin.js';

export interface WakuConfig {
  rscPath?: string; // default '/RSC'
}

export class WakuAdapter implements SparxAdapter {
  name = 'waku';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['waku']);
  }

  plugins(): Plugin[] {
    return [
      wakuRscPlugin()
    ];
  }

  config(config: SparxConfig): SparxConfig {
    if (!config.waku) config.waku = {};
    config.waku = {
      rscPath: '/RSC',
      ...(config.waku || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    return [
       async (req: any, res: any, next: any) => {
          try {
             // Waku handler interception mapping RSC data endpoints
             const url = req.url || '/';
             
             const virtualEntry = 'virtual:sparx/waku-rsc-router';
             let router: any;
             try {
                router = await import(virtualEntry);
             } catch(e) {
                return next();
             }

             if (url.startsWith('/RSC/')) {
                // Return explicitly the serialized RSC Payload format directly to the client
                const flightData = await router.renderRSC(url);
                if (flightData) {
                   res.writeStatus('200 OK');
                   res.writeHeader('Content-Type', 'text/x-component');
                   
                   // Assuming flightData is a ReadableStream or byte array Buffer
                   if (flightData.getReader) {
                      const reader = flightData.getReader();
                      while (true) {
                         const { done, value } = await reader.read();
                         if (done) break;
                         res.write(value);
                      }
                      res.end();
                      return;
                   } else {
                      res.end(flightData);
                      return;
                   }
                }
             } else {
                // Otherwise SSR the React Shell
                const html = await router.renderSSR(url);
                if (html) {
                   res.writeStatus('200 OK');
                   res.writeHeader('Content-Type', 'text/html');
                   res.end(html);
                   return;
                }
             }

             next();
          } catch(e) {
             console.error('[Sparx:Waku] Error rendering RSC', e);
             next();
          }
       }
    ];
  }

  ssrEntry(): string {
     return 'virtual:sparx/waku-rsc-router';
  }
}

registry.register(new WakuAdapter());
