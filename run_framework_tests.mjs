#!/usr/bin/env node
/**
 * Framework Test Runner
 * Runs `nuclie build` in each test-* project and reports results.
 */
import { execSync, spawn } from 'child_process';
import { existsSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const NUCLIE_BIN = resolve(ROOT, 'dist/cli.js');

const FRAMEWORKS = [
  { name: 'React (TS)',   dir: 'test-react-ts',   adapter: 'react'   },
  { name: 'Vue (TS)',     dir: 'test-vue-ts',      adapter: 'vue'     },
  { name: 'Svelte (TS)', dir: 'test-svelte-ts',   adapter: 'svelte'  },
  { name: 'Solid (TS)',  dir: 'test-solid-ts',    adapter: 'solid'   },
  { name: 'Preact (TS)', dir: 'test-preact-ts',   adapter: 'preact'  },
  { name: 'Qwik (TS)',   dir: 'test-qwik-ts',     adapter: 'qwik'    },
  { name: 'Preact (JS)', dir: 'test-preact-js',   adapter: 'preact'  },
  { name: 'Lit (TS)',    dir: 'test-lit-ts',      adapter: 'lit'     },
  { name: 'Alpine (TS)', dir: 'test-alpine-ts',   adapter: 'alpine'  },
];

const results = [];

function runBuild(name, dir) {
  const cwd = join(ROOT, dir);
  if (!existsSync(cwd)) {
    return { name, status: 'SKIP', reason: 'Directory not found', duration: 0 };
  }

  const start = Date.now();
  try {
    const out = execSync(
      `node ${NUCLIE_BIN} build --no-color 2>&1`,
      { cwd, timeout: 120_000, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' } }
    );
    const duration = Date.now() - start;

    // Detect output files
    const buildOut = join(cwd, 'build_output');
    let files = [];
    if (existsSync(buildOut)) {
      files = readdirSync(buildOut).filter(f => statSync(join(buildOut, f)).isFile());
    }

    return { name, dir, status: 'PASS', duration, output: out.slice(-600), files };
  } catch (err) {
    const duration = Date.now() - start;
    return { name, dir, status: 'FAIL', duration, error: (err.stdout || err.message || '').slice(-800) };
  }
}

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║          NUCLIE  FRAMEWORK  BUILD  TEST  RUNNER          ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

for (const fw of FRAMEWORKS) {
  process.stdout.write(`  ⏳  Building ${fw.name.padEnd(14)} (${fw.dir}) ... `);
  const r = runBuild(fw.name, fw.dir);
  results.push(r);
  if (r.status === 'PASS') {
    console.log(`✅  PASS  (${(r.duration/1000).toFixed(1)}s)  [${r.files?.length ?? 0} output files]`);
  } else if (r.status === 'SKIP') {
    console.log(`⏭️   SKIP  — ${r.reason}`);
  } else {
    console.log(`❌  FAIL  (${(r.duration/1000).toFixed(1)}s)`);
    console.log('     └─ Error snippet:');
    (r.error || '').split('\n').slice(-8).forEach(l => console.log('        ' + l));
  }
}

// Summary table
const pass = results.filter(r => r.status === 'PASS').length;
const fail = results.filter(r => r.status === 'FAIL').length;
const skip = results.filter(r => r.status === 'SKIP').length;

console.log('\n┌─────────────────────────────────────────────────────────┐');
console.log('│                       SUMMARY                          │');
console.log('├──────────────────────┬────────┬──────────┬────────────┤');
console.log('│ Framework            │ Status │ Duration │ Output     │');
console.log('├──────────────────────┼────────┼──────────┼────────────┤');
for (const r of results) {
  const status = r.status === 'PASS' ? '✅ PASS' : r.status === 'FAIL' ? '❌ FAIL' : '⏭ SKIP';
  const dur    = r.duration ? `${(r.duration/1000).toFixed(1)}s` : '-';
  const files  = r.files ? `${r.files.length} files` : r.status === 'FAIL' ? 'error' : '-';
  console.log(`│ ${r.name.padEnd(20)} │ ${status.padEnd(6)} │ ${dur.padStart(7)}  │ ${files.padEnd(10)} │`);
}
console.log('├──────────────────────┴────────┴──────────┴────────────┤');
console.log(`│  Total: ${results.length}  |  Pass: ${pass}  |  Fail: ${fail}  |  Skip: ${skip}            │`);
console.log('└─────────────────────────────────────────────────────────┘\n');

// Write JSON report
const report = { timestamp: new Date().toISOString(), pass, fail, skip, results };
writeFileSync(join(ROOT, 'framework_test_report.json'), JSON.stringify(report, null, 2));
console.log('  📄 Report saved → framework_test_report.json\n');

process.exit(fail > 0 ? 1 : 0);
