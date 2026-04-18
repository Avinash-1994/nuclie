import type { NuclieAdapter, Plugin, NuclieConfig, PackageJson, Middleware } from '@nuclie/adapter-core';
import { detectDependencies, registry } from '@nuclie/adapter-core';
import { tauriIpcPlugin } from './tauri-plugin.js';

export interface TauriConfig {
  backendSrc?: string;       // default 'src-tauri'
  autoBuildRust?: boolean;   // default false
}

export class TauriAdapter implements NuclieAdapter {
  name = 'tauri';

  detect(projectRoot: string, pkg: PackageJson): boolean {
    return detectDependencies(pkg, ['@tauri-apps/api']);
  }

  plugins(): Plugin[] {
    return [
      tauriIpcPlugin()
    ];
  }

  config(config: NuclieConfig): NuclieConfig {
    if (!config.tauri) config.tauri = {};
    config.tauri = {
      backendSrc: 'src-tauri',
      autoBuildRust: false,
      ...(config.tauri || {})
    };
    return config;
  }

  serverMiddleware(): Middleware[] {
    return [
       async (req: any, res: any, next: any) => {
          // Tauri relies on native Rust backend, dev server acts purely as static HTML edge host for the WebView
          next();
       }
    ];
  }
}

registry.register(new TauriAdapter());
