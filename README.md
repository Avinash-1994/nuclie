# ⚡ Nexxo — Modern Build Tool

[![npm version](https://img.shields.io/npm/v/nexxo.svg)](https://www.npmjs.com/package/nexxo)
[![CI](https://github.com/Avinash-1994/Nexxo/actions/workflows/ci.yml/badge.svg)](https://github.com/Avinash-1994/Nexxo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-109%2F109-brightgreen)](#test-status)
[![Node >=20](https://img.shields.io/badge/node-%3E%3D20-blue)](https://nodejs.org)
[![Website](https://img.shields.io/badge/website-live-brightgreen)](https://avinash-1994.github.io/Nexxo/)

Nexxo is a build tool with built-in HMR, source maps, tree shaking, module federation, and support for 10+ JavaScript frameworks. It ships a native Rust core (SWC + LightningCSS) for fast transforms.

**[📖 Documentation Website →](https://avinash-1994.github.io/Nexxo/)**

---

## ✨ Features

- ⚡ **Fast Builds** — Parallel pipeline with Rust-native transforms (SWC)
- 🔥 **Hot Module Replacement** — Framework-aware HMR, sub-60ms updates
- 🗺️ **Source Maps** — `inline`, `external`, and `hidden` modes
- 🌳 **Tree Shaking** — AST-based dead code elimination in production
- 📦 **Module Federation** — Micro-frontend support built in
- 🎨 **CSS Processing** — PostCSS, CSS Modules, and Tailwind CSS (LightningCSS)
- 🔌 **Plugin System** — Extensible `load` and `transform` hooks
- 💾 **Smart Caching** — Fingerprint-based incremental builds
- 🌐 **Multi-Framework** — React, Vue, Svelte, Solid, Preact, Lit, Alpine, Qwik, and more

---

## 🚀 Quick Start

```bash
# Install globally
npm install -g nexxo

# Scaffold a new project
nexxo bootstrap --name my-app --template react-ts

# Start dev server
cd my-app
nexxo dev

# Production build
nexxo build
```

---

## 📦 Installation

```bash
npm install -g nexxo
```

**Requirements:** Node.js ≥ 20

---

## 🎯 Framework Configuration

Every framework gets an identical config shape — only the `entry` file changes. Here is the **complete config reference** for each supported framework:

### ⚛️ React

```bash
nexxo bootstrap --name my-app --template react-ts
```

```js
// nexxo.config.js
module.exports = {
  entry: ['./src/main.tsx'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external', // 'inline' | 'external' | 'hidden' | false
  },

  dev: {
    port: 3000,
    hmr: true,
  },

  // Optional
  css: {
    modules: true,
    framework: 'tailwind',
  },
};
```

---

### 🟩 Vue 3

```bash
nexxo bootstrap --name my-app --template vue-ts
```

```js
// nexxo.config.js
module.exports = {
  entry: ['./src/main.ts'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external',
  },

  dev: {
    port: 5173,
    hmr: true,
  },
};
```

---

### 🧡 Svelte 5

```bash
nexxo bootstrap --name my-app --template svelte-ts
```

```js
// nexxo.config.js
module.exports = {
  entry: ['./src/main.ts'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external',
  },

  dev: {
    port: 5173,
    hmr: true,
  },

  css: {
    modules: false, // Svelte handles scoping natively
  },
};
```

---

### 🔵 SolidJS

```bash
nexxo bootstrap --name my-app --template solid-ts
```

```js
// nexxo.config.js
module.exports = {
  entry: ['./src/index.tsx'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external',
  },

  dev: {
    port: 3000,
    hmr: true,
  },
};
```

---

### 🟣 Preact

```bash
nexxo bootstrap --name my-app --template preact-ts
```

```js
// nexxo.config.js
module.exports = {
  entry: ['./src/index.tsx'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external',
  },

  dev: {
    port: 3000,
    hmr: true,
  },

  // Alias react → preact/compat for React library compatibility
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
};
```

---

### 🔶 Lit (Web Components)

```bash
nexxo bootstrap --name my-app --template lit-ts
```

```js
// nexxo.config.js
module.exports = {
  entry: ['./src/main.ts'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external',
    target: 'es2020', // Lit uses modern JS — no transpiling to ES5
  },

  dev: {
    port: 3000,
    hmr: true,
  },
};
```

---

### 🏔️ Alpine.js

```bash
nexxo bootstrap --name my-app --template alpine-js
```

```js
// nexxo.config.js
module.exports = {
  entry: ['./src/main.js'],
  outDir: './dist',

  build: {
    minify: true,
  },

  dev: {
    port: 3000,
    hmr: true,
  },
};
```

---

### ⚡ Vanilla JS / TypeScript

```bash
nexxo bootstrap --name my-app --template vanilla-js
# or
nexxo bootstrap --name my-app --template vanilla-ts
```

```js
// nexxo.config.js
module.exports = {
  entry: ['./src/main.ts'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external',
  },

  dev: {
    port: 3000,
    hmr: true,
  },
};
```

---

## ⚙️ Full Config Reference

```js
// nexxo.config.js — all options
module.exports = {
  // Entry points (relative to project root)
  entry: ['./src/main.tsx'],

  // Output directory
  outDir: './dist',

  // Dev server
  dev: {
    port: 3000,
    hmr: true,
    open: false,        // Auto-open browser
    https: false,       // Enable HTTPS
  },

  // Production build
  build: {
    minify: true,
    sourcemap: 'external',  // 'inline' | 'external' | 'hidden' | false
    target: 'es2020',
  },

  // CSS processing
  css: {
    modules: false,            // Enable CSS Modules
    framework: 'tailwind',     // 'tailwind' | 'unocss' | false
  },

  // Module aliases
  resolve: {
    alias: {
      '@': './src',
    },
  },

  // Module Federation (micro-frontends)
  federation: {
    name: 'host',
    remotes: {
      cart: 'http://localhost:3001/remoteEntry.js',
    },
  },

  // Plugins
  plugins: [],
};
```

---

## 📦 Module Federation

```js
// Host app — consume remotes
module.exports = {
  entry: ['./src/main.tsx'],
  federation: {
    name: 'host',
    remotes: {
      cart: 'http://localhost:3001/remoteEntry.js',
    },
  },
};
```

```js
// Remote app — expose modules
module.exports = {
  entry: ['./src/main.tsx'],
  federation: {
    name: 'cart',
    exposes: {
      './CartWidget': './src/CartWidget.tsx',
    },
  },
};
```

```tsx
// In your host app
import CartWidget from 'cart/CartWidget';
```

---

## 🔌 Plugin System

```js
// nexxo.config.js
module.exports = {
  entry: ['./src/main.tsx'],
  plugins: [
    {
      name: 'my-plugin',

      // Intercept module loading
      load(id) {
        if (id.endsWith('.yaml')) {
          return { code: `export default {}` };
        }
      },

      // Transform module source
      transform(code, id) {
        return { code: code.replace('__VERSION__', '1.0.0') };
      },
    },
  ],
};
```

---

## 🛠️ CLI Commands

```bash
nexxo dev                                          # Start dev server with HMR
nexxo build                                        # Production build
nexxo bootstrap --name <n> --template <t>          # Scaffold new project
nexxo init                                         # Generate nexxo.config.js
nexxo ssr                                          # SSR server
nexxo inspect                                      # Inspect dependency graph
nexxo analyze                                      # Analyze bundle size
nexxo audit                                        # Accessibility, performance & SEO
nexxo verify                                       # Config health check
nexxo doctor                                       # Diagnose common issues
```

---

## 🎨 Templates

```bash
# TypeScript
nexxo bootstrap --name my-app --template react-ts
nexxo bootstrap --name my-app --template vue-ts
nexxo bootstrap --name my-app --template svelte-ts
nexxo bootstrap --name my-app --template solid-ts
nexxo bootstrap --name my-app --template preact-ts
nexxo bootstrap --name my-app --template lit-ts
nexxo bootstrap --name my-app --template vanilla-ts

# JavaScript
nexxo bootstrap --name my-app --template react-js
nexxo bootstrap --name my-app --template vue-js
nexxo bootstrap --name my-app --template svelte-js
nexxo bootstrap --name my-app --template alpine-js
nexxo bootstrap --name my-app --template vanilla-js
```

---

## 🎯 Framework Support

| Framework  | Status | HMR | TypeScript | Notes |
|------------|--------|-----|------------|-------|
| React      | ✅ Stable | ✅ Fast Refresh | ✅ | React 18 & 19 |
| Vue 3      | ✅ Stable | ✅ SFC Hot-Reload | ✅ | Composition API |
| Svelte     | ✅ Stable | ✅ Component | ✅ | Runes supported |
| SolidJS    | ✅ Stable | ✅ Signal-aware | ✅ | |
| Preact     | ✅ Stable | ✅ Fast Refresh | ✅ | React compat |
| Lit        | ✅ Verified | ✅ Web Component | ✅ | |
| Alpine.js  | ✅ Verified | ✅ Core Reload | ➖ | HTML-first |
| Qwik       | 🔶 Experimental | ✅ | ✅ | |
| Mithril.js | 🔵 Legacy | ✅ | ➖ | |
| Vanilla JS | ✅ Stable | ✅ | ✅ | |

---

## 🗺️ Source Maps

```js
module.exports = {
  build: {
    sourcemap: 'external',  // Separate .map files (recommended for production)
    // sourcemap: 'inline', // Embedded in bundle (best for debugging)
    // sourcemap: 'hidden', // Generated but not referenced (for error tracking tools)
    // sourcemap: false,    // Disabled
  },
};
```

---

## 🧪 Test Status

- **109 / 109** tests passing across 14 test suites
- Covers: cache correctness, module federation (6/6), CSS processing, error handling, load/stress, performance regression, build snapshots, property-based tests, real-world integration

---

## 📖 Documentation

Full documentation and framework guides are available on our website:

**[https://avinash-1994.github.io/Nexxo/](https://avinash-1994.github.io/Nexxo/)**

- [Getting Started](https://avinash-1994.github.io/Nexxo/#/docs/getting-started)
- [Framework Guides](https://avinash-1994.github.io/Nexxo/#/guides/react)
- [Module Federation](https://avinash-1994.github.io/Nexxo/#/mfe/overview)
- [Plugin Development](https://avinash-1994.github.io/Nexxo/#/plugins)
- [Changelog](./CHANGELOG.md)

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 📄 License

MIT © [Avinash-1994](https://github.com/Avinash-1994)

---

## 📞 Support

- 💬 [GitHub Discussions](https://github.com/Avinash-1994/Nexxo/discussions)
- 🐛 [Issues](https://github.com/Avinash-1994/Nexxo/issues)
- ⭐ [Star on GitHub](https://github.com/Avinash-1994/Nexxo)
