import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
                results = results.concat(walk(file));
                results.push(file); // add directory itself
            }
        } else {
            results.push(file);
        }
    });
    return results;
}

const dirs = ['./packages', './src', './tests'];
let filesDirs = [];
for (const dir of dirs) {
    if (fs.existsSync(dir)) filesDirs = filesDirs.concat(walk(dir));
}

// Rename leaf to root by sorting descending by length so we rename deepest first
filesDirs.sort((a, b) => b.length - a.length);

for (const p of filesDirs) {
    const parent = path.dirname(p);
    const base = path.basename(p);
    if (base.toLowerCase().includes('nuclie')) {
        const newBase = base.replace(/nuclie/gi, match => {
            if (match === 'nuclie') return 'sparx';
            if (match === 'Nuclie') return 'Sparx';
            if (match === 'NUCLIE') return 'SPARX';
            return 'sparx';
        });
        const newPath = path.join(parent, newBase);
        fs.renameSync(p, newPath);
        console.log(`Renamed ${p} to ${newPath}`);
    }
}
