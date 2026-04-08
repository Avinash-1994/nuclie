const http = require('http');
const fs = require('fs');
const path = require('path');

const createServer = (port, dir) => {
  http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let filePath = path.join(dir, req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json'
    }[extname] || 'text/plain';
    
    fs.readFile(filePath, (error, content) => {
      if (error) {
        if(error.code == 'ENOENT') {
          fs.readFile(path.join(dir, 'index.html'), function(error, content) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          });
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }).listen(port, '0.0.0.0', () => console.log(`Server running at http://0.0.0.0:${port}/`));
};

createServer(3001, './real-world-mfe/nav/dist');
createServer(3000, './real-world-mfe/host/dist');
