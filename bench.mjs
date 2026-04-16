import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { performance } from 'perf_hooks';

const cmd = process.argv[2] || 'node dist/cli.js build';
const outPath = process.argv[3] || 'profiling/baseline-build.json';
const runs = 5;

mkdirSync('profiling', { recursive: true });

console.log(`Warming up...`);
execSync(cmd, { stdio: 'ignore' });

console.log(`Running benchmark: ${cmd} (${runs} runs)`);
const times = [];

for (let i = 0; i < runs; i++) {
  const start = performance.now();
  execSync(cmd, { stdio: 'ignore' });
  const end = performance.now();
  const timeSec = (end - start) / 1000;
  times.push(timeSec);
  console.log(`  Run ${i + 1}: ${timeSec.toFixed(3)} s`);
}

const mean = times.reduce((a, b) => a + b, 0) / runs;
const max = Math.max(...times);
const min = Math.min(...times);

const stdDev = Math.sqrt(
  times.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / runs
);

const result = {
  command: cmd,
  mean: mean,
  stddev: stdDev,
  median: [...times].sort()[Math.floor(runs / 2)],
  user: mean, // approximation
  system: 0.0,
  min: min,
  max: max,
  times: times,
};

// Format similar to hyperfine
writeFileSync(outPath, JSON.stringify({ results: [result] }, null, 2));

console.log(`\nBenchmark Result:`);
console.log(`  Time (mean ± σ):      ${mean.toFixed(3)} s ± ${stdDev.toFixed(3)} s`);
console.log(`  Range (min … max):    ${min.toFixed(3)} s … ${max.toFixed(3)} s`);
console.log(`\nExported to ${outPath}`);
