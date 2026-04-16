import { spawn } from 'child_process';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const NUCLIE_BIN = resolve(ROOT, 'dist/cli.js');

const FRAMEWORKS = [
  { name: 'React (TS)',   dir: 'test-react-ts', port: 3011 },
  { name: 'Vue (TS)',     dir: 'test-vue-ts', port: 3012 },
  { name: 'Svelte (TS)',  dir: 'test-svelte-ts', port: 3013 },
  { name: 'Solid (TS)',   dir: 'test-solid-ts', port: 3014 },
  { name: 'Preact (TS)',  dir: 'test-preact-ts', port: 3015 },
  { name: 'Qwik (TS)',    dir: 'test-qwik-ts', port: 3016 },
  { name: 'Preact (JS)',  dir: 'test-preact-js', port: 3017 },
  { name: 'Lit (TS)',     dir: 'test-lit-ts', port: 3018 },
  { name: 'Alpine (TS)',  dir: 'test-alpine-ts', port: 3019 },
];

for (const fw of FRAMEWORKS) {
  const cwd = resolve(ROOT, fw.dir);
  console.log(`Starting ${fw.name} on port ${fw.port}`);
  spawn('node', [NUCLIE_BIN, 'dev', '--port', fw.port.toString()], {
    cwd,
    stdio: 'inherit'
  });
}

console.log('All servers starting...');
