/**
 * @sparx/migrate — Phase 5.6
 *
 * Automated upgrade assistant:
 *   - Detects deprecated config keys in sparx.config.ts
 *   - Proposes a unified diff
 *   - Asks for confirmation before writing
 */

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

// ─── Deprecated key registry ──────────────────────────────────────────────────

interface Migration {
    key: string | RegExp;
    message: string;
    fix?: (source: string) => string;
}

const MIGRATIONS: Migration[] = [
    {
        key: /cacheBackend\s*:\s*['"]?(leveldb|rocksdb)['"]?/i,
        message: 'cacheBackend: "leveldb" / "rocksdb" — Sparx now uses SQLite exclusively. Remove this key.',
        fix: (src) => src.replace(/\s*cacheBackend\s*:\s*['"]?(leveldb|rocksdb)['"]?\s*,?\n?/gi, ''),
    },
    {
        key: /cache_backend\s*:\s*['"]?(leveldb|rocksdb)['"]?/i,
        message: 'cache_backend is removed — use cache.remote instead (see https://sparx.dev/migrate#cache-backend)',
        fix: (src) => src.replace(/\s*cache_backend\s*:\s*['"]?(leveldb|rocksdb)['"]?\s*,?\n?/gi, ''),
    },
    {
        key: /wasmPlugin\s*:\s*['"]?.*\.wasm['"]?/,
        message: 'WASM plugins are removed. Use a JS/TS plugin entry point (see https://sparx.dev/migrate#wasm-plugins)',
        fix: (src) => src.replace(/\s*wasmPlugin\s*:\s*['"]?.*\.wasm['"]?\s*,?\n?/g, ''),
    },
    {
        key: /cache\s*:\s*true/,
        message: 'cache: true is deprecated. Use cache: { remote: { provider: false } } for local-only or configure a remote provider.',
        fix: (src) => src.replace(/cache\s*:\s*true/g, 'cache: { remote: { provider: false } }'),
    },
    {
        key: /"nuclie\.dev"/,
        message: 'nuclie.dev URLs → sparx.dev (brand rename)',
        fix: (src) => src.replace(/nuclie\.dev/g, 'sparx.dev'),
    },
];

// ─── Diff generation ──────────────────────────────────────────────────────────

function unifiedDiff(original: string, updated: string, file: string): string {
    const origLines = original.split('\n');
    const newLines = updated.split('\n');
    const lines: string[] = [`--- a/${file}`, `+++ b/${file}`];

    let i = 0, j = 0;
    while (i < origLines.length || j < newLines.length) {
        if (origLines[i] === newLines[j]) {
            lines.push(` ${origLines[i]}`);
            i++; j++;
        } else {
            lines.push(`-${origLines[i] ?? ''}`);
            lines.push(`+${newLines[j] ?? ''}`);
            i++; j++;
        }
    }
    return lines.join('\n');
}

// ─── Confirmation prompt ──────────────────────────────────────────────────────

async function confirm(question: string): Promise<boolean> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes');
        });
    });
}

// ─── Main API ─────────────────────────────────────────────────────────────────

export interface MigrateResult {
    file: string;
    issues: string[];
    proposed: string;
    applied: boolean;
}

/**
 * migrate(root) — scan sparx.config.ts and apply migrations.
 *
 * @param root  Project root (default: process.cwd())
 * @param opts  { dryRun, yes } — dryRun prints diff only, yes skips confirmation
 */
export async function migrate(
    root: string = process.cwd(),
    opts: { dryRun?: boolean; yes?: boolean } = {}
): Promise<MigrateResult[]> {
    const results: MigrateResult[] = [];

    const candidates = [
        path.join(root, 'sparx.config.ts'),
        path.join(root, 'sparx.config.js'),
        path.join(root, 'sparx.config.json'),
    ];

    for (const configPath of candidates) {
        try {
            await fs.access(configPath);
        } catch {
            continue;
        }

        const original = await fs.readFile(configPath, 'utf-8');
        let proposed = original;
        const issues: string[] = [];

        for (const m of MIGRATIONS) {
            const pattern = typeof m.key === 'string' ? new RegExp(m.key) : m.key;
            if (pattern.test(proposed)) {
                issues.push(m.message);
                if (m.fix) proposed = m.fix(proposed);
            }
        }

        if (issues.length === 0) {
            console.log(`[sparx:migrate] ${path.basename(configPath)} — no issues found ✅`);
            continue;
        }

        console.log(`\n[sparx:migrate] Found ${issues.length} issue(s) in ${path.relative(root, configPath)}:`);
        for (const issue of issues) console.log(`  • ${issue}`);

        if (proposed !== original) {
            console.log('\nProposed changes:');
            console.log(unifiedDiff(original, proposed, path.relative(root, configPath)));
        }

        let applied = false;
        if (!opts.dryRun && proposed !== original) {
            const shouldApply = opts.yes || await confirm('\nApply these changes? [y/N] ');
            if (shouldApply) {
                await fs.writeFile(configPath, proposed, 'utf-8');
                console.log(`[sparx:migrate] ✅ Applied changes to ${path.basename(configPath)}`);
                applied = true;
            } else {
                console.log('[sparx:migrate] Skipped — no changes written.');
            }
        }

        results.push({ file: configPath, issues, proposed, applied });
    }

    if (results.length === 0) {
        console.log('[sparx:migrate] No sparx.config.* file found — nothing to migrate.');
    }

    return results;
}
