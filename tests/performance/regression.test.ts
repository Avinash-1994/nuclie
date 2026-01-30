import { describe, it, expect } from '@jest/globals';
import { startDevServer } from '../../src/dev/devServer.js';
import { buildProject } from '../../src/build/index.js';
import path from 'path';
import fs from 'fs';

describe('Performance Regression Tests', () => {
    const fixturesDir = path.resolve(process.cwd(), 'tests/fixtures');

    describe('Cold Start Performance', () => {
        it('should start dev server in under 100ms', async () => {
            const projectPath = path.join(fixturesDir, 'perf-test');

            // Create minimal project
            if (!fs.existsSync(projectPath)) {
                fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
                fs.writeFileSync(
                    path.join(projectPath, 'src/main.ts'),
                    `console.log('Hello');`
                );
                fs.writeFileSync(
                    path.join(projectPath, 'package.json'),
                    JSON.stringify({ name: 'perf-test', type: 'module' }, null, 2)
                );
            }

            const start = performance.now();

            const server = await startDevServer({
                root: projectPath,
                port: 5555,
                server: { open: false }
            });

            const duration = performance.now() - start;

            // Clean up
            if (server && server.close) {
                await new Promise<void>(resolve => server.close(() => resolve()));
            }

            // Should start in under 100ms (excluding network/IO)
            expect(duration).toBeLessThan(100);
        }, 10000); // 10s timeout

        it('should have fast core initialization', () => {
            const start = performance.now();

            // Just import the core modules
            require('../../dist/core/universal-transformer.js');
            require('../../dist/core/engine/index.js');

            const duration = performance.now() - start;

            // Core modules should load quickly
            expect(duration).toBeLessThan(50); // 50ms
        });
    });

    describe('HMR Performance', () => {
        it('should update modules in under 60ms', async () => {
            const projectPath = path.join(fixturesDir, 'hmr-perf');

            if (!fs.existsSync(projectPath)) {
                fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
                fs.writeFileSync(
                    path.join(projectPath, 'src/App.tsx'),
                    `export const App = () => <div>v1</div>;`
                );
                fs.writeFileSync(
                    path.join(projectPath, 'package.json'),
                    JSON.stringify({ name: 'hmr-perf', type: 'module' }, null, 2)
                );
            }

            const server = await startDevServer({
                root: projectPath,
                port: 5556,
                server: { open: false }
            });

            // Wait for initial build
            await new Promise(r => setTimeout(r, 1000));

            // Measure HMR update time
            const start = performance.now();

            // Trigger file change
            const appPath = path.join(projectPath, 'src/App.tsx');
            fs.writeFileSync(appPath, `export const App = () => <div>v2</div>;`);

            // Wait for HMR to process
            await new Promise(r => setTimeout(r, 100));

            const duration = performance.now() - start;

            // Clean up
            if (server && server.close) {
                await new Promise<void>(resolve => server.close(() => resolve()));
            }

            // HMR should be fast
            expect(duration).toBeLessThan(60); // 60ms
        }, 15000);
    });

    describe('Build Performance', () => {
        it('should build small project in under 2 seconds', async () => {
            const projectPath = path.join(fixturesDir, 'build-perf');

            if (!fs.existsSync(projectPath)) {
                fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

                // Create 10 small modules
                for (let i = 0; i < 10; i++) {
                    fs.writeFileSync(
                        path.join(projectPath, `src/module${i}.ts`),
                        `export const value${i} = ${i};`
                    );
                }

                fs.writeFileSync(
                    path.join(projectPath, 'src/main.ts'),
                    Array.from({ length: 10 }, (_, i) =>
                        `import { value${i} } from './module${i}';`
                    ).join('\n') + '\nconsole.log("done");'
                );

                fs.writeFileSync(
                    path.join(projectPath, 'package.json'),
                    JSON.stringify({ name: 'build-perf', type: 'module' }, null, 2)
                );
            }

            const start = performance.now();

            const result = await buildProject({
                root: projectPath,
                entry: ['src/main.ts'],
                outDir: 'dist'
            });

            const duration = performance.now() - start;

            expect(result.success).toBe(true);
            expect(duration).toBeLessThan(2000); // 2 seconds
        }, 10000);

        it('should have efficient memory usage', async () => {
            const projectPath = path.join(fixturesDir, 'memory-test');

            if (!fs.existsSync(projectPath)) {
                fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
                fs.writeFileSync(
                    path.join(projectPath, 'src/main.ts'),
                    `console.log('test');`
                );
                fs.writeFileSync(
                    path.join(projectPath, 'package.json'),
                    JSON.stringify({ name: 'memory-test', type: 'module' }, null, 2)
                );
            }

            const memBefore = process.memoryUsage().heapUsed;

            await buildProject({
                root: projectPath,
                entry: ['src/main.ts'],
                outDir: 'dist'
            });

            const memAfter = process.memoryUsage().heapUsed;
            const memDelta = (memAfter - memBefore) / 1024 / 1024; // MB

            // Should not leak excessive memory
            expect(memDelta).toBeLessThan(50); // 50MB max increase
        });
    });

    describe('Cache Performance', () => {
        it('should rebuild faster with cache', async () => {
            const projectPath = path.join(fixturesDir, 'cache-perf');

            if (!fs.existsSync(projectPath)) {
                fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
                fs.writeFileSync(
                    path.join(projectPath, 'src/main.ts'),
                    `const x = 42; console.log(x);`
                );
                fs.writeFileSync(
                    path.join(projectPath, 'package.json'),
                    JSON.stringify({ name: 'cache-perf', type: 'module' }, null, 2)
                );
            }

            // First build (cold)
            const start1 = performance.now();
            await buildProject({
                root: projectPath,
                entry: ['src/main.ts'],
                outDir: 'dist'
            });
            const duration1 = performance.now() - start1;

            // Second build (warm cache)
            const start2 = performance.now();
            await buildProject({
                root: projectPath,
                entry: ['src/main.ts'],
                outDir: 'dist'
            });
            const duration2 = performance.now() - start2;

            // Cached build should be significantly faster
            expect(duration2).toBeLessThan(duration1 * 0.5); // At least 2x faster
        }, 15000);
    });
});
