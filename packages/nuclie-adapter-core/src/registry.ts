// packages/nuclie-adapter-core/src/registry.ts
import type { NuclieAdapter, PackageJson } from './index.js';

export class AdapterRegistry {
  private adapters: NuclieAdapter[] = [];

  register(adapter: NuclieAdapter) {
    this.adapters.push(adapter);
  }

  detect(projectRoot: string, pkg: PackageJson): NuclieAdapter | null {
    // Priority order auto-detection
    for (const adapter of this.adapters) {
      if (adapter.detect(projectRoot, pkg)) {
        return adapter;
      }
    }
    return null;
  }
}

export const registry = new AdapterRegistry();

// Fallback utility to dynamically detect UI meta-framework dependencies
export function detectDependencies(pkg: PackageJson, deps: string[]): boolean {
  const check = { ...pkg.dependencies, ...pkg.devDependencies };
  return deps.some(dep => Object.keys(check).includes(dep));
}
