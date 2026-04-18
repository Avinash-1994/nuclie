# ⚡ Sparx — Modern Build Tool

[![npm version](https://img.shields.io/npm/v/sparx.svg)](https://www.npmjs.com/package/sparx)
[![CI](https://github.com/Avinash-1994/Sparx/actions/workflows/ci.yml/badge.svg)](https://github.com/Avinash-1994/Sparx/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-109%2F109-brightgreen)](#test-status)
[![Node >=20](https://img.shields.io/badge/node-%3E%3D20-blue)](https://nodejs.org)

Sparx is a modern JavaScript build tool powered by SWC (Rust) and LightningCSS. It delivers fast HMR, native module federation for micro-frontends, automatic tree shaking, and deep multi-framework support (React, Vue, Svelte, Solid, Preact, Qwik, Lit, Alpine, Vanilla JS) — a modern alternative with a Rust-native core.

---

## ✨ Features

- ⚡ **Fast Builds** — Parallel pipeline with Rust-native transforms (SWC)
- 🔥 **Zero-Config Bootstrapping** — Dynamic template injection pulling real-time latest framework dependencies gracefully.
- 🗺️ **MFE Workspace Orchestrator** — Boot an entire host proxy and array of remotes natively through a single unified process.
- 🕊️ **Ultra-lightweight Core** — Aggressively optimized npm package size completely dropping boilerplate footprint (< 1.5MB unpacked).
- 📦 **Module Federation** — Micro-frontend support built directly into the runtime.
- 🎨 **CSS Processing** — PostCSS, CSS Modules, and Tailwind CSS via fast Rust LightningCSS.
- 🔌 **Plugin System** — Extensible `load` and `transform` hooks globally.
- 💾 **Smart Caching** — Fingerprint-based RocksDB incremental builds.
- 🌐 **Multi-Framework HMR** — State-preserving Hot-Module Replacement for React, Vue, Svelte, Solid, Preact, Lit, Alpine, and Qwik!

---

## 🚀 Quick Start

```bash
# Install globally
npm install -g sparx

# Scaffold a new project
sparx bootstrap --name my-app --template react-ts

# Start dev server
cd my-app
sparx dev

# Production build
sparx build
```

---

## 📦 Installation

```bash
npm install -g sparx
```

**Requirements:** Node.js ≥ 20

---

## 🎯 Framework Configuration

Every framework gets an identical config shape — only the `entry` file changes. Here is the **complete config reference** for each supported framework:

### ⚛️ React

```bash
sparx bootstrap --name my-app --template react-ts
```

```js
// sparx.config.js
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
sparx bootstrap --name my-app --template vue-ts
```

```js
// sparx.config.js
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
sparx bootstrap --name my-app --template svelte-ts
```

```js
// sparx.config.js
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
sparx bootstrap --name my-app --template solid-ts
```

```js
// sparx.config.js
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
sparx bootstrap --name my-app --template preact-ts
```

```js
// sparx.config.js
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
sparx bootstrap --name my-app --template lit-ts
```

```js
// sparx.config.js
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
sparx bootstrap --name my-app --template alpine-js
```

```js
// sparx.config.js
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
sparx bootstrap --name my-app --template vanilla-js
# or
sparx bootstrap --name my-app --template vanilla-ts
```

```js
// sparx.config.js
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
// sparx.config.js — all options
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
// sparx.config.js
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
sparx dev                                          # Start dev server with HMR
sparx build                                        # Production build
sparx bootstrap --name <n> --template <t>          # Scaffold new project
sparx init                                         # Generate sparx.config.js
sparx ssr                                          # SSR server
sparx inspect                                      # Inspect dependency graph
sparx analyze                                      # Analyze bundle size
sparx audit                                        # Accessibility, performance & SEO
sparx verify                                       # Config health check
sparx doctor                                       # Diagnose common issues
```

---

## 🎨 Templates

```bash
# TypeScript
sparx bootstrap --name my-app --template react-ts
sparx bootstrap --name my-app --template vue-ts
sparx bootstrap --name my-app --template svelte-ts
sparx bootstrap --name my-app --template solid-ts
sparx bootstrap --name my-app --template preact-ts
sparx bootstrap --name my-app --template lit-ts
sparx bootstrap --name my-app --template mithril-ts
sparx bootstrap --name my-app --template alpine-ts
sparx bootstrap --name my-app --template vanilla-ts

# JavaScript
sparx bootstrap --name my-app --template react
sparx bootstrap --name my-app --template vue
sparx bootstrap --name my-app --template svelte
sparx bootstrap --name my-app --template solid
sparx bootstrap --name my-app --template preact
sparx bootstrap --name my-app --template lit
sparx bootstrap --name my-app --template qwik
sparx bootstrap --name my-app --template mithril
sparx bootstrap --name my-app --template alpine
sparx bootstrap --name my-app --template vanilla
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
| Alpine.js  | ✅ Verified | ✅ Core Reload | ✅ | HTML-first |
| Qwik       | 🔶 Experimental | ✅ | ✅ | |
| Mithril.js | ✅ Stable | ✅ | ✅ | |
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

Project documentation and guides are maintained in the repository:

- [docs/](./docs)
- [CHANGELOG.md](./CHANGELOG.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 📄 License

MIT © [Avinash-1994](https://github.com/Avinash-1994)

---

## 📞 Support

- 💬 [GitHub Discussions](https://github.com/Avinash-1994/Sparx/discussions)
- 🐛 [Issues](https://github.com/Avinash-1994/Sparx/issues)
- ⭐ [Star on GitHub](https://github.com/Avinash-1994/Sparx)
