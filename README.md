# ⚡ Nexxo

**Next-generation build tool powered by Rust and AI optimization**

[![npm version](https://img.shields.io/npm/v/nexxo.svg)](https://www.npmjs.com/package/nexxo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/workflow/status/Avinash-1994/nexxo/CI)](https://github.com/Avinash-1994/nexxo/actions)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](./PRODUCTION_AUDIT_REPORT.md)

Nexxo is a blazing-fast build tool that combines the best of Vite, Webpack, and esbuild with native Rust performance and built-in Module Federation support.

## ✨ Features

- ⚡ **Lightning Fast** - 69ms cold start, 10-60ms HMR updates
- 🦀 **Rust-Powered** - Native worker for 3-10x faster builds
- 🎯 **Zero Config** - Works out of the box with auto-detection
- 🔥 **Hot Module Replacement** - Framework-aware HMR for React, Vue, Svelte, and more
- 📦 **Module Federation** - Native micro-frontend support
- 🌐 **Universal** - Supports 10+ frameworks with version-agnostic transformers
- 🎨 **CSS Processing** - PostCSS, Tailwind, CSS Modules built-in
- 📊 **Build Analytics** - Detailed performance insights
- 🔒 **Secure** - Sandboxed plugin system with permissions
- 🚀 **Production Ready** - 11/11 test scores across 8 real-world projects

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

| Framework | Status | Auto-Detect | HMR |
|-----------|--------|-------------|-----|
| React | ✅ | ✅ | ✅ |
| Vue | ✅ | ✅ | ✅ |
| Svelte | ✅ | ✅ | ✅ |
| Angular | ✅ | ✅ | ✅ |
| Solid | ✅ | ✅ | ✅ |
| Preact | ✅ | ✅ | ✅ |
| Qwik | ✅ | ✅ | ✅ |
| Lit | ✅ | ✅ | ✅ |
| Astro | ✅ | ✅ | ✅ |
| Vanilla | ✅ | ✅ | ✅ |

## 📖 Documentation

- [Getting Started](./docs/getting-started/README.md)
- [Configuration Guide](./docs/guides/configuration.md)
- [Module Federation](./docs/guides/federation.md)
- [Plugin Development](./docs/guides/plugins.md)
- [API Reference](./docs/api/README.md)
- [Migration from Vite](./docs/migration/from-vite.md)

## 🎨 Templates

Choose from 10 production-ready templates:

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

## ⚙️ Configuration

Create a `nexxo.config.js`:

```javascript
module.exports = {
  entry: ['./src/index.tsx'],
  outDir: './dist',
  
  build: {
    minify: true,
    sourcemap: 'external',
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

## 📊 Performance

| Metric | Nexxo | Vite | Webpack |
|--------|-------|------|---------|
| Cold Start | 69ms | ~100ms | ~2s |
| HMR Update | 10-60ms | <100ms | ~500ms |
| Build Time | ~500ms | ~600ms | ~5s |
| Bundle Size | 6.9KB (br) | 7.2KB | 8.5KB |

*Benchmarks on TanStack Table project*

## 🧪 Test Results

**100% Pass Rate** across 8 real-world open-source projects:

- ✅ TanStack Table (11/11)
- ✅ React Query (11/11)
- ✅ VueUse (11/11)
- ✅ Nuxt Content (11/11)
- ✅ SvelteKit (11/11)
- ✅ Svelte Motion (11/11)
- ✅ Lit Project (11/11)
- ✅ Alpine.js (11/11)

See [Production Audit Report](./PRODUCTION_AUDIT_REPORT.md) for details.

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
      transform(code, id) {
        // Transform code
        return { code };
      },
    },
  ],
};
```

## 🌐 Ecosystem

- **@nexxo/plugin-react-refresh** - React Fast Refresh
- **@nexxo/plugin-vue** - Vue 3 support
- **@nexxo/plugin-svelte** - Svelte support
- **@nexxo/plugin-federation** - Module Federation
- **@nexxo/plugin-pwa** - Progressive Web App

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT © [Avinash-1994](https://github.com/Avinash-1994)

## 🙏 Acknowledgments

Built with inspiration from:
- [Vite](https://vitejs.dev/) - Fast dev server
- [esbuild](https://esbuild.github.io/) - Fast bundler
- [Webpack](https://webpack.js.org/) - Module Federation
- [Rollup](https://rollupjs.org/) - Plugin system

## 📞 Support

- 📖 [Documentation](https://nexxo.dev/docs)
- 💬 [GitHub Discussions](https://github.com/Avinash-1994/nexxo/discussions)
- 🐛 [Report Issues](https://github.com/Avinash-1994/nexxo/issues)
- 🌟 [Star on GitHub](https://github.com/Avinash-1994/nexxo)
- 🐦 [Follow on Twitter](https://twitter.com/nexxo_dev)

---

**Made with ❤️ by the Nexxo team**
