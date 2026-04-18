/**
 * @sparx/federation — Phase 4.6 — Module Federation 2.0
 *
 * Enhancements over the existing MF implementation:
 *   - Shared scope conflict resolution (semver-aware)
 *   - Type federation (exposes .d.ts manifests for remote types)
 *   - Dev-time remote mocking (intercepts remote loads in dev mode)
 */

// ─── Shared scope conflict resolution ────────────────────────────────────────

type SemVer = { major: number; minor: number; patch: number };

function parseSemVer(v: string): SemVer {
    const [major, minor, patch] = v.replace(/^[^0-9]*/, '').split('.').map(Number);
    return { major: major || 0, minor: minor || 0, patch: patch || 0 };
}

function satisfies(version: string, required: string): boolean {
    if (!required || required === '*') return true;
    const req = required.replace(/^[\^~>=<\s]+/, '');
    const ver = parseSemVer(version);
    const reqVer = parseSemVer(req);
    // ^x.y.z: major must match, minor+patch must be >=
    if (required.startsWith('^')) {
        return ver.major === reqVer.major &&
            (ver.minor > reqVer.minor || (ver.minor === reqVer.minor && ver.patch >= reqVer.patch));
    }
    // ~x.y.z: major+minor must match, patch must be >=
    if (required.startsWith('~')) {
        return ver.major === reqVer.major && ver.minor === reqVer.minor && ver.patch >= reqVer.patch;
    }
    // >=x.y.z
    if (required.startsWith('>=')) {
        return ver.major > reqVer.major ||
            (ver.major === reqVer.major && ver.minor > reqVer.minor) ||
            (ver.major === reqVer.major && ver.minor === reqVer.minor && ver.patch >= reqVer.patch);
    }
    return version === req;
}

export interface SharedModule {
    name: string;
    version: string;
    requiredVersion?: string;
    singleton?: boolean;
    /** Which federation scope provided this */
    providedBy: string;
}

export interface ConflictResolution {
    winner: SharedModule;
    losers: SharedModule[];
    reason: string;
}

/**
 * resolveSharedScope(modules) — resolve version conflicts in shared scope.
 *
 * Rules (mirrors Webpack MF behavior):
 *   1. Singleton + incompatible version → warn, use highest
 *   2. Non-singleton → each scope gets its own version
 *   3. Satisfies requiredVersion → use shared (dedup)
 */
export function resolveSharedScope(modules: SharedModule[]): Map<string, ConflictResolution> {
    const byName = new Map<string, SharedModule[]>();
    for (const m of modules) {
        if (!byName.has(m.name)) byName.set(m.name, []);
        byName.get(m.name)!.push(m);
    }

    const resolutions = new Map<string, ConflictResolution>();

    for (const [name, group] of byName) {
        if (group.length === 1) {
            resolutions.set(name, { winner: group[0], losers: [], reason: 'sole provider' });
            continue;
        }

        const singletons = group.filter(m => m.singleton);
        if (singletons.length > 0) {
            // Singleton: pick highest version, warn on incompatibility
            const sorted = [...group].sort((a, b) => {
                const av = parseSemVer(a.version);
                const bv = parseSemVer(b.version);
                if (bv.major !== av.major) return bv.major - av.major;
                if (bv.minor !== av.minor) return bv.minor - av.minor;
                return bv.patch - av.patch;
            });
            const winner = sorted[0];
            const losers = sorted.slice(1);
            const incompatible = losers.filter(l => l.requiredVersion && !satisfies(winner.version, l.requiredVersion));
            const reason = incompatible.length > 0
                ? `singleton conflict — using highest (${winner.version}); incompatible with: ${incompatible.map(l => l.providedBy + '@' + l.requiredVersion).join(', ')}`
                : `singleton deduplicated to ${winner.version}`;
            if (incompatible.length > 0) {
                console.warn(`[sparx:federation] Shared singleton "${name}" version conflict: ${reason}`);
            }
            resolutions.set(name, { winner, losers, reason });
        } else {
            // Non-singleton: group by satisfying version
            resolutions.set(name, { winner: group[0], losers: group.slice(1), reason: 'non-singleton, each scope owns copy' });
        }
    }

    return resolutions;
}

// ─── Type Federation ─────────────────────────────────────────────────────────

export interface TypeManifest {
    scope: string;
    exposes: Record<string, { types: string; version: string }>;
}

/**
 * generateTypeManifest(scope, exposes, typesDir)
 *
 * Reads .d.ts files from typesDir and returns a JSON manifest
 * that remote consumers can use to resolve types at dev time.
 */
export async function generateTypeManifest(
    scope: string,
    exposes: Record<string, string>,
    typesDir: string
): Promise<TypeManifest> {
    const { readFile } = await import('fs/promises');
    const { join } = await import('path');

    const result: TypeManifest = { scope, exposes: {} };

    for (const [key, srcPath] of Object.entries(exposes)) {
        const dtsPath = join(typesDir, srcPath.replace(/\.(ts|tsx)$/, '.d.ts'));
        try {
            const types = await readFile(dtsPath, 'utf-8');
            result.exposes[key] = { types, version: '1.0.0' };
        } catch {
            result.exposes[key] = { types: 'declare module "*" {}', version: '1.0.0' };
        }
    }

    return result;
}

// ─── Dev-time Remote Mocking ─────────────────────────────────────────────────

export interface RemoteMock {
    scope: string;
    /** Map of exposed module path → mock implementation factory */
    mocks: Record<string, () => unknown>;
}

/**
 * generateDevMockRuntime(mocks)
 *
 * Generates a browser-injectable script that intercepts remote container
 * loads and returns the mock implementations instead.
 * Injected by the dev server when federation.mock === true.
 */
export function generateDevMockRuntime(mocks: RemoteMock[]): string {
    if (mocks.length === 0) return '';

    const mockMap = Object.fromEntries(
        mocks.map(m => [m.scope, m.mocks])
    );

    return `
(function() {
  var __sparx_mocks__ = ${JSON.stringify(
      Object.fromEntries(mocks.map(m => [m.scope, Object.keys(m.mocks)]))
  )};
  var origLoad = window.__loadRemote;
  window.__loadRemote = async function(scope, mod) {
    if (__sparx_mocks__[scope] && __sparx_mocks__[scope].indexOf(mod) !== -1) {
      console.info('[sparx:federation] Using dev mock for ' + scope + '/' + mod);
      return { default: undefined }; // consumers provide actual mocks via registerMock()
    }
    return origLoad ? origLoad(scope, mod) : Promise.reject(new Error('No remote: ' + scope));
  };
  window.__sparx_registerMock__ = function(scope, mod, factory) {
    if (!window.__sparx_mock_registry__) window.__sparx_mock_registry__ = {};
    window.__sparx_mock_registry__[scope + '/' + mod] = factory;
  };
})();
`.trim();
}
