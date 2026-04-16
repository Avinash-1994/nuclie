import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';

const MIME = {
    '.js': 'application/javascript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

function serveDir(dir, port) {
    const server = createServer((req, res) => {
        // Handle CORS for Module Federation
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        let filePath = join(dir, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
        if (!existsSync(filePath)) {
            filePath = join(dir, 'index.html');
        }
        
        try {
            const data = readFileSync(filePath);
            res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'text/plain' });
            res.end(data);
        } catch {
            res.writeHead(404);
            res.end('Not found');
        }
    });

    server.listen(port, () => {
        console.log(`🚀 Serving ${dir} at http://localhost:${port}/`);
    });
}

console.log("Starting Production MFE Servers...");
serveDir(join(process.cwd(), 'real-world-mfe/host/dist'), 3000);
serveDir(join(process.cwd(), 'real-world-mfe/nav/dist'), 3001);

console.log("\\n✅ Servers are running! Open http://localhost:3000 in your browser to view the application.");
console.log("Press Ctrl+C to stop the servers.\\n");
