# ⚡ Nexxo — Modern Build Tool

[![npm version](https://img.shields.io/npm/v/nexxo.svg)](https://www.npmjs.com/package/nexxo)
[![CI](https://github.com/Avinash-1994/Nexxo/actions/workflows/ci.yml/badge.svg)](https://github.com/Avinash-1994/Nexxo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-106%2F106-brightgreen)](./PRODUCTION_AUDIT_REPORT.md)
[![Node >=20](https://img.shields.io/badge/node-%3E%3D20-blue)](https://nodejs.org)

Nexxo is a build tool with built-in HMR, source maps, tree shaking, module federation, and support for multiple JavaScript frameworks.

---

## ✨ Features

- ⚡ **Fast Builds** — Parallel build pipeline with smart caching
- 🔥 **Hot Module Replacement** — Framework-aware HMR
- 🗺️ **Source Maps** — `inline`, `external`, and `hidden` modes
- 🌳 **Tree Shaking** — AST-based dead code elimination in production
- 📦 **Module Federation** — Micro-frontend support built in
- 🎨 **CSS Processing** — PostCSS, CSS Modules, and Tailwind CSS
- 🔌 **Plugin System** — Extensible with `load` and `transform` hooks
- 💾 **Smart Caching** — Fingerprint-based incremental builds
- 🌐 **Multi-Framework** — React, Vue, Svelte, Solid, Preact, and more

---

## 🚀 Quick Start

```bash
# Install globally
npm install -g nexxo

# Start a new project from a template
nexxo bootstrap --name my-app --template react-ts

# Enter the project and start dev server
cd my-app
nexxo dev

# Build for production
nexxo build
```

---

## 📦 Installation

```bash
npm install -g nexxo
```

**Requirements:** Node.js ≥ 20

---

## 🎯 Framework Support

| Framework  | Auto-Detect | HMR | TypeScript |
|------------|-------------|-----|------------|
| React      | ✅ | ✅ | ✅ |
| Vue 3      | ✅ | ✅ | ✅ |
| Svelte     | ✅ | ✅ | ✅ |
| Solid      | ✅ | ✅ | ✅ |
| Preact     | ✅ | ✅ | ✅ |
| Qwik       | ✅ | ✅ | ✅ |
| Lit        | ✅ | ✅ | ✅ |
| Alpine.js  | ✅ | ✅ | ✅ |
| Mithril    | ✅ | ✅ | ✅ |
| Vanilla JS | ✅ | ✅ | ✅ |

---

## ⚙️ Configuration

Create `nexxo.config.js` in your project root:

```javascript
module.exports = {
  entry: ['./src/main.tsx'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external', // 'inline' | 'external' | 'hidden' | false
    cssModules: true,
  },

  dev: {
    port: 3000,
    hmr: true,
  },
};
```

---

## 📦 Module Federation

```javascript
// Host app — consume remotes
module.exports = {
  federation: {
    name: 'host',
    remotes: {
      cart: 'http://localhost:3001/remoteEntry.js',
    },
  },
};

// Remote app — expose modules
module.exports = {
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

## 🗺️ Source Maps

```javascript
module.exports = {
  build: {
    sourcemap: 'external',  // Separate .map files
    // sourcemap: 'inline', // Embedded in the bundle
    // sourcemap: 'hidden', // Generated but not referenced
    // sourcemap: false,    // Disabled
  },
};
```

---

## 🔌 Plugin System

```javascript
module.exports = {
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
nexxo dev                        # Start dev server with HMR
nexxo build                      # Production build
nexxo ssr                        # SSR server (Next.js / Nuxt / Remix)
nexxo bootstrap --name <n> --template <t>  # Scaffold a new project
nexxo init                       # Generate nexxo.config.js
nexxo inspect                    # Inspect dependency graph
nexxo analyze                    # Analyze bundle size
nexxo audit                      # Accessibility, performance & SEO audit
nexxo verify                     # Health check for your project config
nexxo doctor                     # Diagnose common issues
nexxo test                       # Run tests with the built-in runner
nexxo css purge                  # Remove unused CSS
```

---

## 🎨 Templates

```bash
# JavaScript
nexxo bootstrap --name my-app --template react-js
nexxo bootstrap --name my-app --template vue-js
nexxo bootstrap --name my-app --template svelte-js
nexxo bootstrap --name my-app --template solid-js
nexxo bootstrap --name my-app --template preact-js
nexxo bootstrap --name my-app --template qwik-js
nexxo bootstrap --name my-app --template lit-js
nexxo bootstrap --name my-app --template alpine-js
nexxo bootstrap --name my-app --template vanilla-js

# TypeScript variants
nexxo bootstrap --name my-app --template react-ts
nexxo bootstrap --name my-app --template vue-ts
nexxo bootstrap --name my-app --template svelte-ts
# ... and more
```

---

## 🧪 Test Status

- **106 / 106** tests passing across 13 test suites
- Covers: cache correctness, module federation (6/6), CSS processing, error handling, load/stress, performance regression, build snapshots, real-world integration

---

## 📖 Documentation

- [Getting Started](./docs/getting-started.md)
- [Configuration Guide](./docs/guides/configuration.md)
- [Module Federation](./docs/guides/federation.md)
- [Plugin Development](./docs/guides/plugins.md)
- [API Reference](./docs/api/README.md)
- [Changelog](./CHANGELOG.md)

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT © [Avinash-1994](https://github.com/Avinash-1994)

---

## 📞 Support

- 💬 [GitHub Discussions](https://github.com/Avinash-1994/Nexxo/discussions)
- 🐛 [Issues](https://github.com/Avinash-1994/Nexxo/issues)
- ⭐ [Star on GitHub](https://github.com/Avinash-1994/Nexxo)
