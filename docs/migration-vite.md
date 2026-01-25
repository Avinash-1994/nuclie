# Migrating from Vite to Nexxo

Nexxo is designed to be a drop-in 10x faster replacement for Vite.

## 1. Quick Switch
Run the auto-migration command:
```bash
npx nexxo migrate
```

## 2. Manual Migration

### Update scripts
Change your content in `package.json`:
```json
"scripts": {
  "dev": "nexxo dev",
  "build": "nexxo build"
}
```

### Reuse Vite Plugins
Nexxo supports Vite plugins natively via the compatibility adapter.

```ts
// nexxo.config.ts
import { defineConfig } from 'nexxo';
import { viteToNexxo } from 'nexxo';
import someVitePlugin from 'vite-plugin-cool';

export default defineConfig({
  plugins: [
    viteToNexxo(someVitePlugin())
  ]
});
```

## 3. Environment Variables
Nexxo respects `.env` files exactly like Vite. Use `import.meta.env` as usual.

## 4. Key Differences
| Feature | Vite | Nexxo |
|---------|------|-------|
| Startup | ~400ms | < 50ms |
| Build | esbuild/Rollup | Native Rust |
| HMR | Fast | Instant (Delta Cache) |
