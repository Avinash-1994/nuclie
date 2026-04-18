import type { NuclieAdapter, Plugin, NuclieConfig, PackageJson, Middleware } from '@nuclie/adapter-core';
import { detectDependencies, registry } from '@nuclie/adapter-core';
import { sveltekitRouterPlugin } from './router-plugin.js';
import { createSveltekitMiddleware } from './adapter-node.js';

export interface SvelteKitConfig {
  outDir?: string;           // default: .svelte-kit
  alias?: Record<string, string>;
  csrf?: { checkOrigin: boolean };
}

export class SvelteKitAdapter implements NuclieAdapter {
  name = 'sveltekit';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['@sveltejs/kit']);
  }

  plugins(): Plugin[] {
    return [
      sveltekitRouterPlugin()
    ];
  }

  config(config: NuclieConfig): NuclieConfig {
    if (!config.svelte) config.svelte = {};
    config.svelte.kit = {
      outDir: '.svelte-kit',
      csrf: { checkOrigin: true },
      ...(config.svelte.kit || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    // Inject the simulated uWS -> SvelteKit fetch standard request bridge
    return [createSveltekitMiddleware()];
  }

  ssrEntry(): string {
     // Defines what file should be targeted as the core server render context
     return 'virtual:nuclie/sveltekit-routes';
  }
}

registry.register(new SvelteKitAdapter());
