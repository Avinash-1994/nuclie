/**
 * @sparx/autoconfig — Phase 4.7
 *
 * Zero-config auto-detection. Inspects the project and returns a
 * complete SparxConfig without the user writing sparx.config.ts.
 *
 * Detection order (per master plan):
 *   1. package.json deps → framework detection
 *   2. index.html        → entry detection
 *   3. monorepo detect  → workspace root
 *   4. tsconfig.json    → compiler settings
 */

import fs from 'fs/promises';
import path from 'path';
import { registry } from '@nuclie/adapter-core';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DetectedConfig {
    framework: string | null;
    entry: string[];
    preset: 'spa' | 'ssr' | 'ssg';
    isMonorepo: boolean;
    workspaceRoot: string | null;
    tsconfig: string | null;
    port: number;
    outDir: string;
}

// ─── 1. Framework Detection from package.json ─────────────────────────────────

const FRAMEWORK_PRIORITY: Array<[RegExp, string]> = [
    [/\bnext\b/, 'next'],
    [/\bnuxt\b/, 'nuxt'],
    [/\bsveltekit\b|\b@sveltejs\/kit\b/, 'sveltekit'],
    [/\bgatsby\b/, 'gatsby'],
    [/\bremix\b/, 'remix'],
    [/\bsolid-start\b/, 'solid-start'],
    [/\bqwik\b/, 'qwik'],
    [/\bvue\b/, 'vue'],
    [/\bsvelte\b/, 'svelte'],
    [/\bsolid-js\b|\bsolid\b/, 'solid'],
    [/\blit\b/, 'lit'],
    [/\bpreact\b/, 'preact'],
    [/\breact\b/, 'react'],
];

async function detectFramework(root: string): Promise<string | null> {
    try {
        const pkgRaw = await fs.readFile(path.join(root, 'package.json'), 'utf-8');
        const pkg = JSON.parse(pkgRaw);
        
        // 1. New dynamic @nuclie/adapter-core registry detection
        const adapter = registry.detect(root, pkg);
        if (adapter) return adapter.name;

        // 2. Fallback to legacy regex detection for UI frameworks not yet moved
        const allDeps = {
            ...pkg.dependencies,
            ...pkg.devDependencies,
            ...pkg.peerDependencies,
        };
        const depNames = Object.keys(allDeps).join(' ');
        for (const [pattern, name] of FRAMEWORK_PRIORITY) {
            if (pattern.test(depNames)) return name;
        }
    } catch { /* no package.json */ }
    return null;
}

// ─── 2. Entry Detection from index.html / src/ ────────────────────────────────

async function detectEntry(root: string): Promise<string[]> {
    // Look for <script type="module" src="..."> in index.html
    const candidates = [
        path.join(root, 'index.html'),
        path.join(root, 'public', 'index.html'),
    ];

    for (const htmlPath of candidates) {
        try {
            const html = await fs.readFile(htmlPath, 'utf-8');
            const match = html.match(/<script[^>]+type=["']module["'][^>]+src=["']([^"']+)["']/);
            if (match?.[1]) return [match[1].replace(/^\//, '')];
        } catch { /* continue */ }
    }

    // Fallback: look for common entry files
    const entryFiles = [
        'src/main.ts', 'src/main.tsx', 'src/main.js',
        'src/index.ts', 'src/index.tsx', 'src/app.ts',
        'src/App.tsx', 'src/App.vue', 'src/App.svelte',
    ];

    for (const f of entryFiles) {
        try {
            await fs.access(path.join(root, f));
            return [f];
        } catch { /* continue */ }
    }

    return [];
}

// ─── 3. Monorepo Detection ────────────────────────────────────────────────────

async function detectMonorepo(root: string): Promise<{ isMonorepo: boolean; workspaceRoot: string | null }> {
    // Walk up to find pnpm-workspace.yaml or package.json with workspaces
    let dir = root;
    for (let i = 0; i < 5; i++) {
        try {
            // pnpm-workspace.yaml
            await fs.access(path.join(dir, 'pnpm-workspace.yaml'));
            return { isMonorepo: true, workspaceRoot: dir };
        } catch { /* continue */ }
        try {
            const pkg = JSON.parse(await fs.readFile(path.join(dir, 'package.json'), 'utf-8'));
            if (pkg.workspaces) return { isMonorepo: true, workspaceRoot: dir };
        } catch { /* continue */ }
        try {
            // Nx / Turborepo
            await fs.access(path.join(dir, 'nx.json'));
            return { isMonorepo: true, workspaceRoot: dir };
        } catch { /* continue */ }
        try {
            await fs.access(path.join(dir, 'turbo.json'));
            return { isMonorepo: true, workspaceRoot: dir };
        } catch { /* continue */ }
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
    }
    return { isMonorepo: false, workspaceRoot: null };
}

// ─── 4. tsconfig Detection ───────────────────────────────────────────────────

async function detectTsconfig(root: string): Promise<string | null> {
    const candidates = [
        'tsconfig.json', 'tsconfig.app.json',
        'tsconfig.base.json', 'jsconfig.json',
    ];
    for (const f of candidates) {
        try {
            const p = path.join(root, f);
            await fs.access(p);
            return p;
        } catch { /* continue */ }
    }
    return null;
}

// ─── Preset inference ─────────────────────────────────────────────────────────

function inferPreset(framework: string | null): 'spa' | 'ssr' | 'ssg' {
    if (!framework) return 'spa';
    if (['next', 'nuxt', 'sveltekit', 'remix', 'solid-start'].includes(framework)) return 'ssr';
    if (['gatsby'].includes(framework)) return 'ssg';
    return 'spa';
}

// ─── Main API ─────────────────────────────────────────────────────────────────

/**
 * detect(root) — auto-detect project config.
 *
 * Runs all 4 detection steps and returns a merged DetectedConfig.
 * Call this in the config loader when sparx.config.ts is absent.
 */
export async function detect(root: string = process.cwd()): Promise<DetectedConfig> {
    const [framework, entry, { isMonorepo, workspaceRoot }, tsconfig] = await Promise.all([
        detectFramework(root),
        detectEntry(root),
        detectMonorepo(root),
        detectTsconfig(root),
    ]);

    return {
        framework,
        entry,
        preset: inferPreset(framework),
        isMonorepo,
        workspaceRoot,
        tsconfig,
        port: 5173,
        outDir: 'dist',
    };
}

/**
 * detectSync — sync wrapper (uses cached results after first call).
 * Only use when async context is unavailable.
 */
let _cached: DetectedConfig | null = null;
export function getCachedDetection(): DetectedConfig | null {
    return _cached;
}
export async function detectAndCache(root?: string): Promise<DetectedConfig> {
    if (_cached) return _cached;
    _cached = await detect(root);
    return _cached;
}
