# Getting Started with Nuclie

> Get from zero to a running app in **under 5 minutes**.

---

## Prerequisites

- **Node.js** ≥ 20 ([download](https://nodejs.org))
- **npm** ≥ 8 (bundled with Node.js)

---

## Step 1 — Install Nuclie

```bash
npm install -g nuclie
```

Verify the installation:

```bash
nuclie --version
# ⚡ nuclie v1.0.9
```

---

## Step 2 — Scaffold a New Project

Pick your framework:

```bash
# React + TypeScript (recommended)
nuclie bootstrap --name my-app --template react-ts

# Vue 3 + TypeScript
nuclie bootstrap --name my-app --template vue-ts

# Svelte + TypeScript
nuclie bootstrap --name my-app --template svelte-ts

# Vanilla TypeScript
nuclie bootstrap --name my-app --template vanilla-ts
```

This creates a `my-app/` directory with a working starter project.

---

## Step 3 — Start the Dev Server

```bash
cd my-app
nuclie dev
```

You should see:

```
⚡ Nuclie v1.0.9
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/

  ✔ Ready in 312ms
```

Open [http://localhost:3000](http://localhost:3000) in your browser. **HMR is active** — edit any file and changes appear instantly without a full reload.

---

## Step 4 — Production Build

```bash
nuclie build
```

Output goes to `./dist/`. The build is minified, tree-shaken, and ready to deploy.

---

## Step 5 — Preview the Production Build

```bash
nuclie preview
```

Serves the `dist/` folder locally so you can verify before deploying.

---

## Project Structure

After scaffolding, your project looks like this:

```
my-app/
├── src/
│   ├── main.tsx        ← Entry point
│   ├── App.tsx         ← Root component
│   └── index.css
├── index.html
├── nuclie.config.js    ← Nuclie configuration
└── package.json
```

---

## Minimal Configuration

The scaffolded `nuclie.config.js` works out of the box:

```js
// nuclie.config.js
module.exports = {
  entry: ['./src/main.tsx'],
  outDir: './dist',

  dev: {
    port: 3000,
    hmr: true,
  },

  build: {
    minify: true,
    sourcemap: 'external',
  },
};
```

> See the full [Configuration Reference](./guides/configuration.md) for all options.

---

## Adding to an Existing Project

If you already have a project, you can add Nuclie without scaffolding:

```bash
# Install locally
npm install --save-dev nuclie

# Generate a config file
npx nuclie init
```

Then update your `package.json` scripts:

```json
{
  "scripts": {
    "dev": "nuclie dev",
    "build": "nuclie build",
    "preview": "nuclie preview"
  }
}
```

---

## CLI Reference

```bash
nuclie dev                            # Start dev server with HMR
nuclie build                          # Production build
nuclie preview                        # Preview production build
nuclie bootstrap --name n --template t  # Scaffold new project
nuclie init                           # Generate nuclie.config.js
nuclie inspect                        # Inspect module graph
nuclie analyze                        # Analyze bundle size
nuclie doctor                         # Diagnose common issues
```

---

## Next Steps

- 📖 [Configuration Reference](./guides/configuration.md) — all config options with types and defaults
- 🔌 [Plugin Guide](./plugins.md) — extend Nuclie with plugins
- 📦 [Module Federation](./guides/federation.md) — micro-frontend architecture
- 🔥 [HMR Guide](./HMR_IMPLEMENTATION_STATUS.md) — how HMR works and how to debug it
- 🚚 [Migration Guide](./migration.md) — moving from Vite or Webpack
- ❓ [Troubleshooting](./TROUBLESHOOTING.md) — common errors and fixes
