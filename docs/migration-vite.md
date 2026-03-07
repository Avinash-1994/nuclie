# Migrating from Vite to Nuclie

Nuclie is designed to be a drop-in 10x faster replacement for Vite.

## 1. Quick Switch
Run the auto-migration command:
```bash
npx nuclie migrate
```

## 2. Manual Migration

### Update scripts
Change your content in `package.json`:
```json
"scripts": {
  "dev": "nuclie dev",
  "build": "nuclie build"
}
```

### Reuse Vite Plugins
Nuclie supports Vite plugins natively via the compatibility adapter.

```ts
// nuclie.config.ts
import { defineConfig } from 'nuclie';
import { viteToNuclie } from 'nuclie';
import someVitePlugin from 'vite-plugin-cool';

export default defineConfig({
  plugins: [
    viteToNuclie(someVitePlugin())
  ]
});
```

## 3. Environment Variables
Nuclie respects `.env` files exactly like Vite. Use `import.meta.env` as usual.

## 4. Key Differences
| Feature | Vite | Nuclie |
|---------|------|-------|
| Startup | ~400ms | < 50ms |
| Build | esbuild/Rollup | Native Rust |
| HMR | Fast | Instant (Delta Cache) |
