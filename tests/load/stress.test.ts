/**
 * Load and Stress Tests for Nexxo Build System
 * 
 * Tests system behavior under heavy load, concurrent operations,
 * and resource pressure scenarios.
 */

import { buildProject } from '../../src/build/index.js';
import path from 'path';
import fs from 'fs';
import os from 'os';

describe('Load Testing: Concurrent Builds', () => {
    let tempDir: string;
    let simpleProjectPath: string;

    beforeAll(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexxo-load-test-'));

        // Create a simple test project
        simpleProjectPath = path.join(tempDir, 'simple-app');
        fs.mkdirSync(simpleProjectPath, { recursive: true });
        fs.mkdirSync(path.join(simpleProjectPath, 'src'), { recursive: true });

        // Create simple entry file
        fs.writeFileSync(
            path.join(simpleProjectPath, 'src', 'main.js'),
            `
            export function greet(name) {
                return 'Hello, ' + name;
            }
            
            console.log(greet('World'));
            `
        );
    });

    afterAll(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    /**
     * Test: Handle 10 concurrent builds
     * 
     * Ensures the build system can handle multiple simultaneous builds
     * without deadlocks or resource exhaustion.
     */
    it('should handle 10 concurrent builds', async () => {
        const buildPromises = Array(10).fill(0).map((_, index) =>
            buildProject({
                root: simpleProjectPath,
                entry: ['src/main.js'],
                outDir: `dist-${index}`,
                minify: false
            })
        );

        const results = await Promise.all(buildPromises);

        // All builds should succeed
        results.forEach((result, index) => {
            expect(result.success).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    }, 60000); // 60 second timeout

    /**
     * Test: Handle 50 concurrent builds
     * 
     * Stress test with higher concurrency.
     */
    it('should handle 50 concurrent builds', async () => {
        const buildPromises = Array(50).fill(0).map((_, index) =>
            buildProject({
                root: simpleProjectPath,
                entry: ['src/main.js'],
                outDir: `dist-concurrent-${index}`,
                minify: false
            })
        );

        const results = await Promise.all(buildPromises);

        // At least 90% should succeed
        const successCount = results.filter(r => r.success).length;
        const successRate = successCount / results.length;

        expect(successRate).toBeGreaterThanOrEqual(0.9);
    }, 120000); // 2 minute timeout

    /**
     * Test: Sequential builds should be consistent
     * 
     * Running the same build multiple times should produce identical results.
     */
    it('should produce consistent results across sequential builds', async () => {
        const results = [];

        for (let i = 0; i < 5; i++) {
            const result = await buildProject({
                root: simpleProjectPath,
                entry: ['src/main.js'],
                outDir: `dist-seq-${i}`,
                minify: true
            });

            results.push(result);
        }

        // All should succeed
        results.forEach(result => {
            expect(result.success).toBe(true);
        });

        // Build times should be similar (within 50% variance)
        const times = results.map(r => r.duration || 0);
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;

        times.forEach(time => {
            const variance = Math.abs(time - avgTime) / avgTime;
            expect(variance).toBeLessThan(0.5); // 50% variance threshold
        });
    }, 60000);

    /**
     * Test: Memory usage should remain stable
     * 
     * Multiple builds should not cause memory leaks.
     */
    it('should not leak memory across multiple builds', async () => {
        const initialMemory = process.memoryUsage().heapUsed;

        // Run 20 builds
        for (let i = 0; i < 20; i++) {
            await buildProject({
                root: simpleProjectPath,
                entry: ['src/main.js'],
                outDir: `dist-mem-${i}`,
                minify: false
            });

            // Force garbage collection if available
            if (global.gc) {
                global.gc();
            }
        }

        const finalMemory = process.memoryUsage().heapUsed;
        const memoryIncrease = finalMemory - initialMemory;
        const memoryIncreaseMB = memoryIncrease / (1024 * 1024);

        // Memory increase should be less than 100MB
        expect(memoryIncreaseMB).toBeLessThan(100);
    }, 120000);
});

describe('Stress Testing: Large Projects', () => {
    let tempDir: string;
    let largeProjectPath: string;

    beforeAll(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexxo-stress-test-'));
        largeProjectPath = path.join(tempDir, 'large-app');
        fs.mkdirSync(largeProjectPath, { recursive: true });
        fs.mkdirSync(path.join(largeProjectPath, 'src'), { recursive: true });

        // Create 100 module files
        for (let i = 0; i < 100; i++) {
            const content = `
                export const value${i} = ${i};
                export function func${i}() {
                    return value${i} * 2;
                }
            `;
            fs.writeFileSync(
                path.join(largeProjectPath, 'src', `module${i}.js`),
                content
            );
        }

        // Create main file that imports all modules
        const imports = Array(100).fill(0)
            .map((_, i) => `import { value${i}, func${i} } from './module${i}.js';`)
            .join('\n');

        const usage = Array(100).fill(0)
            .map((_, i) => `console.log(value${i}, func${i}());`)
            .join('\n');

        fs.writeFileSync(
            path.join(largeProjectPath, 'src', 'main.js'),
            `${imports}\n\n${usage}`
        );
    });

    afterAll(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    /**
     * Test: Build project with 100 modules
     * 
     * Tests handling of projects with many interdependent modules.
     */
    it('should build project with 100 modules', async () => {
        const result = await buildProject({
            root: largeProjectPath,
            entry: ['src/main.js'],
            outDir: 'dist',
            minify: false
        });

        expect(result.success).toBe(true);
        expect(result.errors).toHaveLength(0);

        // Should complete in reasonable time (< 10s)
        expect(result.duration).toBeLessThan(10000);
    }, 30000);

    /**
     * Test: Build with minification
     * 
     * Minification should work on large projects.
     */
    it('should minify large project efficiently', async () => {
        const result = await buildProject({
            root: largeProjectPath,
            entry: ['src/main.js'],
            outDir: 'dist-min',
            minify: true
        });

        expect(result.success).toBe(true);

        // Minification should complete in reasonable time (< 15s)
        expect(result.duration).toBeLessThan(15000);
    }, 30000);

    /**
     * Test: Deep dependency chains
     * 
     * Tests handling of deeply nested module dependencies.
     */
    it('should handle deep dependency chains', async () => {
        // Create chain: a -> b -> c -> d -> e
        const chainPath = path.join(tempDir, 'chain-app');
        fs.mkdirSync(chainPath, { recursive: true });
        fs.mkdirSync(path.join(chainPath, 'src'), { recursive: true });

        const depth = 20;
        for (let i = 0; i < depth; i++) {
            const nextImport = i < depth - 1
                ? `import { value } from './module${i + 1}.js';\nexport const value${i} = value + ${i};`
                : `export const value = ${i};`;

            fs.writeFileSync(
                path.join(chainPath, 'src', `module${i}.js`),
                nextImport
            );
        }

        fs.writeFileSync(
            path.join(chainPath, 'src', 'main.js'),
            `import { value0 } from './module0.js';\nconsole.log(value0);`
        );

        const result = await buildProject({
            root: chainPath,
            entry: ['src/main.js'],
            outDir: 'dist',
            minify: false
        });

        expect(result.success).toBe(true);
        expect(result.errors).toHaveLength(0);
    }, 30000);
});

describe('Performance Testing: Build Speed', () => {
    let tempDir: string;

    beforeAll(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nexxo-perf-test-'));
    });

    afterAll(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    /**
     * Test: Cold build performance
     * 
     * First build should complete within reasonable time.
     */
    it('should complete cold build quickly', async () => {
        const projectPath = path.join(tempDir, 'cold-app');
        fs.mkdirSync(projectPath, { recursive: true });
        fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

        fs.writeFileSync(
            path.join(projectPath, 'src', 'main.js'),
            `console.log('Hello, World!');`
        );

        const start = performance.now();
        const result = await buildProject({
            root: projectPath,
            entry: ['src/main.js'],
            outDir: 'dist',
            minify: false
        });
        const duration = performance.now() - start;

        expect(result.success).toBe(true);
        expect(duration).toBeLessThan(5000); // 5 seconds
    }, 10000);

    /**
     * Test: Warm build performance
     * 
     * Subsequent builds should be faster due to caching.
     */
    it('should have faster warm builds', async () => {
        const projectPath = path.join(tempDir, 'warm-app');
        fs.mkdirSync(projectPath, { recursive: true });
        fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

        fs.writeFileSync(
            path.join(projectPath, 'src', 'main.js'),
            `console.log('Hello, World!');`
        );

        // Cold build
        const coldStart = performance.now();
        await buildProject({
            root: projectPath,
            entry: ['src/main.js'],
            outDir: 'dist',
            minify: false
        });
        const coldDuration = performance.now() - coldStart;

        // Warm build
        const warmStart = performance.now();
        await buildProject({
            root: projectPath,
            entry: ['src/main.js'],
            outDir: 'dist',
            minify: false
        });
        const warmDuration = performance.now() - warmStart;

        // Warm build should be at least 20% faster
        expect(warmDuration).toBeLessThan(coldDuration * 0.8);
    }, 20000);
});
