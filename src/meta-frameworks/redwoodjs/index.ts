import type { NuclieAdapter, Plugin, NuclieConfig, PackageJson, Middleware } from '@nuclie/adapter-core';
import { detectDependencies, registry } from '@nuclie/adapter-core';

export class RedwoodAdapter implements NuclieAdapter {
  name = 'redwoodjs';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['@redwoodjs/core', '@redwoodjs/router']);
  }

  plugins(): Plugin[] {
    return [
      {
        name: 'nuclie:redwood-scaffold',
        async buildStart() {
          console.log('[Nuclie:RedwoodJS] Detected RedwoodJS project.');
          console.log('[Nuclie:RedwoodJS] Use `yarn rw dev` for the full RedwoodJS dev experience.');
          console.log('[Nuclie:RedwoodJS] Nuclie handles the web/ side bundling natively.');
        }
      }
    ];
  }

  config(config: NuclieConfig): NuclieConfig {
    if (!config.redwood) config.redwood = {};
    config.redwood = {
      // RedwoodJS splits into web/ (frontend) and api/ (backend graphql)
      webSrc: 'web/src',
      apiSrc: 'api/src',
      ...(config.redwood || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    return [
      async (req: any, res: any, next: any) => {
        // RedwoodJS API requests go to /.redwood/functions/ — proxy to the Redwood api server
        const url = req.url || '/';
        if (url.startsWith('/.redwood/') || url.startsWith('/api/')) {
          // Log and pass; a full implementation would proxy to localhost:8911
          console.log(`[Nuclie:RedwoodJS] API request detected: ${url} — ensure \`yarn rw dev api\` is running.`);
        }
        next();
      }
    ];
  }
}

registry.register(new RedwoodAdapter());
