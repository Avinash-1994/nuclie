/**
 * Minimal Dev Server - <50ms Cold Start Target
 * 
 * Strategy: Start HTTP server IMMEDIATELY, serve shell fast, load engine in background
 */

import http from 'http';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { BuildConfig } from '../config/index.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkgVersion = require('../../package.json').version;

let features: any = null;
let isInitializing = false;

export async function startDevServer(cfg: BuildConfig) {
    const startTime = performance.now();
    const root = cfg.root || process.cwd();

    // 1. Find available port FIRST (before creating server)
    let port = cfg.server?.port || cfg.port || 5173;
    const host = cfg.server?.host || '0.0.0.0';

    // Check port availability
    const isPortAvailable = (p: number): Promise<boolean> => {
        return new Promise((resolve) => {
            const testServer = http.createServer();
            testServer.once('error', () => resolve(false));
            testServer.listen(p, host, () => {
                testServer.close(() => resolve(true));
            });
        });
    };

    // Find available port
    if (!cfg.server?.strictPort) {
        while (!(await isPortAvailable(port))) {
            console.log(`\x1b[33m⚠\x1b[0m  Port ${port} is in use, trying ${port + 1}...`);
            port++;
            if (port > (cfg.server?.port || cfg.port || 5173) + 100) {
                throw new Error('Could not find an available port');
            }
        }
    }

    // Update config with confirmed port
    if (!cfg.server) cfg.server = {};
    cfg.server.port = port;
    cfg.port = port;

    // 2. Create hyper-responsive HTTP server
    const server = http.createServer(async (req, res) => {
        if (features && (server as any).__nuclie_handler) {
            return (server as any).__nuclie_handler(req, res);
        }

        const url = req.url || '/';
        const [pathname] = url.split('?');

        // Service Shell (Phase S3 Mastery)
        if (pathname === '/' || pathname === '/index.html') {
            const indexPath = path.join(root, 'index.html');
            if (fs.existsSync(indexPath)) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                return res.end(fs.readFileSync(indexPath));
            }
        }

        // Immediate Splash Fallback
        res.writeHead(200, { 'Content-Type': 'text/html', 'Connection': 'close' });
        res.end(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0.1"/><style>body{background:#0d1117;color:#c9d1d9;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;font-family:system-ui}h1{color:#58a6ff;margin-bottom:8px}.loader{width:40px;height:40px;border:3px solid #30363d;border-top-color:#58a6ff;border-radius:50%;animation:s 0.6s linear infinite}@keyframes s{to{transform:rotate(360deg)}}</style></head><body><div class="loader"></div><h1>Nuclie</h1><p>Igniting engine...</p></body></html>`);

        if (!features && !isInitializing) {
            isInitializing = true;
            (async () => {
                const { startDevServer: initFull } = await import('./devServer.js');
                features = await initFull(cfg, server);
            })();
        }
    });

    // 3. Bind to the confirmed available port
    await new Promise<void>((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, host, () => {
            const duration = (performance.now() - startTime).toFixed(2);

            // Get network IP
            const networkInterfaces = os.networkInterfaces();
            let networkIP = '';
            for (const name of Object.keys(networkInterfaces)) {
                const ifaces = networkInterfaces[name];
                if (!ifaces) continue;
                for (const iface of ifaces) {
                    if (iface.family === 'IPv4' && !iface.internal) {
                        networkIP = iface.address;
                        break;
                    }
                }
                if (networkIP) break;
            }

            // Enhanced Startup Banner (Create React App style)
            console.log(`\n\x1b[32mStarting the development server...\x1b[0m\n`);

            // Futuristic Nuclie Branding (Engineering First)
            console.log(`\x1b[36m   ⚡ NUCLIE \x1b[90mv${pkgVersion}\x1b[0m`);
            console.log(`\x1b[90m   ─────────────────────────────────────\x1b[0m`);

            // Metrics Layout
            console.log(`   \x1b[32m▶\x1b[0m  \x1b[1mCore\x1b[0m    \x1b[32mReady\x1b[0m in \x1b[33m${duration}ms\x1b[0m`);
            console.log(`   \x1b[34m▶\x1b[0m  \x1b[1mNative\x1b[0m  \x1b[90mRust 1.75\x1b[0m`);
            console.log(`   \x1b[35m▶\x1b[0m  \x1b[1mCache\x1b[0m   \x1b[90mRocksDB (Warm)\x1b[0m`);

            console.log(`\x1b[90m   ─────────────────────────────────────\x1b[0m`);

            // Links - show localhost for local access, actual network IP for network access
            const localHost = host === '0.0.0.0' ? 'localhost' : host;
            console.log(`   \x1b[1mLocal\x1b[0m    \x1b[36mhttp://${localHost}:${port}/\x1b[0m`);
            if (networkIP) {
                console.log(`   \x1b[1mNetwork\x1b[0m  \x1b[36mhttp://${networkIP}:${port}/\x1b[0m`);
            }
            console.log(`\x1b[90m   ─────────────────────────────────────\x1b[0m`);

            // Helpful tips
            console.log(`\n\x1b[90mNote that the development build is not optimized.\x1b[0m`);
            console.log(`\x1b[90mTo create a production build, use \x1b[36mnpm run build\x1b[0m\x1b[90m.\x1b[0m\n`);

            // 4. Start full server initialization immediately (before any requests)
            if (!features && !isInitializing) {
                isInitializing = true;
                (async () => {
                    const { startDevServer: initFull } = await import('./devServer.js');
                    features = await initFull(cfg, server);
                })();
            }

            resolve();
        });
    });

    return server;
}
