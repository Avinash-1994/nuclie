# Getting Started with Urja

Welcome to Urja! This guide will help you get up and running in minutes.

## Quick Start

### Installation

```bash
# Using npm
npm install -g urja

# Using yarn
yarn global add urja

# Using pnpm
pnpm add -g urja
```

### Create a New Project

```bash
# Create a new project from template
npx create-urja my-app

# Choose from available templates
npx create-urja my-app --template react-spa
```

### Available Templates

- `react-spa` - React Single Page Application
- `react-ssr` - React with Server-Side Rendering
- `vue-spa` - Vue 3 Single Page Application
- `svelte-spa` - Svelte Application
- `solid-spa` - Solid.js Application
- `preact-spa` - Preact Lightweight SPA
- `angular-spa` - Angular Application
- `monorepo` - Multi-package Workspace
- `edge` - Edge Runtime Optimized
- `fintech` - Enterprise Fintech Template

## Your First Build

### 1. Navigate to your project

```bash
cd my-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
urja dev
```

Your app will be running at `http://localhost:3000` with Hot Module Replacement enabled!

### 4. Build for production

```bash
urja build
```

Your optimized build will be in the `dist/` folder.

## Project Structure

```
my-app/
├── src/
│   ├── index.tsx        # Entry point
│   ├── App.tsx          # Main component
│   └── ...
├── public/              # Static assets
├── urja.config.js      # Urja configuration
├── package.json
└── tsconfig.json
```

## Configuration

Create a `urja.config.js` in your project root:

```javascript
module.exports = {
  root: '.',
  entry: ['./src/index.tsx'],
  outDir: './dist',
  framework: 'react', // auto-detected if not specified
  
  build: {
    minify: true,
    sourcemap: 'external',
    cssModules: false,
    splitting: true,
  },
  
  dev: {
    port: 3000,
    hmr: true,
    open: true,
  },
  
  plugins: [],
};
```

## Next Steps

- [Configuration Guide](../guides/configuration.md)
- [Framework Support](../guides/frameworks.md)
- [Plugin System](../guides/plugins.md)
- [Module Federation](../guides/federation.md)
- [API Reference](../api/README.md)

## Need Help?

- 📖 [Documentation](https://urja.dev/docs)
- 💬 [GitHub Discussions](https://github.com/Avinash-1994/urja/discussions)
- 🐛 [Report Issues](https://github.com/Avinash-1994/urja/issues)
- 🌟 [Star on GitHub](https://github.com/Avinash-1994/urja)
