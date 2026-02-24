# ⚡ Nexxo - Modern Build Tool

**Fast, feature-rich build tool with native performance**

[![npm version](https://img.shields.io/npm/v/nexxo.svg)](https://www.npmjs.com/package/nexxo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/badge/tests-106%2F106-brightgreen)](./PRODUCTION_AUDIT_REPORT.md)

Nexxo is a modern build tool designed for speed and developer experience, featuring built-in HMR, source maps, tree shaking, and module federation.

## ✨ Features

- ⚡ **Fast Builds** - Optimized build pipeline with parallel execution
- 🔥 **Hot Module Replacement** - Framework-aware HMR for instant updates
- 🗺️ **Source Maps** - Full source map support (inline, external, hidden)
- 🌳 **Tree Shaking** - Automatic dead code elimination in production
- 📦 **Module Federation** - Built-in micro-frontend support
- 🎯 **Zero Config** - Works out of the box with smart defaults
- 🌐 **Multi-Framework** - Supports React, Vue, Svelte, Solid, and more
- 🎨 **CSS Processing** - PostCSS, Tailwind, and CSS Modules built-in
- 📊 **Build Analytics** - Detailed performance insights
- 🔌 **Plugin System** - Extensible with custom plugins
- 💾 **Smart Caching** - Fingerprint-based incremental builds

## 🚀 Quick Start

```bash
# Create a new project
npx create-nexxo my-app

# Or use a specific template
npx create-nexxo my-app --template react-spa

# Start development
cd my-app
nexxo dev

# Build for production
nexxo build
```

## 📦 Installation

```bash
# Global installation
npm install -g nexxo

# Or use directly with npx
npx nexxo dev
```

## 🎯 Supported Frameworks

| Framework | Auto-Detect | HMR | TypeScript |
|-----------|-------------|-----|------------|
| React | ✅ | ✅ | ✅ |
| Vue | ✅ | ✅ | ✅ |
| Svelte | ✅ | ✅ | ✅ |
| Solid | ✅ | ✅ | ✅ |
| Preact | ✅ | ✅ | ✅ |
| Angular | ✅ | ✅ | ✅ |
| Qwik | ✅ | ✅ | ✅ |
| Lit | ✅ | ✅ | ✅ |
| Astro | ✅ | ✅ | ✅ |
| Vanilla JS | ✅ | ✅ | ✅ |

## ⚙️ Configuration

Create a `nexxo.config.js`:

```javascript
module.exports = {
  entry: ['./src/index.tsx'],
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
  
  federation: {
    name: 'my_app',
    exposes: {
      './App': './src/App.tsx',
    },
  },
};
```

## 🔥 Module Federation

Build micro-frontends with native support:

```javascript
// Host app
federation: {
  name: 'host',
  remotes: {
    'cart': 'http://localhost:3001/remoteEntry.js',
  },
}

// Remote app
federation: {
  name: 'cart',
  exposes: {
    './CartWidget': './src/CartWidget.tsx',
  },
}
```

```tsx
// Use remote module
import CartWidget from 'cart/CartWidget';

function App() {
  return <CartWidget />;
}
```

## 🗺️ Source Maps

Full source map support for debugging:

```javascript
module.exports = {
  build: {
    sourcemap: 'external',  // Separate .map files
    // sourcemap: 'inline',  // Inline in bundle
    // sourcemap: 'hidden',  // Generate but don't reference
    // sourcemap: false,     // Disable
  },
};
```

## 🌳 Tree Shaking

Automatic dead code elimination in production builds:

- AST-based analysis
- Removes unused exports
- Optimizes bundle size
- Works with ES modules

## 📊 Performance

Nexxo is optimized for speed:

- **Cold Start**: ~69ms
- **HMR Updates**: 10-60ms
- **Build Time**: Optimized with caching
- **Bundle Size**: Minimal runtime overhead

*Benchmarks from real-world projects. See [Production Audit Report](./PRODUCTION_AUDIT_REPORT.md)*

## 🧪 Production Ready

**100% Test Pass Rate** (106/106 tests passing)

Verified across 8 real-world open-source projects:
- ✅ TanStack Table
- ✅ React Query
- ✅ VueUse
- ✅ Nuxt Content
- ✅ SvelteKit
- ✅ Svelte Motion
- ✅ Lit Project
- ✅ Alpine.js

See [Production Audit Report](./PRODUCTION_AUDIT_REPORT.md) for details.

## 🎨 Templates

Choose from production-ready templates:

- `react-spa` - React Single Page Application
- `react-ssr` - React with Server-Side Rendering
- `vue-spa` - Vue 3 Application
- `svelte-spa` - Svelte Application
- `solid-spa` - Solid.js Application
- `preact-spa` - Preact Lightweight SPA
- `angular-spa` - Angular Application
- `monorepo` - Multi-package Workspace
- `edge` - Edge Runtime Optimized
- `fintech` - Enterprise Fintech Template

## 🛠️ CLI Commands

```bash
nexxo dev          # Start development server
nexxo build        # Build for production
nexxo ssr          # Start SSR server
nexxo analyze      # Analyze bundle
nexxo init         # Initialize config
nexxo bootstrap    # Create from template
nexxo inspect      # Inspect dependency graph
nexxo audit        # Run audits (A11y, Perf, SEO)
nexxo doctor       # Health diagnostics
```

## 🔌 Plugin System

Create custom plugins:

```javascript
module.exports = {
  plugins: [
    {
      name: 'my-plugin',
      load(id) {
        // Custom module loading
      },
      transform(code, id) {
        // Transform code
        return { code };
      },
    },
  ],
};
```

## 📖 Documentation

- [Getting Started](./docs/getting-started.md)
- [Configuration Guide](./docs/guides/configuration.md)
- [Module Federation](./docs/guides/federation.md)
- [Plugin Development](./docs/guides/plugins.md)
- [API Reference](./docs/api/README.md)
- [Testing Strategy](./TESTING_STRATEGY.md)

## 🌐 Ecosystem

- **@nexxo/plugin-react-refresh** - React Fast Refresh
- **@nexxo/plugin-vue** - Vue 3 support
- **@nexxo/plugin-svelte** - Svelte support
- **@nexxo/plugin-federation** - Module Federation
- **@nexxo/plugin-pwa** - Progressive Web App

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT © [Avinash-1994](https://github.com/Avinash-1994)

## 📞 Support

- 📖 [Documentation](./docs/index.md)
- 💬 [GitHub Discussions](https://github.com/Avinash-1994/nexxo/discussions)
- 🐛 [Report Issues](https://github.com/Avinash-1994/nexxo/issues)
- 🌟 [Star on GitHub](https://github.com/Avinash-1994/nexxo)

---

**Made with ❤️ by the Nexxo team**
