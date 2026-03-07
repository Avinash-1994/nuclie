
/**
 * Nuclie Template Definitions
 * Defines the file structure for 12 supported frameworks.
 * Day 17: Create-Nuclie Templates Lock
 */

export interface TemplateFile {
    path: string;
    content: string;
}

export interface TemplateDef {
    id: string;
    name: string;
    description: string;
    files: TemplateFile[];
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
}

// Minimal definitions for the 12 frameworks to prove capability.
// In a real repo, these would be larger or loaded from external storage.

const COMMON_FILES: TemplateFile[] = [
    {
        path: 'nuclie.config.ts',
        content: `export default {
    mode: 'development',
    plugins: []
};`
    },
    {
        path: 'tsconfig.json',
        content: `{
    "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "strict": true,
        "jsx": "preserve"
    }
}`
    }
];

export const TEMPLATES: Record<string, TemplateDef> = {
    'react-ts': {
        id: 'react-ts',
        name: 'React TypeScript',
        description: 'React Latest + TypeScript + Nuclie',
        files: [
            ...COMMON_FILES,
            { path: 'index.html', content: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Nuclie + React + TS</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>` },
            { path: 'src/main.tsx', content: `import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport './index.css';\nimport App from './App.tsx';\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n);` },
            { path: 'src/App.tsx', content: `import { useState } from 'react';\nimport './App.css';\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <>\n      <h1>Nuclie + React</h1>\n      <div className="card">\n        <button onClick={() => setCount((count) => count + 1)}>\n          count is {count}\n        </button>\n        <p>\n          Edit <code>src/App.tsx</code> and save to test HMR\n        </p>\n      </div>\n      <p className="read-the-docs">\n        Click on the Nuclie and React logos to learn more\n      </p>\n    </>\n  );\n}\n\nexport default App;\n` },
            { path: 'src/index.css', content: `:root {\n  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;\n  line-height: 1.5;\n  font-weight: 400;\n  color-scheme: light dark;\n  color: rgba(255, 255, 255, 0.87);\n  background-color: #242424;\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\nbody {\n  margin: 0;\n  display: flex;\n  place-items: center;\n  min-width: 320px;\n  min-height: 100vh;\n}\n\nh1 {\n  font-size: 3.2em;\n  line-height: 1.1;\n}\n\n#root {\n  max-width: 1280px;\n  margin: 0 auto;\n  padding: 2rem;\n  text-align: center;\n}` },
            { path: 'src/App.css', content: `.logo {\n  height: 6em;\n  padding: 1.5em;\n  will-change: filter;\n  transition: filter 300ms;\n}\n.logo:hover {\n  filter: drop-shadow(0 0 2em #646cffaa);\n}\n.logo.react:hover {\n  filter: drop-shadow(0 0 2em #61dafbaa);\n}\n\n@keyframes logo-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  a:nth-of-type(2) .logo {\n    animation: logo-spin infinite 20s linear;\n  }\n}\n\n.card {\n  padding: 2em;\n}\n\n.read-the-docs {\n  color: #888;\n}` }
        ],
        dependencies: { "react": "latest", "react-dom": "latest" },
        devDependencies: { "@types/react": "latest", "@types/react-dom": "latest" }
    },
    vue: {
        id: 'vue',
        name: 'Vue',
        description: 'Vue Latest + TypeScript',
        files: [
            ...COMMON_FILES,
            { path: 'src/main.ts', content: `import { createApp } from 'vue'; import App from './App.vue'; createApp(App).mount('#app');` },
            { path: 'src/App.vue', content: `<template><h1>Hello Nuclie Vue</h1></template>` },
            { path: 'index.html', content: `<!DOCTYPE html><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body>` }
        ],
        dependencies: { "vue": "latest" },
        devDependencies: { "@vue/compiler-sfc": "latest" }
    },
    svelte: {
        id: 'svelte',
        name: 'Svelte',
        description: 'Svelte Latest + TypeScript',
        files: [...COMMON_FILES, { path: 'src/main.ts', content: '' }],
        dependencies: { "svelte": "latest" },
        devDependencies: {}
    },
    solid: { id: 'solid', name: 'Solid', description: 'SolidJS Signal Power', files: [...COMMON_FILES], dependencies: { "solid-js": "latest" }, devDependencies: {} },
    lit: { id: 'lit', name: 'Lit', description: 'Web Components', files: [...COMMON_FILES], dependencies: { "lit": "latest" }, devDependencies: {} },
    angular: { id: 'angular', name: 'Angular', description: 'Angular Ivy', files: [...COMMON_FILES], dependencies: { "@angular/core": "latest" }, devDependencies: {} },
    preact: { id: 'preact', name: 'Preact', description: 'Fast 3kb React alt', files: [...COMMON_FILES], dependencies: { "preact": "latest" }, devDependencies: {} },
    qwik: { id: 'qwik', name: 'Qwik', description: 'Resumable Framework', files: [...COMMON_FILES], dependencies: { "@builder.io/qwik": "latest" }, devDependencies: {} },
    astro: { id: 'astro', name: 'Astro', description: 'Content Focused', files: [...COMMON_FILES], dependencies: { "astro": "latest" }, devDependencies: {} },
    next: { id: 'next', name: 'Next-like', description: 'React SSR Router', files: [...COMMON_FILES], dependencies: { "react": "latest", "wouter": "latest" }, devDependencies: {} },
    nuxt: { id: 'nuxt', name: 'Nuxt-like', description: 'Vue Meta Framework', files: [...COMMON_FILES], dependencies: { "vue": "latest", "vue-router": "latest" }, devDependencies: {} },
    sveltekit: { id: 'sveltekit', name: 'SvelteKit-like', description: 'Svelte Fullstack', files: [...COMMON_FILES], dependencies: { "svelte": "latest" }, devDependencies: {} },
};
