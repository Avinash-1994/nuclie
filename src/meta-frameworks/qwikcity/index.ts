import type { SparxAdapter, Plugin, SparxConfig, PackageJson, Middleware } from '@sparx/adapter-core';
import { detectDependencies, registry } from '@sparx/adapter-core';
import { qwikOptimizerPlugin } from './optimizer-plugin.js';

export interface QwikCityConfig {
  routesDir?: string;       // default: src/routes
  trailingSlash?: boolean;  // default: false
}

export class QwikCityAdapter implements SparxAdapter {
  name = 'qwikcity';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['@builder.io/qwik']);
  }

  plugins(): Plugin[] {
    return [
      qwikOptimizerPlugin()
    ];
  }

  config(config: SparxConfig): SparxConfig {
    if (!config.qwik) config.qwik = {};
    config.qwik.city = {
      routesDir: 'src/routes',
      trailingSlash: false,
      ...(config.qwik.city || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    return [
       async (req: any, res: any, next: any) => {
          // Pass down the requests to Qwik City SSR handling
          // We attach the Qwik loader injection flag here mapping it
          // for the html-injector to observe post-routing
          (req as any)._isQwikContext = true;
          next();
       }
    ];
  }

  ssrEntry(): string {
     return 'src/entry.ssr.tsx'; // Standard Qwik entry point pattern
  }
}

registry.register(new QwikCityAdapter());
