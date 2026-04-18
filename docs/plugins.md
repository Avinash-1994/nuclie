# Sparx Plugins Guide

> **Plugin ecosystem with sandboxing support and WebCrypto signing support.**

---

## Quick Start

```bash
# Search for plugins
sparx plugin search react

# Install a plugin
sparx plugin install @sparx/plugin-react

# List installed plugins
sparx plugin list

# Verify plugin signatures
sparx plugin verify @sparx/plugin-react
```

---

## Using Plugins

### In `sparx.config.ts`

```typescript
import { defineConfig } from 'sparx';
import react from '@sparx/plugin-react';
import tailwind from '@sparx/plugin-tailwind';
import pwa from '@sparx/plugin-pwa';

export default defineConfig({
  preset: 'spa',
  
  plugins: [
    react({
      fastRefresh: true,
      babel: {
        plugins: ['babel-plugin-styled-components']
      }
    }),
    
    tailwind({
      config: './tailwind.config.js'
    }),
    
    pwa({
      manifest: {
        name: 'My App',
        short_name: 'App',
        theme_color: '#000000'
      }
    })
  ]
});
```

---

## Plugin Categories

### Framework Plugins

| Plugin | Description | Install |
|--------|-------------|---------|
| `@sparx/plugin-react` | React Fast Refresh + JSX | `sparx plugin install @sparx/plugin-react` |
| `@sparx/plugin-vue` | Vue 3 SFC support | `sparx plugin install @sparx/plugin-vue` |
| `@sparx/plugin-svelte` | Svelte compiler | `sparx plugin install @sparx/plugin-svelte` |
| `@sparx/plugin-solid` | Solid.js JSX | `sparx plugin install @sparx/plugin-solid` |
| `@sparx/plugin-angular` | Angular AOT compiler | `sparx plugin install @sparx/plugin-angular` |
| `@sparx/plugin-preact` | Preact with Fast Refresh | `sparx plugin install @sparx/plugin-preact` |

### CSS & Styling

| Plugin | Description | Install |
|--------|-------------|---------|
| `@sparx/plugin-tailwind` | Tailwind CSS v3+ | `sparx plugin install @sparx/plugin-tailwind` |
| `@sparx/plugin-sass` | Sass/SCSS compiler | `sparx plugin install @sparx/plugin-sass` |
| `@sparx/plugin-less` | Less compiler | `sparx plugin install @sparx/plugin-less` |
| `@sparx/plugin-postcss` | PostCSS processor | `sparx plugin install @sparx/plugin-postcss` |
| `@sparx/plugin-styled-components` | CSS-in-JS support | `sparx plugin install @sparx/plugin-styled-components` |
| `@sparx/plugin-emotion` | Emotion CSS-in-JS | `sparx plugin install @sparx/plugin-emotion` |

### Assets & Media

| Plugin | Description | Install |
|--------|-------------|---------|
| `@sparx/plugin-svgr` | SVG to React components | `sparx plugin install @sparx/plugin-svgr` |
| `@sparx/plugin-image-optimizer` | Image compression | `sparx plugin install @sparx/plugin-image-optimizer` |
| `@sparx/plugin-webp` | WebP conversion | `sparx plugin install @sparx/plugin-webp` |
| `@sparx/plugin-fonts` | Font optimization | `sparx plugin install @sparx/plugin-fonts` |

### Performance

| Plugin | Description | Install |
|--------|-------------|---------|
| `@sparx/plugin-compression` | Gzip/Brotli compression | `sparx plugin install @sparx/plugin-compression` |
| `@sparx/plugin-preload` | Resource preloading | `sparx plugin install @sparx/plugin-preload` |
| `@sparx/plugin-lazy-load` | Code splitting helpers | `sparx plugin install @sparx/plugin-lazy-load` |
| `@sparx/plugin-bundle-analyzer` | Bundle size analysis | `sparx plugin install @sparx/plugin-bundle-analyzer` |

### Security

| Plugin | Description | Install |
|--------|-------------|---------|
| `@sparx/plugin-csp` | Content Security Policy | `sparx plugin install @sparx/plugin-csp` |
| `@sparx/plugin-sri` | Subresource Integrity | `sparx plugin install @sparx/plugin-sri` |
| `@sparx/plugin-security-headers` | HTTP security headers | `sparx plugin install @sparx/plugin-security-headers` |

### Testing

| Plugin | Description | Install |
|--------|-------------|---------|
| `@sparx/plugin-vitest` | Vitest integration | `sparx plugin install @sparx/plugin-vitest` |
| `@sparx/plugin-jest` | Jest integration | `sparx plugin install @sparx/plugin-jest` |
| `@sparx/plugin-playwright` | E2E testing | `sparx plugin install @sparx/plugin-playwright` |

### i18n

| Plugin | Description | Install |
|--------|-------------|---------|
| `@sparx/plugin-i18next` | i18next integration | `sparx plugin install @sparx/plugin-i18next` |
| `@sparx/plugin-react-intl` | React Intl | `sparx plugin install @sparx/plugin-react-intl` |
| `@sparx/plugin-vue-i18n` | Vue I18n | `sparx plugin install @sparx/plugin-vue-i18n` |

### State Management

| Plugin | Description | Install |
|--------|-------------|---------|
| `@sparx/plugin-redux` | Redux DevTools | `sparx plugin install @sparx/plugin-redux` |
| `@sparx/plugin-zustand` | Zustand integration | `sparx plugin install @sparx/plugin-zustand` |
| `@sparx/plugin-jotai` | Jotai atoms | `sparx plugin install @sparx/plugin-jotai` |

### Deployment

| Plugin | Description | Install |
|--------|-------------|---------|
| `@sparx/plugin-vercel` | Vercel deployment | `sparx plugin install @sparx/plugin-vercel` |
| `@sparx/plugin-netlify` | Netlify deployment | `sparx plugin install @sparx/plugin-netlify` |
| `@sparx/plugin-cloudflare` | Cloudflare Workers | `sparx plugin install @sparx/plugin-cloudflare` |
| `@sparx/plugin-docker` | Docker containerization | `sparx plugin install @sparx/plugin-docker` |

### Analytics

| Plugin | Description | Install |
|--------|-------------|---------|
| `@sparx/plugin-google-analytics` | GA4 integration | `sparx plugin install @sparx/plugin-google-analytics` |
| `@sparx/plugin-plausible` | Plausible Analytics | `sparx plugin install @sparx/plugin-plausible` |
| `@sparx/plugin-sentry` | Error tracking | `sparx plugin install @sparx/plugin-sentry` |

---

## Plugin Security

### Plugin Security Model

Sparx currently executes plugins in an isolated VM-based runtime with strict permission controls. A secure WASM runtime for plugin execution is planned, but the current model is based on runtime isolation and API safety checks.

Plugins are subject to explicit permissions:
- Filesystem access is denied by default and only granted for approved paths.
- Environment variables are only available when the plugin is loaded with an explicit env allowlist.
- `require()` is whitelisted to a small set of safe built-ins (`fs`, `path`) and all other module imports are blocked.
- Network access is blocked by default because no network globals are exposed in the sandbox (`fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource` are removed).

```typescript
// Plugins SHOULD NOT:
❌ Access filesystem directly without permission
❌ Make network requests
❌ Execute arbitrary code
❌ Access environment variables unless explicitly allowed

// Plugins CAN:
✅ Transform code
✅ Generate assets
✅ Emit warnings/errors
✅ Use approved APIs
```
### Signature Verification

Every plugin is **cryptographically signed**:

```bash
# Verify plugin signature
sparx plugin verify @sparx/plugin-react

# Output:
✅ Signature valid
✅ Publisher: Sparx Team
✅ Published: 2026-01-15
✅ SHA-256: a3f2...
```

### Plugin Manifest

```json
{
  "name": "@sparx/plugin-react",
  "version": "2.0.0",
  "author": "Sparx Team",
  "signature": "...",
  "permissions": [
    "transform:jsx",
    "emit:assets"
  ],
  "sandbox": "isolated",
  "verified": true
}
```

---

## Writing Custom Plugins

### Basic Plugin Structure

```typescript
// my-plugin.ts
import { SparxPlugin } from 'sparx';

export default function myPlugin(options = {}): SparxPlugin {
  return {
    name: 'my-plugin',
    version: '1.0.0',
    
    // Transform hook
    transform(code, id) {
      if (id.endsWith('.custom')) {
        return {
          code: transformCode(code),
          map: generateSourceMap()
        };
      }
    },
    
    // Build start hook
    buildStart() {
      console.log('Build starting...');
    },
    
    // Build end hook
    buildEnd() {
      console.log('Build complete!');
    }
  };
}
```

### Plugin Hooks

```typescript
export interface SparxPlugin {
  name: string;
  version: string;
  
  // Lifecycle hooks
  buildStart?(): void;
  buildEnd?(): void;
  
  // Transform hooks
  transform?(code: string, id: string): TransformResult;
  load?(id: string): string | null;
  resolveId?(source: string, importer: string): string | null;
  
  // Asset hooks
  generateBundle?(bundle: Bundle): void;
  writeBundle?(bundle: Bundle): void;
  
  // Dev server hooks
  configureServer?(server: DevServer): void;
  handleHotUpdate?(ctx: HmrContext): void;
}
```

### Example: Custom Markdown Plugin

```typescript
import { SparxPlugin } from 'sparx';
import { marked } from 'marked';

export default function markdownPlugin(): SparxPlugin {
  return {
    name: 'sparx-plugin-markdown',
    version: '1.0.0',
    
    transform(code, id) {
      if (!id.endsWith('.md')) return null;
      
      const html = marked(code);
      
      return {
        code: `export default ${JSON.stringify(html)}`,
        map: null
      };
    }
  };
}
```

**Usage**:
```typescript
// sparx.config.ts
import markdown from './my-plugin';

export default defineConfig({
  plugins: [markdown()]
});
```

```typescript
// app.tsx
import content from './README.md';

function App() {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
```

---

## Plugin Compatibility

### Vite Plugin Adapter

```typescript
import { defineConfig } from 'sparx';
import { rollupAdapter } from '@sparx/plugin-compat';
import viteReactSvgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    // Wrap Vite plugin
    rollupAdapter(viteReactSvgr())
  ]
});
```

**Compatibility**: Experimental and plugin-dependent; many Vite plugins can work with adapter

### Webpack Loader Adapter

```typescript
import { webpackLoaderAdapter } from '@sparx/plugin-compat';

export default defineConfig({
  plugins: [
    webpackLoaderAdapter({
      test: /\.custom$/,
      loader: 'custom-loader',
      options: {}
    })
  ]
});
```

**Compatibility**: Experimental and plugin-dependent; many Webpack loaders can work with adapter

---

## Plugin Marketplace

### Browse Plugins

```bash
# List all plugins
sparx plugin list --all

# Search by category
sparx plugin search --category framework

# Filter by verified
sparx plugin search --verified
```

### Plugin Ratings

```bash
# View plugin details
sparx plugin info @sparx/plugin-react

# Output:
📦 @sparx/plugin-react v2.0.0
⭐ 4.8/5.0 (1,234 reviews)
📥 50,000 downloads/week
✅ Verified by Sparx Team
🔒 Secure isolated plugin runtime
📝 React Fast Refresh + JSX transform
```

---

## Troubleshooting

### Plugin Not Loading

**Issue**: Plugin installed but not working

**Solution**:
```typescript
// Check plugin is in config
export default defineConfig({
  plugins: [
    myPlugin() // ← Make sure it's called as function
  ]
});
```

### Signature Verification Failed

**Issue**: `⚠️ Signature verification failed`

**Solution**:
```bash
# Re-install plugin
npm uninstall @sparx/plugin-name
sparx plugin install @sparx/plugin-name

# Or skip verification (not recommended)
sparx plugin install @sparx/plugin-name --skip-verify
```

### Plugin Conflicts

**Issue**: Two plugins transforming same files

**Solution**: Use `enforce` option
```typescript
export default defineConfig({
  plugins: [
    pluginA({ enforce: 'pre' }),  // Runs first
    pluginB({ enforce: 'post' })  // Runs last
  ]
});
```

---

## Best Practices

### 1. Use Official Plugins First

✅ **Good**:
```typescript
import react from '@sparx/plugin-react';
```

⚠️ **Avoid** (unless necessary):
```typescript
import react from 'some-unofficial-plugin';
```

### 2. Verify Plugin Signatures

```bash
# Always verify before using
sparx plugin verify @sparx/plugin-name
```

### 3. Minimal Plugin Configuration

✅ **Good**:
```typescript
plugins: [
  react() // Use defaults
]
```

⚠️ **Avoid**:
```typescript
plugins: [
  react({
    // Too many custom options = harder to maintain
  })
]
```

### 4. Check Plugin Performance

```bash
# Profile plugin impact
sparx build --profile

# Output shows plugin timings
```

---

## Plugin Development

### Publishing a Plugin

```bash
# 1. Build plugin
npm run build

# 2. Sign plugin
sparx plugin sign ./dist

# 3. Publish to marketplace
sparx plugin publish

# 4. Verify published
sparx plugin verify @your-org/your-plugin
```

### Plugin Testing

```typescript
// plugin.test.ts
import { describe, it, expect } from '@sparx/test';
import myPlugin from './plugin';

describe('My Plugin', () => {
  it('should transform code', () => {
    const plugin = myPlugin();
    const result = plugin.transform('input', 'file.custom');
    
    expect(result.code).toContain('transformed');
  });
});
```

---

## Next Steps

- 📚 [Migration Guide](./migration.md) - Migrate existing projects
- 🚀 [Starter Templates](./starters.md) - Start with templates
- 📊 [Benchmarks](./benchmarks.md) - Performance comparisons
- 🔒 [Security Guide](./security.md) - Security best practices
