# Urja Plugins Guide

> **100+ production-ready plugins** with WASM sandboxing and WebCrypto signing.

---

## Quick Start

```bash
# Search for plugins
urja plugin search react

# Install a plugin
urja plugin install @urja/plugin-react

# List installed plugins
urja plugin list

# Verify plugin signatures
urja plugin verify @urja/plugin-react
```

---

## Using Plugins

### In `urja.config.ts`

```typescript
import { defineConfig } from 'urja';
import react from '@urja/plugin-react';
import tailwind from '@urja/plugin-tailwind';
import pwa from '@urja/plugin-pwa';

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
| `@urja/plugin-react` | React Fast Refresh + JSX | `urja plugin install @urja/plugin-react` |
| `@urja/plugin-vue` | Vue 3 SFC support | `urja plugin install @urja/plugin-vue` |
| `@urja/plugin-svelte` | Svelte compiler | `urja plugin install @urja/plugin-svelte` |
| `@urja/plugin-solid` | Solid.js JSX | `urja plugin install @urja/plugin-solid` |
| `@urja/plugin-angular` | Angular AOT compiler | `urja plugin install @urja/plugin-angular` |
| `@urja/plugin-preact` | Preact with Fast Refresh | `urja plugin install @urja/plugin-preact` |

### CSS & Styling

| Plugin | Description | Install |
|--------|-------------|---------|
| `@urja/plugin-tailwind` | Tailwind CSS v3+ | `urja plugin install @urja/plugin-tailwind` |
| `@urja/plugin-sass` | Sass/SCSS compiler | `urja plugin install @urja/plugin-sass` |
| `@urja/plugin-less` | Less compiler | `urja plugin install @urja/plugin-less` |
| `@urja/plugin-postcss` | PostCSS processor | `urja plugin install @urja/plugin-postcss` |
| `@urja/plugin-styled-components` | CSS-in-JS support | `urja plugin install @urja/plugin-styled-components` |
| `@urja/plugin-emotion` | Emotion CSS-in-JS | `urja plugin install @urja/plugin-emotion` |

### Assets & Media

| Plugin | Description | Install |
|--------|-------------|---------|
| `@urja/plugin-svgr` | SVG to React components | `urja plugin install @urja/plugin-svgr` |
| `@urja/plugin-image-optimizer` | Image compression | `urja plugin install @urja/plugin-image-optimizer` |
| `@urja/plugin-webp` | WebP conversion | `urja plugin install @urja/plugin-webp` |
| `@urja/plugin-fonts` | Font optimization | `urja plugin install @urja/plugin-fonts` |

### Performance

| Plugin | Description | Install |
|--------|-------------|---------|
| `@urja/plugin-compression` | Gzip/Brotli compression | `urja plugin install @urja/plugin-compression` |
| `@urja/plugin-preload` | Resource preloading | `urja plugin install @urja/plugin-preload` |
| `@urja/plugin-lazy-load` | Code splitting helpers | `urja plugin install @urja/plugin-lazy-load` |
| `@urja/plugin-bundle-analyzer` | Bundle size analysis | `urja plugin install @urja/plugin-bundle-analyzer` |

### Security

| Plugin | Description | Install |
|--------|-------------|---------|
| `@urja/plugin-csp` | Content Security Policy | `urja plugin install @urja/plugin-csp` |
| `@urja/plugin-sri` | Subresource Integrity | `urja plugin install @urja/plugin-sri` |
| `@urja/plugin-security-headers` | HTTP security headers | `urja plugin install @urja/plugin-security-headers` |

### Testing

| Plugin | Description | Install |
|--------|-------------|---------|
| `@urja/plugin-vitest` | Vitest integration | `urja plugin install @urja/plugin-vitest` |
| `@urja/plugin-jest` | Jest integration | `urja plugin install @urja/plugin-jest` |
| `@urja/plugin-playwright` | E2E testing | `urja plugin install @urja/plugin-playwright` |

### i18n

| Plugin | Description | Install |
|--------|-------------|---------|
| `@urja/plugin-i18next` | i18next integration | `urja plugin install @urja/plugin-i18next` |
| `@urja/plugin-react-intl` | React Intl | `urja plugin install @urja/plugin-react-intl` |
| `@urja/plugin-vue-i18n` | Vue I18n | `urja plugin install @urja/plugin-vue-i18n` |

### State Management

| Plugin | Description | Install |
|--------|-------------|---------|
| `@urja/plugin-redux` | Redux DevTools | `urja plugin install @urja/plugin-redux` |
| `@urja/plugin-zustand` | Zustand integration | `urja plugin install @urja/plugin-zustand` |
| `@urja/plugin-jotai` | Jotai atoms | `urja plugin install @urja/plugin-jotai` |

### Deployment

| Plugin | Description | Install |
|--------|-------------|---------|
| `@urja/plugin-vercel` | Vercel deployment | `urja plugin install @urja/plugin-vercel` |
| `@urja/plugin-netlify` | Netlify deployment | `urja plugin install @urja/plugin-netlify` |
| `@urja/plugin-cloudflare` | Cloudflare Workers | `urja plugin install @urja/plugin-cloudflare` |
| `@urja/plugin-docker` | Docker containerization | `urja plugin install @urja/plugin-docker` |

### Analytics

| Plugin | Description | Install |
|--------|-------------|---------|
| `@urja/plugin-google-analytics` | GA4 integration | `urja plugin install @urja/plugin-google-analytics` |
| `@urja/plugin-plausible` | Plausible Analytics | `urja plugin install @urja/plugin-plausible` |
| `@urja/plugin-sentry` | Error tracking | `urja plugin install @urja/plugin-sentry` |

---

## Plugin Security

### WASM Sandboxing

All plugins run in **WASM-isolated environments**:

```typescript
// Plugins CANNOT:
❌ Access filesystem directly
❌ Make network requests
❌ Execute arbitrary code
❌ Access environment variables

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
urja plugin verify @urja/plugin-react

# Output:
✅ Signature valid
✅ Publisher: Urja Team
✅ Published: 2026-01-15
✅ SHA-256: a3f2...
```

### Plugin Manifest

```json
{
  "name": "@urja/plugin-react",
  "version": "2.0.0",
  "author": "Urja Team",
  "signature": "...",
  "permissions": [
    "transform:jsx",
    "emit:assets"
  ],
  "sandbox": "wasm",
  "verified": true
}
```

---

## Writing Custom Plugins

### Basic Plugin Structure

```typescript
// my-plugin.ts
import { UrjaPlugin } from 'urja';

export default function myPlugin(options = {}): UrjaPlugin {
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
export interface UrjaPlugin {
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
import { UrjaPlugin } from 'urja';
import { marked } from 'marked';

export default function markdownPlugin(): UrjaPlugin {
  return {
    name: 'urja-plugin-markdown',
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
// urja.config.ts
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
import { defineConfig } from 'urja';
import { vitePluginAdapter } from '@urja/plugin-compat';
import viteReactSvgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    // Wrap Vite plugin
    vitePluginAdapter(viteReactSvgr())
  ]
});
```

**Compatibility**: ~80% of Vite plugins work with adapter

### Webpack Loader Adapter

```typescript
import { webpackLoaderAdapter } from '@urja/plugin-compat';

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

**Compatibility**: ~70% of Webpack loaders work with adapter

---

## Plugin Marketplace

### Browse Plugins

```bash
# List all plugins
urja plugin list --all

# Search by category
urja plugin search --category framework

# Filter by verified
urja plugin search --verified
```

### Plugin Ratings

```bash
# View plugin details
urja plugin info @urja/plugin-react

# Output:
📦 @urja/plugin-react v2.0.0
⭐ 4.8/5.0 (1,234 reviews)
📥 50,000 downloads/week
✅ Verified by Urja Team
🔒 WASM sandboxed
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
npm uninstall @urja/plugin-name
urja plugin install @urja/plugin-name

# Or skip verification (not recommended)
urja plugin install @urja/plugin-name --skip-verify
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
import react from '@urja/plugin-react';
```

⚠️ **Avoid** (unless necessary):
```typescript
import react from 'some-unofficial-plugin';
```

### 2. Verify Plugin Signatures

```bash
# Always verify before using
urja plugin verify @urja/plugin-name
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
urja build --profile

# Output shows plugin timings
```

---

## Plugin Development

### Publishing a Plugin

```bash
# 1. Build plugin
npm run build

# 2. Sign plugin
urja plugin sign ./dist

# 3. Publish to marketplace
urja plugin publish

# 4. Verify published
urja plugin verify @your-org/your-plugin
```

### Plugin Testing

```typescript
// plugin.test.ts
import { describe, it, expect } from '@urja/test';
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
