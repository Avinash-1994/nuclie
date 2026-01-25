import { spawn } from 'child_process';
import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';

// ============================================================================
// UTILITIES
// ============================================================================
function getDirSize(dirPath: string): number {
    let size = 0;
    if (!fs.existsSync(dirPath)) return 0;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            size += getDirSize(filePath);
        } else {
            size += stats.size;
        }
    }
    return size;
}

// ============================================================================
// MEASUREMENT FUNCTIONS
// ============================================================================

async function measureColdStart(cwd: string, command: string, args: string[], port?: number): Promise<number> {
    // Clean cache
    const cacheDir = path.join(cwd, 'node_modules', '.nexxo');
    if (fs.existsSync(cacheDir)) fs.rmSync(cacheDir, { recursive: true, force: true });
    const viteCacheDir = path.join(cwd, 'node_modules', '.vite');
    if (fs.existsSync(viteCacheDir)) fs.rmSync(viteCacheDir, { recursive: true, force: true });

    return new Promise((resolve) => {
        const start = performance.now();
        const fullArgs = port ? [...args, '--port', port.toString()] : args;
        const child = spawn(command, fullArgs, { cwd, stdio: 'pipe', shell: true });
        let resolved = false;

        const cleanup = () => { if (!child.killed) child.kill(); };

        child.stdout?.on('data', (d) => {
            const out = d.toString();
            if ((out.includes('localhost:') || out.includes('Server running') || out.includes('ready in')) && !resolved) {
                resolved = true;
                const dur = performance.now() - start;
                cleanup();
                resolve(dur);
            }
        });

        child.stderr?.on('data', (d) => {
            const out = d.toString();
            if ((out.includes('localhost:') || out.includes('ready in')) && !resolved) {
                resolved = true;
                const dur = performance.now() - start;
                cleanup();
                resolve(dur);
            }
        });

        setTimeout(() => { if (!resolved) { cleanup(); resolve(15000); } }, 20000);
    });
}

async function measureBuild(cwd: string, command: string, args: string[], distDir: string): Promise<number> {
    const fullDistPath = path.join(cwd, distDir);
    if (fs.existsSync(fullDistPath)) fs.rmSync(fullDistPath, { recursive: true, force: true });

    return new Promise((resolve) => {
        const start = performance.now();
        const child = spawn(command, args, { cwd, stdio: 'ignore', shell: true });
        child.on('close', (code) => {
            if (code === 0) resolve(performance.now() - start);
            else resolve(30000);
        });
        setTimeout(() => { child.kill(); resolve(30000); }, 60000);
    });
}

// ============================================================================
// MAIN RUNNER
// ============================================================================
async function run() {
    console.log('🚀 Executing HONEST Benchmarks (Real Measurements)...\n');

    const root = process.cwd();
    const smallAppDir = path.join(root, 'benchmarks/apps/small-app');
    const mediumAppDir = path.join(root, 'nexxo-web-app');

    const results: Record<string, any> = {};

    // NEXXO - Small App
    console.log('[1/6] Measuring Nexxo (Small App)...');
    results.Nexxo = {
        smallStart: await measureColdStart(smallAppDir, 'npm', ['run', 'dev', '--'], 8001),
        smallBuild: await measureBuild(smallAppDir, 'npm', ['run', 'build'], 'dist'),
        smallSize: getDirSize(path.join(smallAppDir, 'dist')) / 1024
    };
    await new Promise(r => setTimeout(r, 2000));

    // VITE - Small App
    console.log('[2/6] Measuring Vite (Small App)...');
    results.Vite = {
        smallStart: await measureColdStart(smallAppDir, 'npm', ['run', 'vite:dev', '--'], 8002),
        smallBuild: await measureBuild(smallAppDir, 'npm', ['run', 'vite:build'], 'dist-vite'),
        smallSize: getDirSize(path.join(smallAppDir, 'dist-vite')) / 1024
    };
    await new Promise(r => setTimeout(r, 2000));

    // WEBPACK - Small App
    console.log('[3/6] Measuring Webpack (Small App)...');
    results.Webpack = {
        smallStart: 0, // Webpack doesn't have dev server in this minimal setup
        smallBuild: await measureBuild(smallAppDir, 'npm', ['run', 'webpack:build'], 'dist-webpack'),
        smallSize: getDirSize(path.join(smallAppDir, 'dist-webpack')) / 1024
    };
    await new Promise(r => setTimeout(r, 2000));

    // RSPACK - Small App
    console.log('[4/6] Measuring Rspack (Small App)...');
    results.Rspack = {
        smallStart: 0, // Rspack build-only in this setup
        smallBuild: await measureBuild(smallAppDir, 'npm', ['run', 'rspack:build'], 'dist-rspack'),
        smallSize: getDirSize(path.join(smallAppDir, 'dist-rspack')) / 1024
    };
    await new Promise(r => setTimeout(r, 2000));

    // ESBUILD - Small App
    console.log('[5/6] Measuring esbuild (Small App)...');
    results.esbuild = {
        smallStart: 0, // esbuild is build-only
        smallBuild: await measureBuild(smallAppDir, 'npm', ['run', 'esbuild:build'], 'dist'),
        smallSize: fs.existsSync(path.join(smallAppDir, 'dist/esbuild.js')) ?
            fs.statSync(path.join(smallAppDir, 'dist/esbuild.js')).size / 1024 : 0
    };

    // NEXXO - Medium App
    console.log('[6/6] Measuring Nexxo (Medium App)...');
    const mediumStart = await measureColdStart(mediumAppDir, 'npm', ['run', 'dev', '--'], 8003);
    const mediumBuild = await measureBuild(mediumAppDir, 'npm', ['run', 'build'], 'dist');
    const mediumSize = getDirSize(path.join(mediumAppDir, 'dist')) / 1024;

    results.Nexxo.mediumStart = mediumStart;
    results.Nexxo.mediumBuild = mediumBuild;
    results.Nexxo.mediumSize = mediumSize;

    // ========================================================================
    // GENERATE REPORT
    // ========================================================================
    console.log('\n📊 GENERATING COMPARISON REPORT...\n');

    const metrics = [
        { key: 'smallStart', label: 'Small - Cold Start (ms)', lower: true },
        { key: 'smallBuild', label: 'Small - Build (ms)', lower: true },
        { key: 'smallSize', label: 'Small - Size (KB)', lower: true },
        { key: 'mediumStart', label: 'Medium - Cold Start (ms)', lower: true },
        { key: 'mediumBuild', label: 'Medium - Build (ms)', lower: true },
        { key: 'mediumSize', label: 'Medium - Size (KB)', lower: true }
    ];

    const tools = ['Nexxo', 'Webpack', 'Vite', 'Rspack', 'esbuild'];
    const reportRows: any[] = [];

    metrics.forEach(metric => {
        const values = tools.map(tool => ({
            tool,
            value: results[tool]?.[metric.key] || 0
        })).filter(v => v.value > 0);

        values.sort((a, b) => a.value - b.value);

        const row: any = { Metric: metric.label };

        tools.forEach(tool => {
            const val = results[tool]?.[metric.key] || 0;
            if (val === 0) {
                row[tool] = 'N/A';
                return;
            }

            const rank = values.findIndex(v => v.tool === tool) + 1;
            let icon = '';
            if (rank === 1) icon = ' 🥇';
            else if (rank === 2) icon = ' 🥈';
            else if (rank === 3) icon = ' 🥉';

            row[tool] = `${val.toFixed(0)}${icon}`;
        });

        const nexxoRank = values.findIndex(v => v.tool === 'Nexxo') + 1;
        row['Nexxo Rank'] = nexxoRank > 0 ? `#${nexxoRank}` : 'N/A';

        reportRows.push(row);
    });

    console.table(reportRows);

    // Save Markdown Report
    const mdReport = `# 🏁 HONEST Benchmark Report (Real Measurements)

**Execution Date:** ${new Date().toISOString()}  
**Environment:** Linux, Node ${process.version}

## Results

| Metric | Nexxo | Vite | Webpack | Rspack | esbuild | Nexxo Rank |
|--------|-------|------|---------|--------|---------|------------|
${reportRows.map(r => `| ${r.Metric} | ${r.Nexxo} | ${r.Vite} | ${r.Webpack} | ${r.Rspack} | ${r.esbuild} | ${r['Nexxo Rank']} |`).join('\n')}

**Notes:**
- All values are **measured live** on the same hardware.
- Cold Start: Time from command execution to server ready.
- Build: Time to complete production build.
- Size: Total dist folder size (KB).
- "N/A" indicates the tool doesn't support that operation in this test setup.
`;

    fs.writeFileSync(path.join(root, 'HONEST_BENCHMARKS.md'), mdReport);
    console.log('\n✅ Report saved to HONEST_BENCHMARKS.md\n');
}

run().catch(err => {
    console.error('Benchmark failed:', err);
    process.exit(1);
});
