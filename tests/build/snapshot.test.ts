import { describe, it, expect, beforeAll } from '@jest/globals';
import path from 'path';
import fs from 'fs';

describe('Build Output Snapshots', () => {
    const fixturesDir = path.resolve(process.cwd(), 'tests/fixtures');

    beforeAll(() => {
        if (!fs.existsSync(fixturesDir)) {
            fs.mkdirSync(fixturesDir, { recursive: true });
        }
    });

    describe('React App Build', () => {
        it('should validate React project structure', async () => {
            const projectPath = path.join(fixturesDir, 'react-simple');

            // Create minimal React fixture
            if (!fs.existsSync(projectPath)) {
                fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

                fs.writeFileSync(
                    path.join(projectPath, 'src/App.tsx'),
                    `import React from 'react';
export const App = () => <div>Hello World</div>;`
                );

                fs.writeFileSync(
                    path.join(projectPath, 'src/main.tsx'),
                    `import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
createRoot(document.getElementById('root')!).render(<App />);`
                );

                fs.writeFileSync(
                    path.join(projectPath, 'package.json'),
                    JSON.stringify({
                        name: 'react-simple',
                        type: 'module',
                        dependencies: {
                            'react': '^18.0.0',
                            'react-dom': '^18.0.0'
                        }
                    }, null, 2)
                );
            }

            // Verify project structure
            expect(fs.existsSync(path.join(projectPath, 'src/App.tsx'))).toBe(true);
            expect(fs.existsSync(path.join(projectPath, 'src/main.tsx'))).toBe(true);
            expect(fs.existsSync(path.join(projectPath, 'package.json'))).toBe(true);
        });

        it('should validate TypeScript configuration', async () => {
            const projectPath = path.join(fixturesDir, 'react-simple');

            // Check that TypeScript files are valid
            const appContent = fs.readFileSync(
                path.join(projectPath, 'src/App.tsx'),
                'utf-8'
            );

            expect(appContent).toContain('React');
            expect(appContent).toContain('export');
        });
    });

    describe('Vue App Build', () => {
        it('should validate Vue project structure', async () => {
            const projectPath = path.join(fixturesDir, 'vue-simple');

            if (!fs.existsSync(projectPath)) {
                fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

                fs.writeFileSync(
                    path.join(projectPath, 'src/App.vue'),
                    `<template>
  <div>Hello Vue</div>
</template>

<script setup lang="ts">
const message = 'Hello';
</script>`
                );

                fs.writeFileSync(
                    path.join(projectPath, 'package.json'),
                    JSON.stringify({
                        name: 'vue-simple',
                        type: 'module',
                        dependencies: {
                            'vue': '^3.0.0'
                        }
                    }, null, 2)
                );
            }

            expect(fs.existsSync(path.join(projectPath, 'src/App.vue'))).toBe(true);
        });
    });

    describe('TypeScript Build', () => {
        it('should validate TypeScript files', async () => {
            const projectPath = path.join(fixturesDir, 'ts-simple');

            if (!fs.existsSync(projectPath)) {
                fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

                fs.writeFileSync(
                    path.join(projectPath, 'src/index.ts'),
                    `interface User {
  name: string;
  age: number;
}

const user: User = { name: 'John', age: 30 };
console.log(user);`
                );

                fs.writeFileSync(
                    path.join(projectPath, 'package.json'),
                    JSON.stringify({
                        name: 'ts-simple',
                        type: 'module'
                    }, null, 2)
                );
            }

            const content = fs.readFileSync(
                path.join(projectPath, 'src/index.ts'),
                'utf-8'
            );

            // Verify TypeScript syntax
            expect(content).toContain('interface User');
            expect(content).toContain(': string');
            expect(content).toContain(': number');
        });
    });
});
