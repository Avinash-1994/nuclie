# Migrating from Vite to Urja

Urja is designed to be a drop-in 10x faster replacement for Vite.

## 1. Quick Switch
Run the auto-migration command:
```bash
npx urja migrate
```

## 2. Manual Migration

### Update scripts
Change your content in `package.json`:
```json
"scripts": {
  "dev": "urja dev",
  "build": "urja build"
}
```

### Reuse Vite Plugins
Urja supports Vite plugins natively via the compatibility adapter.

```ts
// urja.config.ts
import { defineConfig } from 'urja';
import { viteToUrja } from 'urja';
import someVitePlugin from 'vite-plugin-cool';

export default defineConfig({
  plugins: [
    viteToUrja(someVitePlugin())
  ]
});
```

## 3. Environment Variables
Urja respects `.env` files exactly like Vite. Use `import.meta.env` as usual.

## 4. Key Differences
| Feature | Vite | Urja |
|---------|------|-------|
| Startup | ~400ms | < 50ms |
| Build | esbuild/Rollup | Native Rust |
| HMR | Fast | Instant (Delta Cache) |
