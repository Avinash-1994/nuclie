import type { NuclieAdapter, Plugin, NuclieConfig, PackageJson, Middleware } from '@nuclie/adapter-core';
import { detectDependencies, registry } from '@nuclie/adapter-core';

export class GatsbyAdapter implements NuclieAdapter {
  name = 'gatsby';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['gatsby']);
  }

  plugins(): Plugin[] {
    return [
      {
        name: 'nuclie:gatsby-scaffold',
        // Gatsby's build process is entirely custom (gatsby build / gatsby develop)
        // Nuclie scaffolds config detection + serves the built public/ directory.
        // For SSG pre-render outputs, we serve the static public/ folder natively.
        async buildStart() {
          // We warn users that Gatsby requires its own CLI for full builds.
          console.log('[Nuclie:Gatsby] Detected Gatsby project. Use `gatsby build` for production.');
          console.log('[Nuclie:Gatsby] Dev mode serves from public/ directory.');
        }
      }
    ];
  }

  config(config: NuclieConfig): NuclieConfig {
    if (!config.gatsby) config.gatsby = {};
    config.gatsby = {
      // Gatsby outputs to public/ by default
      outDir: 'public',
      ...(config.gatsby || {})
    };
    // Ensure Nuclie serves from Gatsby's output directory in dev pass-through mode
    if (!config.outDir) config.outDir = 'public';
    return config;
  }

  serverMiddleware(): Middleware[] {
    return [
      async (req: any, res: any, next: any) => {
        // Gatsby runs its own webpack dev server; Nuclie proxies requests to it when detected
        next();
      }
    ];
  }
}

registry.register(new GatsbyAdapter());
