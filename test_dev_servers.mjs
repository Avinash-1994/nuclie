#!/usr/bin/env node
/**
 * Local Build Tool Dev Server Tester
 * Runs `node dist/cli.js dev` in each test project to ensure it starts up without errors.
 */
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const NUCLIE_BIN = resolve(ROOT, 'dist/cli.js');

const FRAMEWORKS = [
  { name: 'React (TS)',   dir: 'test-react-ts' },
  { name: 'Vue (TS)',     dir: 'test-vue-ts' },
  { name: 'Svelte (TS)',  dir: 'test-svelte-ts' },
  { name: 'Solid (TS)',   dir: 'test-solid-ts' },
  { name: 'Preact (TS)',  dir: 'test-preact-ts' },
  { name: 'Qwik (TS)',    dir: 'test-qwik-ts' },
  { name: 'Preact (JS)',  dir: 'test-preact-js' },
  { name: 'Lit (TS)',     dir: 'test-lit-ts' },
  { name: 'Alpine (TS)',  dir: 'test-alpine-ts' },
];

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║        NUCLIE DEV SERVER TEST STARTUP RUNNER             ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

async function testDevServer(fw) {
  const cwd = join(ROOT, fw.dir);
  if (!existsSync(cwd)) {
    console.log(`  ⏭️   SKIP ${fw.name} — Directory not found`);
    return { name: fw.name, status: 'SKIP' };
  }

  process.stdout.write(`  ⏳  Testing ${fw.name.padEnd(14)} (${fw.dir}) ... `);

  return new Promise((resolveResult) => {
    const child = spawn('node', [NUCLIE_BIN, 'dev', '--no-color'], {
      cwd,
      env: { ...process.env, NO_COLOR: '1' } // Force raw text
    });

    let stdoutStr = '';
    let stderrStr = '';
    let resolved = false;

    // Failsafe timeout
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        child.kill();
        console.log('⏳ TIMEOUT');
        resolveResult({ name: fw.name, status: 'TIMEOUT' });
      }
    }, 10000);

    function cleanupAndResolve(result) {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        child.kill();
        resolveResult(result);
      }
    }

    child.stdout.on('data', (data) => {
      const chunk = data.toString();
      stdoutStr += chunk;
      
      // Look for indicators that dev server successfully booted up
      if (chunk.includes('Ready in') || chunk.includes('Starting the development server') || chunk.includes('Network')) {
        // give it a tiny bit extra time in case an immediate error logs right after "Ready"
        setTimeout(() => {
          if(!resolved) {
             console.log(`✅  PASS  `);
             cleanupAndResolve({ name: fw.name, status: 'PASS' });
          }
        }, 500);
      }
    });

    child.stderr.on('data', (data) => {
      const chunk = data.toString();
      stderrStr += chunk;
      if (chunk.includes('Error:') || chunk.includes('Cannot find module')) {
        console.log(`❌  FAIL  `);
        const recentErr = stderrStr.slice(-500).split('\n').slice(-10).join('\n          ');
        console.log(`       └─ ${recentErr}`);
        cleanupAndResolve({ name: fw.name, status: 'FAIL', error: stderrStr });
      }
    });

    child.on('close', (code) => {
      if (!resolved) {
        if (code !== 0 && code !== null) {
          console.log(`❌  CRASH (Exit code ${code})`);
          cleanupAndResolve({ name: fw.name, status: 'FAIL', error: stderrStr });
        } else {
           console.log(`⚠️   CLOSED PREMATURELY`);
           cleanupAndResolve({ name: fw.name, status: 'FAIL' });
        }
      }
    });
  });
}

(async () => {
    let pass = 0, fail = 0;
    
    for(const fw of FRAMEWORKS) {
        const res = await testDevServer(fw);
        if(res.status === 'PASS') pass++;
        if(res.status === 'FAIL' || res.status === 'TIMEOUT') fail++;
    }
    
    console.log(`\n  Total: ${pass + fail}  |  Pass: ${pass}  |  Fail: ${fail}\n`);
    process.exit(fail > 0 ? 1 : 0);
})();
