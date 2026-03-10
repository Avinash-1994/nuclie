const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const frameworks = [
    'react-ts', 'react-js',
    'vue-ts', 'vue-js',
    'svelte-ts', 'svelte-js',
    'solid-ts', 'solid-js',
    'preact-ts', 'preact-js',
    'qwik-ts', 'qwik-js',
    'lit-ts', 'lit-js',
    'alpine-ts', 'alpine-js'
];

const standardPath = path.resolve(__dirname, '../templates/standard');
const oldPath = path.resolve(__dirname, '../templates/standard_old');

if (fs.existsSync(standardPath)) {
    if (fs.existsSync(oldPath)) fs.rmSync(oldPath, { recursive: true, force: true });
    fs.renameSync(standardPath, oldPath);
}

fs.mkdirSync(standardPath, { recursive: true });

for (const fw of frameworks) {
    console.log(`Regenerating standard template for ${fw}...`);
    const target = path.join(standardPath, fw);
    execSync(`node dist/cli.js bootstrap --name "${target}" --template "${fw}"`, {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
    });
}

console.log('Standard templates successfully regenerated from unified generator logic!');
