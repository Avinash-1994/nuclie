import type { NuclieAdapter, Plugin, NuclieConfig, PackageJson, Middleware } from '@nuclie/adapter-core';
import { detectDependencies, registry } from '@nuclie/adapter-core';
import { electronPlugin } from './electron-plugin.js';

export interface ElectronConfig {
  mainSrc?: string;       // default 'electron/main.ts'
  preloadSrc?: string;    // default 'electron/preload.ts'
}

export class ElectronAdapter implements NuclieAdapter {
  name = 'electron';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['electron', 'electron-builder']);
  }

  plugins(): Plugin[] {
    return [
      electronPlugin()
    ];
  }

  config(config: NuclieConfig): NuclieConfig {
    if (!config.electron) config.electron = {};
    config.electron = {
      mainSrc: 'electron/main.ts',
      preloadSrc: 'electron/preload.ts',
      ...(config.electron || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    return [
       async (req: any, res: any, next: any) => {
          // Dev Server Renderer Window Host 
          // Routes standard localhost req to the Vite renderer frontend
          next();
       }
    ];
  }
}

registry.register(new ElectronAdapter());
