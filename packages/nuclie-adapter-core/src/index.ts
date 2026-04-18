// packages/nuclie-adapter-core/src/index.ts

export interface Plugin {
  name: string;
  [key: string]: any;
}

export interface Middleware {
  (req: any, res: any, next: any): void;
}

export interface NuclieConfig {
  [key: string]: any;
}

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: any;
}

export interface NuclieAdapter {
  name: string;
  
  /**
   * Auto-detect: return true if this adapter should activate
   */
  detect(projectRoot: string, pkg: PackageJson): boolean;

  /**
   * Vite/Rollup-compatible plugin array to prepend
   */
  plugins(): Plugin[];

  /**
   * Modify the resolved Nuclie config before build
   */
  config(config: NuclieConfig): NuclieConfig | Promise<NuclieConfig>;

  /**
   * Server middleware to inject into the uWS dev server
   */
  serverMiddleware?(): Middleware[];

  /**
   * SSR entry resolution (optional — for meta-frameworks)
   */
  ssrEntry?(config: NuclieConfig): string | undefined;

  /**
   * Adapter-specific build output post-processing (optional)
   */
  buildOutput?(outputDir: string): Promise<void>;
}

export * from './registry.js';
