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
            }
        } else {
            results.push(file);
        }
    });
    return results;
}

const dirs = ['./src', './tests', './packages'];
let files = [];
for (const dir of dirs) {
    if (fs.existsSync(dir)) files = files.concat(walk(dir));
}

const exts = ['.ts', '.js', '.mjs', '.cjs', '.json', '.md'];
files = files.filter(f => exts.includes(path.extname(f)));

let modified = 0;
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace nuclie -> sparx
    content = content.replace(/\bnuclie\b/g, 'sparx');
    // Replace Nuclie -> Sparx
    content = content.replace(/\bNuclie\b/g, 'Sparx');
    // Replace NUCLIE -> SPARX
    content = content.replace(/\bNUCLIE\b/g, 'SPARX');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modified++;
        console.log(`Replaced in ${file}`);
    }
}
console.log(`\nTotal files modified: ${modified}`);
