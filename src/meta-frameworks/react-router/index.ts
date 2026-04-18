import type { NuclieAdapter, Plugin, NuclieConfig, PackageJson, Middleware } from '@nuclie/adapter-core';
import { detectDependencies, registry } from '@nuclie/adapter-core';
import { rr7RoutesPlugin } from './routes-plugin.js';

export interface ReactRouterConfig {
  appDirectory?: string; // default "app"
  ssr?: boolean;         // default true
}

export class ReactRouterAdapter implements NuclieAdapter {
  name = 'react-router';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['@react-router/dev']);
  }

  plugins(): Plugin[] {
    return [
      rr7RoutesPlugin()
    ];
  }

  config(config: NuclieConfig): NuclieConfig {
    if (!config.reactRouter) config.reactRouter = {};
    config.reactRouter = {
      appDirectory: 'app',
      ssr: true,
      ...(config.reactRouter || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    return [
       async (req: any, res: any, next: any) => {
          try {
             const virtualID = 'virtual:nuclie/rr7-server-build';
             let build: any;
             try {
                build = await import(virtualID);
             } catch(e) {
                return next();
             }

             // Map req to Fetch API Request (Same as Remix structure natively)
             const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
             
             const fetchReq = new Request(url.href, {
                method: req.method,
                headers: new Headers(req.headers as any),
             });

             // @ts-ignore
             const serverBuild = await import('@react-router/node');
             const handleRequest = serverBuild.createRequestHandler(build, process.env.NODE_ENV);
             
             const fetchRes = await handleRequest(fetchReq);

             res.writeStatus(`${fetchRes.status}`);
             fetchRes.headers.forEach((val: any, key: any) => res.writeHeader(key, val));
             
             if (fetchRes.body) {
                const reader = fetchRes.body.getReader();
                while (true) {
                   const { done, value } = await reader.read();
                   if (done) break;
                   res.write(value);
                }
             } else {
                res.write(await fetchRes.text());
             }
             res.end();
             
          } catch(e) {
             console.error('[Nuclie:ReactRouter] Error rendering SSR', e);
             next();
          }
       }
    ];
  }

  ssrEntry(): string {
     return 'virtual:nuclie/rr7-server-build';
  }
}

registry.register(new ReactRouterAdapter());
