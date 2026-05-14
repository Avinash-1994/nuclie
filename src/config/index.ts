import fs from 'fs/promises';
import path from 'path';
import kleur from 'kleur';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

import { z } from 'zod';
import { log } from '../utils/logger.js';
import { spaPreset, ssrPreset, ssgPreset } from '../presets/index.js';

function normalizeRemoteUrl(value: any): string {
  if (typeof value !== 'string') return value;
  const webpackRemote = /^([A-Za-z0-9_$-]+)@(https?:\/\/.*)$/;
  const match = webpackRemote.exec(value);
  return match ? match[2] : value;
}

export type BuildMode = 'development' | 'production' | 'test';

export const BuildConfigSchema = z.object({
  root: z.string().optional(),
  adapter: z.string().optional(),
  framework: z.string().optional(),
  entry: z.union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === 'string' ? [val] : val))
    .optional(),
  mode: z.enum(['development', 'production', 'test']).default('development'),
  outDir: z.string().default('dist'),
  port: z.number().default(5173),
  plugins: z.array(z.any()).optional(),
  esbuildPlugins: z.array(z.any()).optional(),
  platform: z.enum(['browser', 'node', 'edge']).default('browser'),
  preset: z.enum(['spa', 'ssr', 'ssg']).default('spa'),
  federation: z.object({
    name: z.string(),
    filename: z.string().optional(),
    exposes: z.record(z.string(), z.string()).optional(),
    remotes: z.record(z.string(), z.string()).optional(),
    shared: z.record(z.string(), z.object({
      singleton: z.boolean().optional(),
      requiredVersion: z.string().optional(),
    })).optional(),
    prefetch: z.array(z.string()).optional(),
    fallback: z.string().optional(),
    mock: z.boolean().optional(),
    healthCheck: z.string().optional(),
  }).optional(),
  css: z.object({
    framework: z.enum(['tailwind', 'bootstrap', 'bulma', 'material', 'none']).optional(),
    purge: z.boolean().optional(),
    critical: z.boolean().optional(),
  }).optional(),
  build: z.object({
    minify: z.boolean().optional(),
    sourcemap: z.union([
      z.enum(['inline', 'external', 'hidden', 'none']),
      z.boolean()
    ]).transform((val) => {
      if (typeof val === 'boolean') return val ? 'external' : 'none';
      return val;
    }).optional(),
    splitting: z.boolean().optional(),
    cssModules: z.boolean().default(false),
    targets: z.array(z.string()).optional(),
    manualChunks: z.record(z.string(), z.array(z.string())).optional(),
  }).optional(),
  server: z.object({
    host: z.string().optional(),
    port: z.number().optional(),
    strictPort: z.boolean().optional(),
    cors: z.boolean().optional(),
    open: z.union([z.boolean(), z.string()]).optional(),
    proxy: z.record(z.string(), z.union([z.string(), z.any()])).optional(),
    https: z.union([z.boolean(), z.object({ key: z.string(), cert: z.string() })]).optional(),
    headers: z.record(z.string(), z.string()).optional(),
  }).optional(),
  cacheDir: z.string().optional(),
  prebundle: z.object({
    enabled: z.boolean().default(true),
    include: z.array(z.string()).optional(),
    exclude: z.array(z.string()).optional(),
  }).optional(),
  // Phase 4.2 — Remote cache (new optional key)
  cache: z.object({
    remote: z.object({
      provider: z.union([z.enum(['s3', 'sparx-cloud']), z.literal(false)]).default(false),
      bucket: z.string().optional(),
      token: z.string().optional(),
      region: z.string().optional(),
      endpoint: z.string().optional(),
      baseUrl: z.string().optional(),
      readOnly: z.boolean().default(false),
    }).optional(),
  }).optional(),
}).passthrough();

export type BuildConfig = {
  root: string;
  adapter?: string;
  framework?: string;
  entry: string[];
  mode: 'development' | 'production' | 'test';
  outDir: string;
  port: number;
  plugins?: any[];
  esbuildPlugins?: any[];
  platform: 'browser' | 'node' | 'edge';
  preset: 'spa' | 'ssr' | 'ssg';
  federation?: {
    name: string;
    filename?: string;
    exposes?: Record<string, string>;
    remotes?: Record<string, string>;
    shared?: Record<string, { singleton?: boolean; requiredVersion?: string }>;
    prefetch?: string[];
    fallback?: string;
    mock?: boolean;
    healthCheck?: string;
  };
  css?: {
    framework?: 'tailwind' | 'bootstrap' | 'bulma' | 'material' | 'none';
    purge?: boolean;
    critical?: boolean;
  };
  build?: {
    minify?: boolean;
    sourcemap?: 'inline' | 'external' | 'hidden' | 'none';
    splitting?: boolean;
    cssModules?: boolean;
    targets?: string[];
    manualChunks?: Record<string, string[]>;
  };
  server?: {
    host?: string;
    port?: number;
    strictPort?: boolean;
    cors?: boolean | any;
    open?: boolean | string;
    proxy?: Record<string, string | any>;
    https?: boolean | { key: string; cert: string };
    headers?: Record<string, string>;
  };
  /** Phase 1.10 — cache root dir (relative to project root). Default: .sparx/cache */
  cacheDir?: string;
  prebundle?: {
    enabled?: boolean;
    include?: string[];
    exclude?: string[];
  };
  // Phase 4.2 — Remote cache (new optional key, additive)
  // Supports: false (disable), true (legacy boolean), or object with remote config
  cache?: boolean | {
    remote?: {
      provider: 's3' | 'sparx-cloud' | false;
      bucket?: string;
      token?: string;
      region?: string;
      endpoint?: string;
      baseUrl?: string;
      readOnly?: boolean;
    };
  };
  // Phase 4.5 — Rollup-compat output flag
  compatRollup?: boolean;
};

// CFG-04: levenshtein for typo suggestions
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

const VALID_TOP_LEVEL_KEYS = [
  'entry', 'outDir', 'framework', 'preset', 'mode', 'platform', 'port',
  'root', 'base', 'publicDir', 'cacheDir', 'plugins', 'esbuildPlugins',
  'build', 'server', 'css', 'federation', 'security', 'adapter',
  'prebundle', 'cache', 'compatRollup'
];

function validateConfigKeys(raw: Record<string, unknown>) {
  const errors: string[] = [];
  for (const key of Object.keys(raw)) {
    if (!VALID_TOP_LEVEL_KEYS.includes(key)) {
      const closest = VALID_TOP_LEVEL_KEYS
        .map(k => ({ k, d: levenshtein(key, k) }))
        .sort((a, b) => a.d - b.d)[0];
      if (closest.d <= 3) {
        errors.push(
          `[sparx] Config error: unknown key "${key}"\n` +
          `        Did you mean: ${closest.k} ?`
        );
      } else {
        errors.push(
          `[sparx] Config error: unknown key "${key}"\n` +
          `        See https://sparx.dev/config for valid keys.`
        );
      }
    }
  }
  if (errors.length > 0) {
    errors.forEach(e => console.error(e));
    console.error('\nFix sparx.config.ts then re-run.\n');
    process.exit(1);
  }
}

// CFG-02: normalise entry to string[]
function normaliseEntry(entry: string | string[] | undefined, root: string): string[] {
  if (Array.isArray(entry)) return entry;
  if (typeof entry === 'string') return [entry];
  // Auto-detect when omitted
  const candidates = [
    'index.html',
    'src/main.tsx', 'src/main.ts', 'src/main.jsx', 'src/main.js',
    'src/index.tsx', 'src/index.ts', 'src/index.jsx', 'src/index.js',
  ];
  const fsSync = require('fs');
  for (const c of candidates) {
    if (fsSync.existsSync(path.join(root, c))) return [c];
  }
  return [];
}

// CFG-03: framework → preset + platform implications
const FRAMEWORK_IMPLICATIONS: Record<string, { preset?: string; platform?: string }> = {
  'nuxt':           { preset: 'ssr', platform: 'node' },
  'sveltekit':      { preset: 'ssr', platform: 'node' },
  'svelte-kit':     { preset: 'ssr', platform: 'node' },
  'remix':          { preset: 'ssr', platform: 'node' },
  'solidstart':     { preset: 'ssr', platform: 'node' },
  'solid-start':    { preset: 'ssr', platform: 'node' },
  'nextjs':         { preset: 'ssr', platform: 'node' },
  'next':           { preset: 'ssr', platform: 'node' },
  'astro':          { preset: 'ssr', platform: 'node' },
  'analog':         { preset: 'ssr', platform: 'node' },
  'tanstack-start': { preset: 'ssr', platform: 'node' },
  'waku':           { preset: 'ssr', platform: 'node' },
  'tauri':          { preset: 'spa', platform: 'browser' },
  'electron':       { preset: 'spa', platform: 'browser' },
  'react':          { preset: 'spa', platform: 'browser' },
  'vue':            { preset: 'spa', platform: 'browser' },
  'svelte':         { preset: 'spa', platform: 'browser' },
  'angular':        { preset: 'spa', platform: 'browser' },
  'solid':          { preset: 'spa', platform: 'browser' },
  'preact':         { preset: 'spa', platform: 'browser' },
  'lit':            { preset: 'spa', platform: 'browser' },
  'qwik':           { preset: 'spa', platform: 'browser' },
};

export async function loadConfig(cwd: string): Promise<BuildConfig> {
  const sparxTsPath = path.join(cwd, 'sparx.config.ts');
  const sparxJsPath = path.join(cwd, 'sparx.config.js');
  const sparxCjsPath = path.join(cwd, 'sparx.config.cjs');
  const sparxJsonPath = path.join(cwd, 'sparx.config.json');
  const sparxYamlPath = path.join(cwd, 'sparx.config.yaml');
  const sparxYmlPath = path.join(cwd, 'sparx.config.yml');
  const legacyJsonPath = path.join(cwd, 'sparx.build.json');
  const legacyTsPath = path.join(cwd, 'sparx.build.ts');
  const legacyYamlPath = path.join(cwd, 'sparx.build.yaml');
  const legacyYmlPath = path.join(cwd, 'sparx.build.yml');

  let rawConfig: any;
  let loadedConfigPath = 'default';

  try {
    if (await fs.access(sparxTsPath).then(() => true).catch(() => false)) {
      rawConfig = await loadModuleConfig(sparxTsPath, cwd);
      loadedConfigPath = 'sparx.config.ts';
    } else if (await fs.access(sparxCjsPath).then(() => true).catch(() => false)) {
      rawConfig = require(sparxCjsPath);
      loadedConfigPath = 'sparx.config.cjs';
    } else if (await fs.access(sparxJsPath).then(() => true).catch(() => false)) {
      const mod = await import('file://' + sparxJsPath);
      rawConfig = mod.default || mod;
      loadedConfigPath = 'sparx.config.js';
    } else if (await fs.access(sparxJsonPath).then(() => true).catch(() => false)) {
      const raw = await fs.readFile(sparxJsonPath, 'utf-8');
      rawConfig = JSON.parse(raw);
      loadedConfigPath = 'sparx.config.json';
    } else if (await fs.access(sparxYamlPath).then(() => true).catch(() => false)) {
      const raw = await fs.readFile(sparxYamlPath, 'utf-8');
      rawConfig = yaml.load(raw);
      loadedConfigPath = 'sparx.config.yaml';
    } else if (await fs.access(sparxYmlPath).then(() => true).catch(() => false)) {
      const raw = await fs.readFile(sparxYmlPath, 'utf-8');
      rawConfig = yaml.load(raw);
      loadedConfigPath = 'sparx.config.yml';
    } else if (await fs.access(legacyTsPath).then(() => true).catch(() => false)) {
      rawConfig = await loadModuleConfig(legacyTsPath, cwd);
      loadedConfigPath = 'sparx.build.ts';
    } else if (await fs.access(legacyJsonPath).then(() => true).catch(() => false)) {
      const raw = await fs.readFile(legacyJsonPath, 'utf-8');
      rawConfig = JSON.parse(raw);
      loadedConfigPath = 'sparx.build.json';
    } else if (await fs.access(legacyYamlPath).then(() => true).catch(() => false)) {
      const raw = await fs.readFile(legacyYamlPath, 'utf-8');
      rawConfig = yaml.load(raw);
      loadedConfigPath = 'sparx.build.yaml';
    } else if (await fs.access(legacyYmlPath).then(() => true).catch(() => false)) {
      const raw = await fs.readFile(legacyYmlPath, 'utf-8');
      rawConfig = yaml.load(raw);
      loadedConfigPath = 'sparx.build.yml';
    } else {
      // Return default config if file not found, with auto-detection
      log.info('No config file found, using defaults...');
      return {
        root: cwd,
        entry: normaliseEntry(undefined, cwd),
        mode: 'development',
        outDir: 'dist',
        port: 5173,
        platform: 'browser',
        preset: 'spa',
      };
    }

    if (rawConfig && typeof rawConfig === 'object') {
      if (!rawConfig.entry && rawConfig.entryPoints) {
        rawConfig.entry = Array.isArray(rawConfig.entryPoints)
          ? rawConfig.entryPoints
          : [rawConfig.entryPoints];
      }

      if (rawConfig.federation?.remotes && typeof rawConfig.federation.remotes === 'object') {
        rawConfig.federation.remotes = Object.fromEntries(
          Object.entries(rawConfig.federation.remotes).map(([name, url]) => [
            name,
            normalizeRemoteUrl(url)
          ])
        );
      }
    }

    // CFG-04: validate config keys for typos
    if (rawConfig && typeof rawConfig === 'object') {
      validateConfigKeys(rawConfig as Record<string, unknown>);
    }

    const result = BuildConfigSchema.safeParse(rawConfig);

    if (!result.success) {
      const issues = result.error.issues;
      const formattedErrors = issues.map(issue => {
        const p = issue.path.join('.');
        return `\n    - ${kleur.bold(p)}: ${issue.message}`;
      }).join('');
      const errorMsg = `Invalid Configuration in ${loadedConfigPath}${formattedErrors}`;
      throw new Error(errorMsg);
    }

    const config = result.data as BuildConfig;
    const root = config.root || cwd;

    // CFG-02: normalise entry (handles string, array, or auto-detect)
    config.entry = normaliseEntry(config.entry as any, root);

    // CFG-03: apply framework implications (only if user hasn't set the value)
    const fw = config.framework;
    if (fw && FRAMEWORK_IMPLICATIONS[fw]) {
      const impl = FRAMEWORK_IMPLICATIONS[fw];
      const rawPreset   = (rawConfig as any)?.preset;
      const rawPlatform = (rawConfig as any)?.platform;
      if (!rawPreset   && impl.preset)   (config as any).preset   = impl.preset;
      if (!rawPlatform && impl.platform) (config as any).platform = impl.platform;
    }

    let finalConfig = { ...config };
    if (config.preset === 'spa') finalConfig = { ...finalConfig, ...(spaPreset.apply(finalConfig) as any) };
    if (config.preset === 'ssr') finalConfig = { ...finalConfig, ...(ssrPreset.apply(finalConfig) as any) };
    if (config.preset === 'ssg') finalConfig = { ...finalConfig, ...(ssgPreset.apply(finalConfig) as any) };

    if (finalConfig.plugins) {
      for (const p of finalConfig.plugins) {
        if (p && (p.main?.endsWith('.wasm') || p.entry?.endsWith('.wasm') || typeof p === 'string' && p.endsWith('.wasm'))) {
          throw new Error("Sparx no longer supports WASM plugins. Please use a JS/TS plugin entry point. See https://sparx.dev/migrate#wasm-plugins");
        }
      }
    }

    // Phase 1.2 — Deprecation warnings for removed LevelDB / RocksDB config keys.
    // We detect and warn, then silently ignore — never error (users may have these in CI env).
    const legacyDbKeys = ['cacheBackend', 'cache_backend', 'cacheDriver', 'cache_driver'];
    for (const key of legacyDbKeys) {
      const val = (finalConfig as any)[key];
      if (typeof val === 'string' && /leveldb|rocksdb/i.test(val)) {
        console.warn(
          `[sparx] Deprecated config key "${key}": "${val}" is no longer supported. ` +
          `Sparx uses SQLite for all caching. See https://sparx.dev/migrate#cache-backend`
        );
      }
    }
    // Also check environment variables
    for (const envKey of ['SPARX_CACHE_BACKEND', 'SPARX_CACHE_DRIVER', 'NUCLIE_CACHE_BACKEND']) {
      const envVal = process.env[envKey];
      if (envVal && /leveldb|rocksdb/i.test(envVal)) {
        console.warn(
          `[sparx] Deprecated environment variable "${envKey}": "${envVal}" is ignored. ` +
          `Sparx uses SQLite for all caching. See https://sparx.dev/migrate#cache-backend`
        );
      }
    }

    return {
      ...finalConfig,
      root,
    } as BuildConfig;
  } finally {
  }
}

async function loadModuleConfig(tsPath: string, cwd: string): Promise<any> {
  log.info(`Loading config from ${path.basename(tsPath)}...`);
  const { build } = await import('esbuild');
  const outfile = path.join(cwd, `sparx.config.temp.${Date.now()}.mjs`);

  try {
    await build({
      entryPoints: [tsPath],
      outfile,
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'es2020',
      external: [
        'esbuild', 'zod', 'kleur',
        'svelte-preprocess', 'svelte', 'esbuild-svelte', 'js-yaml',
        'coffeescript', 'pug', 'stylus', 'less', 'postcss', 'sass', 'postcss-load-config', 'sugarss',
        'react', 'react-dom'
      ]
    });

    const mod = await import('file://' + outfile);
    return mod.default || mod;
  } finally {
    await fs.unlink(outfile).catch(() => { });
  }
}

export async function saveConfig(cwd: string, config: any): Promise<void> {
  const jsonPath = path.join(cwd, 'sparx.build.json');
  await fs.writeFile(jsonPath, JSON.stringify(config, null, 2), 'utf-8');
  log.info(`Configuration saved to ${jsonPath}`);
}

export function defineConfig(config: Partial<BuildConfig>): Partial<BuildConfig> {
  return config;
}
