# Migrating from Vite to Sparx

Sparx is designed to be a fast replacement for Vite.

## 1. Quick Switch
Run the auto-migration command:
```bash
npx sparx migrate
```

## 2. Manual Migration

### Update scripts
Change your content in `package.json`:
```json
"scripts": {
  "dev": "sparx dev",
  "build": "sparx build"
}
```

### Reuse Vite Plugins
Sparx can reuse many Vite-compatible plugins through compatibility adapters.

```ts
// sparx.config.ts
import { defineConfig } from 'sparx';
import { rollupAdapter } from '@sparx/plugin-compat';
import someVitePlugin from 'vite-plugin-cool';

export default defineConfig({
  plugins: [
    rollupAdapter(someVitePlugin())
  ]
});
```

## 3. Environment Variables
Sparx respects `.env` files exactly like Vite. Use `import.meta.env` as usual.

## 4. Key Differences
| Feature | Vite | Sparx |
|---------|------|-------|
| Startup | ~400ms | < 50ms |
| Build | esbuild/Rollup | Native Rust |
| HMR | Fast | Instant (Delta Cache) |
