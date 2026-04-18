/**
 * @sparx/workspace — Phase 4.8
 *
 * First-class monorepo support:
 *   - Cross-package HMR propagation
 *   - Topological build order (respects inter-package deps)
 *   - Shared dep deduplication across packages
 */

import fs from 'fs/promises';
import path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorkspacePackage {
    name: string;
    root: string;
    /** Relative path from workspace root */
    relativePath: string;
    /** Direct workspace package dependencies */
    localDeps: string[];
    /** External (npm) dependencies */
    externalDeps: Record<string, string>;
    entry: string | null;
}

export interface WorkspacePlan {
    /** Packages in topological build order */
    buildOrder: WorkspacePackage[];
    /** All packages by name */
    packages: Map<string, WorkspacePackage>;
    /** Shared deps that appear in 2+ packages (candidates for deduplication) */
    sharedDeps: Map<string, string[]>;
}

// ─── Discovery ────────────────────────────────────────────────────────────────

async function findPackageDirs(workspaceRoot: string): Promise<string[]> {
    const packageDirs: string[] = [];

    // Read pnpm-workspace.yaml or package.json workspaces
    try {
        const pnpmWs = await fs.readFile(path.join(workspaceRoot, 'pnpm-workspace.yaml'), 'utf-8');
        const patterns = pnpmWs
            .split('\n')
            .filter(l => l.trim().startsWith('-'))
            .map(l => l.replace(/^\s*-\s*['"]?/, '').replace(/['"]?\s*$/, '').trim())
            .filter(Boolean);

        for (const pattern of patterns) {
            const glob = pattern.replace(/\/\*$/, '');
            const base = path.join(workspaceRoot, glob);
            try {
                const entries = await fs.readdir(base, { withFileTypes: true });
                for (const e of entries) {
                    if (e.isDirectory()) {
                        packageDirs.push(path.join(base, e.name));
                    }
                }
            } catch { /* dir may not exist yet */ }
        }
        return packageDirs;
    } catch { /* no pnpm-workspace.yaml */ }

    try {
        const pkg = JSON.parse(await fs.readFile(path.join(workspaceRoot, 'package.json'), 'utf-8'));
        const workspaces: string[] = Array.isArray(pkg.workspaces)
            ? pkg.workspaces
            : (pkg.workspaces?.packages ?? []);

        for (const pattern of workspaces) {
            const glob = pattern.replace(/\/\*$/, '');
            const base = path.join(workspaceRoot, glob);
            try {
                const entries = await fs.readdir(base, { withFileTypes: true });
                for (const e of entries) {
                    if (e.isDirectory()) packageDirs.push(path.join(base, e.name));
                }
            } catch { /* continue */ }
        }
    } catch { /* no package.json */ }

    return packageDirs;
}

async function readPackage(pkgDir: string, workspaceRoot: string): Promise<WorkspacePackage | null> {
    try {
        const raw = await fs.readFile(path.join(pkgDir, 'package.json'), 'utf-8');
        const pkg = JSON.parse(raw);
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };

        // Entry detection
        let entry: string | null = null;
        for (const e of ['src/index.ts', 'src/index.tsx', 'src/main.ts', pkg.main, pkg.module].filter(Boolean)) {
            try { await fs.access(path.join(pkgDir, e)); entry = e; break; } catch { /* try next */ }
        }

        return {
            name: pkg.name ?? path.basename(pkgDir),
            root: pkgDir,
            relativePath: path.relative(workspaceRoot, pkgDir),
            localDeps: [], // filled in second pass
            externalDeps: allDeps,
            entry,
        };
    } catch {
        return null;
    }
}

// ─── Topological Sort ─────────────────────────────────────────────────────────

function topoSort(packages: Map<string, WorkspacePackage>): WorkspacePackage[] {
    const visited = new Set<string>();
    const order: WorkspacePackage[] = [];

    function visit(name: string) {
        if (visited.has(name)) return;
        visited.add(name);
        const pkg = packages.get(name);
        if (!pkg) return;
        for (const dep of pkg.localDeps) visit(dep);
        order.push(pkg);
    }

    // Sort names for determinism
    [...packages.keys()].sort().forEach(visit);
    return order;
}

// ─── Shared Dep Analysis ──────────────────────────────────────────────────────

function findSharedDeps(packages: Map<string, WorkspacePackage>): Map<string, string[]> {
    const depMap: Map<string, string[]> = new Map();
    for (const [name, pkg] of packages) {
        for (const dep of Object.keys(pkg.externalDeps)) {
            if (!depMap.has(dep)) depMap.set(dep, []);
            depMap.get(dep)!.push(name);
        }
    }
    // Only return deps shared by 2+ packages
    const shared = new Map<string, string[]>();
    for (const [dep, pkgs] of depMap) {
        if (pkgs.length >= 2) shared.set(dep, pkgs);
    }
    return shared;
}

// ─── Main API ─────────────────────────────────────────────────────────────────

/**
 * analyzeWorkspace(root) — scan monorepo and return build plan.
 *
 * @param root  Workspace root (must contain pnpm-workspace.yaml or package.json workspaces)
 */
export async function analyzeWorkspace(root: string = process.cwd()): Promise<WorkspacePlan> {
    const pkgDirs = await findPackageDirs(root);

    // First pass: read all packages
    const rawPkgs = await Promise.all(pkgDirs.map(d => readPackage(d, root)));
    const packages = new Map<string, WorkspacePackage>();
    for (const pkg of rawPkgs) {
        if (pkg) packages.set(pkg.name, pkg);
    }

    // Second pass: resolve local deps (deps that are workspace packages)
    for (const pkg of packages.values()) {
        pkg.localDeps = Object.keys(pkg.externalDeps).filter(d => packages.has(d));
    }

    const buildOrder = topoSort(packages);
    const sharedDeps = findSharedDeps(packages);

    return { buildOrder, packages, sharedDeps };
}

// ─── Cross-Package HMR Propagation ───────────────────────────────────────────

/**
 * getHmrPropagationChain(changedPackage, plan)
 *
 * When a file in `changedPackage` changes, returns the ordered list
 * of packages that need to be re-built/hot-reloaded (dependents first).
 */
export function getHmrPropagationChain(
    changedPackage: string,
    plan: WorkspacePlan
): WorkspacePackage[] {
    const dependents: WorkspacePackage[] = [];
    for (const pkg of plan.packages.values()) {
        if (pkg.localDeps.includes(changedPackage)) {
            dependents.push(pkg);
        }
    }
    // Sort by build order position (re-build in topo order)
    dependents.sort((a, b) => {
        const ai = plan.buildOrder.findIndex(p => p.name === a.name);
        const bi = plan.buildOrder.findIndex(p => p.name === b.name);
        return ai - bi;
    });
    return dependents;
}
