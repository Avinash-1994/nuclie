
/**
 * Urja Template Definitions
 * Defines the file structure for 12 supported frameworks.
 * Day 17: Create-Urja Templates Lock
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
        path: 'urja.config.ts',
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
    react: {
        id: 'react',
        name: 'React',
        description: 'React Latest + TypeScript + Urja',
        files: [
            ...COMMON_FILES,
            { path: 'src/main.tsx', content: `import { createRoot } from 'react-dom/client'; import App from './App'; createRoot(document.getElementById('root')!).render(<App />);` },
            { path: 'src/App.tsx', content: `export default function App() { return <h1>Hello Urja React</h1>; }` },
            { path: 'index.html', content: `<!DOCTYPE html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>` }
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
            { path: 'src/App.vue', content: `<template><h1>Hello Urja Vue</h1></template>` },
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
