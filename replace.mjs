import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src').filter(f => f.endsWith('.ts') || f.endsWith('.js'));
let modified = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('@nuclie/adapter-core')) {
        content = content.replace(/@nuclie\/adapter-core/g, '@sparx/adapter-core');
        content = content.replace(/NuclieAdapter/g, 'SparxAdapter');
        content = content.replace(/NuclieConfig/g, 'SparxConfig');
        fs.writeFileSync(file, content, 'utf8');
        modified++;
    }
}
console.log(`Replaced in ${modified} files.`);
