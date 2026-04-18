import type { NuclieAdapter, Plugin, NuclieConfig, PackageJson } from '@nuclie/adapter-core';
import { angularIvyPlugin } from './ivy-plugin.js';
import { angularStylePlugin } from './style-plugin.js';
import { detectDependencies, registry } from '@nuclie/adapter-core';

export interface AngularConfig {
  target?: 'es2020' | 'es2022';     // default: es2022 for Angular 17+
  strictTemplates?: boolean;          // default: true
  aot?: boolean;                      // default: true (always for prod)
  preserveSymlinks?: boolean;         // default: false
}

export class AngularAdapter implements NuclieAdapter {
  name = 'angular';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    const hasCore = detectDependencies(pkg, ['@angular/core']);
    const hasCompiler = detectDependencies(pkg, ['@angular/compiler']);
    return hasCore && hasCompiler;
  }

  plugins(): Plugin[] {
    return [
      angularIvyPlugin(),
      angularStylePlugin()
    ];
  }

  config(config: NuclieConfig): NuclieConfig | Promise<NuclieConfig> {
    // Merge default Angular namespace configs if missing
    config.angular = {
      target: 'es2022',
      strictTemplates: true,
      aot: process.env.NODE_ENV === 'production',
      preserveSymlinks: false,
      ...(config.angular || {})
    };
    return config;
  }
}

registry.register(new AngularAdapter());
