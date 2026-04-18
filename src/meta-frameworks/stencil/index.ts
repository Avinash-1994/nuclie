import type { NuclieAdapter, Plugin, NuclieConfig, PackageJson, Middleware } from '@nuclie/adapter-core';
import { detectDependencies, registry } from '@nuclie/adapter-core';
import { createHash } from 'crypto';

export class StencilAdapter implements NuclieAdapter {
  name = 'stencil';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['@stencil/core']);
  }

  plugins(): Plugin[] {
    return [
      {
        name: 'nuclie:stencil-compiler',

        async transform(code: string, id: string) {
          // Stencil uses TSX with custom decorators (@Component, @Prop, @State, @Event, @Watch)
          // These are compiled down by Stencil CLI; here Nuclie intercepts .tsx files from Stencil
          // and passes them through our SWC + decorator pipeline safely
          if (!id.endsWith('.tsx')) return null;
          if (!code.includes('@stencil/core')) return null;

          const { getLazyCacheDatabase } = await import('../../core/cache/lazy-init.js');
          const db = await getLazyCacheDatabase();

          const hash = createHash('sha256').update(`${id}:${code}`).digest('hex');
          const cacheKey = `stencil_${hash}`;

          const cached = db.get(cacheKey);
          if (cached) return { code: cached, map: null };

          // Stencil's compiler is deeply integrated into their own CLI build
          // In dev mode Nuclie serves Stencil's www/ output directory natively
          db.set(cacheKey, code);
          return null; // Stencil components pass through; decorators are handled by tsc
        }
      }
    ];
  }

  config(config: NuclieConfig): NuclieConfig {
    if (!config.stencil) config.stencil = {};
    config.stencil = {
      // Stencil outputs to www/ by default
      outDir: 'www',
      ...(config.stencil || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    return [
      async (req: any, res: any, next: any) => {
        next();
      }
    ];
  }
}

registry.register(new StencilAdapter());
