# 🎨 Nuclie Templates - Visual Guide

## How Templates Work

When you run `npx create-nuclie my-app --template react-spa`, Nuclie:

1. Creates a new directory `my-app/`
2. Generates all files from the template
3. Installs dependencies
4. Ready to run!

## Template Structure

```
my-app/                    # Your new project
├── src/
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Main component
│   ├── App.css           # Component styles
│   └── index.css         # Global styles
├── index.html            # HTML entry
├── nuclie.config.ts       # Nuclie configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md             # Project README
```

---

## 📦 Available Templates

### 1. React SPA (`react-spa`)

**What you get:**
```
my-react-app/
├── src/
│   ├── main.tsx          # ReactDOM.createRoot
│   ├── App.tsx           # Counter example with hooks
│   ├── App.css
│   └── index.css         # Dark theme
├── index.html
├── nuclie.config.ts       # React plugin configured
└── package.json          # React 18+
```

**Preview of App.tsx:**
```tsx
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Nuclie + React</h1>
      <button onClick={() => setCount(count + 1)}>
        count is {count}
      </button>
    </div>
  );
}
```

**Features:**
- ✅ React 18+ with TypeScript
- ✅ Hot Module Replacement
- ✅ Modern dark theme
- ✅ Counter example
- ✅ Production-ready config

---

### 2. Vue SPA (`vue-spa`)

**What you get:**
```
my-vue-app/
├── src/
│   ├── main.ts           # createApp
│   ├── App.vue           # SFC with <script setup>
│   ├── components/
│   │   └── HelloWorld.vue
│   └── style.css
├── index.html
├── nuclie.config.ts       # Vue plugin
└── package.json          # Vue 3+
```

**Preview of App.vue:**
```vue
<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

const count = ref(0)
</script>

<template>
  <div id="app">
    <h1>Nuclie + Vue</h1>
    <button @click="count++">Count: {{ count }}</button>
    <HelloWorld msg="Welcome to Vue 3" />
  </div>
</template>

<style scoped>
#app {
  text-align: center;
  padding: 2rem;
}
</style>
```

---

### 3. Svelte SPA (`svelte-spa`)

**What you get:**
```
my-svelte-app/
├── src/
│   ├── main.ts           # new App({ target })
│   ├── App.svelte        # Main component
│   ├── lib/
│   │   └── Counter.svelte
│   └── app.css
├── index.html
├── nuclie.config.ts       # Svelte plugin
└── package.json          # Svelte 4+
```

**Preview of App.svelte:**
```svelte
<script lang="ts">
  import Counter from './lib/Counter.svelte'
  let name = 'Nuclie'
</script>

<main>
  <h1>Hello {name}!</h1>
  <Counter />
  <p>
    Visit <a href="https://nuclie.dev">nuclie.dev</a> to learn more
  </p>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
</style>
```

---

### 4. Next.js App (`nextjs-app`) 🆕

**What you get:**
```
my-nextjs-app/
├── src/
│   └── app/
│       ├── page.tsx      # Home page
│       ├── layout.tsx    # Root layout
│       └── globals.css   # Tailwind CSS
├── nuclie.config.js       # SSR enabled
├── tailwind.config.js    # Tailwind setup
└── package.json          # React 19+
```

**Preview of page.tsx:**
```tsx
export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold">
        Welcome to Nuclie + Next.js
      </h1>
      <p className="mt-4">
        Start building your app with App Router
      </p>
    </main>
  );
}
```

**Features:**
- ✅ App Router (Next.js 13+ style)
- ✅ Tailwind CSS pre-configured
- ✅ Server-Side Rendering
- ✅ TypeScript
- ✅ Modern layout system

---

### 5. Monorepo (`monorepo`)

**What you get:**
```
my-monorepo/
├── packages/
│   ├── web/              # Frontend app
│   │   ├── src/
│   │   └── nuclie.config.js
│   ├── api/              # Backend API
│   │   ├── src/
│   │   └── nuclie.config.js
│   └── shared/           # Shared utilities
│       └── src/
├── package.json          # Workspace root
└── pnpm-workspace.yaml   # Workspace config
```

**Features:**
- ✅ Multi-package workspace
- ✅ Shared dependencies
- ✅ Independent builds
- ✅ TypeScript path aliases
- ✅ Monorepo best practices

---

### 6. Edge Runtime (`edge`)

**What you get:**
```
my-edge-app/
├── src/
│   ├── index.ts          # Edge handler
│   └── middleware.ts     # Edge middleware
├── nuclie.config.js       # target: 'edge'
└── package.json          # Minimal deps
```

**Preview of index.ts:**
```typescript
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/hello') {
      return new Response(
        JSON.stringify({ message: 'Hello from Edge!' }),
        { headers: { 'content-type': 'application/json' } }
      );
    }
    
    return new Response('Not found', { status: 404 });
  }
}
```

**Features:**
- ✅ Cloudflare Workers compatible
- ✅ Vercel Edge Functions ready
- ✅ Minimal bundle size
- ✅ Fast cold starts
- ✅ TypeScript

---

### 7. Fintech (`fintech`)

**What you get:**
```
my-fintech-app/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── Chart.tsx
│   │   └── Table.tsx
│   ├── utils/
│   │   ├── security.ts   # Encryption helpers
│   │   └── validation.ts # Input validation
│   └── styles/
├── nuclie.config.js       # Security headers
└── package.json          # Enterprise deps
```

**Features:**
- ✅ Security-first configuration
- ✅ CSP headers
- ✅ Input validation
- ✅ Audit logging
- ✅ Dashboard components
- ✅ Chart libraries
- ✅ Data tables

---

## 🎯 How to Use Templates

### Create from Template

```bash
# Interactive selection
npx create-nuclie my-app

# Specific template
npx create-nuclie my-app --template react-spa

# With package manager
npx create-nuclie my-app --template vue-spa --pm pnpm
```

### After Creation

```bash
cd my-app

# Install dependencies (if not auto-installed)
npm install

# Start development server
npm run dev
# or
nuclie dev

# Build for production
npm run build
# or
nuclie build
```

---

## 🎨 Visual Preview

### React SPA Running

```
┌─────────────────────────────────────────┐
│                                         │
│         Nuclie + React                   │
│                                         │
│    ┌─────────────────────┐              │
│    │  count is 0         │              │
│    └─────────────────────┘              │
│                                         │
│    Edit src/App.tsx and save to        │
│    test HMR                             │
│                                         │
│    Click on the Nuclie logo to learn    │
│    more                                 │
│                                         │
└─────────────────────────────────────────┘
```

### Development Server Output

```bash
$ nuclie dev

  ⚡ Nuclie v1.0.0

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.100:3000/

  🔥 Hot Module Replacement enabled
  📦 Framework: React (auto-detected)
  ⚙️  Plugins: 7 loaded

  ready in 69ms
```

### Build Output

```bash
$ nuclie build

  ⚡ Nuclie v1.0.0

  Building for production...

  ✓ Dependency graph built (234ms)
  ✓ Transformed 45 modules (312ms)
  ✓ Optimized bundle (89ms)
  ✓ Generated artifacts (23ms)

  dist/index.html                  0.33 kB
  dist/assets/index.dd5cd9fc.js   26.12 kB │ gzip: 7.89 kB │ br: 6.91 kB
  dist/remoteEntry.js              0.34 kB

  ✓ Build complete in 658ms
```

---

## 📁 Template File Structure Comparison

### Minimal (Vanilla)
```
my-app/
├── src/
│   └── index.ts          # 1 file
├── index.html
├── nuclie.config.js
└── package.json
```

### Standard (React/Vue)
```
my-app/
├── src/
│   ├── main.tsx          # 4-5 files
│   ├── App.tsx
│   ├── App.css
│   └── index.css
├── index.html
├── nuclie.config.ts
├── tsconfig.json
└── package.json
```

### Enterprise (Fintech/Monorepo)
```
my-app/
├── packages/            # 20+ files
│   ├── web/
│   ├── api/
│   └── shared/
├── docs/
├── scripts/
├── .github/
├── nuclie.config.js
├── package.json
└── pnpm-workspace.yaml
```

---

## 🔧 Customizing Templates

### Modify Existing Template

```typescript
// src/templates/starters/my-custom.ts
export const myCustomTemplate = {
  id: 'my-custom',
  name: 'My Custom Template',
  description: 'Custom starter',
  framework: 'react',
  files: {
    'src/main.tsx': `// Your custom code`,
    // ... more files
  }
};
```

### Register Template

```typescript
// src/templates/manager.ts
import { myCustomTemplate } from './starters/my-custom.js';

export const templates = [
  reactSpaTemplate,
  vueSpaTemplate,
  myCustomTemplate, // Add here
];
```

---

## 📊 Template Comparison

| Template | Files | Size | Build Time | Best For |
|----------|-------|------|------------|----------|
| react-spa | 8 | 26KB | ~500ms | SPAs |
| vue-spa | 9 | 24KB | ~480ms | SPAs |
| svelte-spa | 7 | 20KB | ~520ms | SPAs |
| nextjs-app | 10 | 28KB | ~650ms | SSR Apps |
| monorepo | 25+ | Varies | Varies | Large Projects |
| edge | 4 | 8KB | ~200ms | Serverless |
| fintech | 30+ | 45KB | ~800ms | Enterprise |

---

## 🚀 Next Steps

After creating your project:

1. **Explore the code** - Check out the generated files
2. **Start dev server** - `nuclie dev`
3. **Make changes** - Edit files and see HMR in action
4. **Add features** - Install packages, add routes
5. **Build** - `nuclie build` for production
6. **Deploy** - Upload `dist/` to your hosting

---

**Need help?** Check out the [documentation](../README.md) or [create an issue](https://github.com/Avinash-1994/nuclie/issues)!
