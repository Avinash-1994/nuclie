# Nuclie Plugins Guide

> **Plugin ecosystem with sandboxing support and WebCrypto signing support.**

---

## Quick Start

```bash
# Search for plugins
nuclie plugin search react

# Install a plugin
nuclie plugin install @nuclie/plugin-react

# List installed plugins
nuclie plugin list

# Verify plugin signatures
nuclie plugin verify @nuclie/plugin-react
```

---

## Using Plugins

### In `nuclie.config.ts`

```typescript
import { defineConfig } from 'nuclie';
import react from '@nuclie/plugin-react';
import tailwind from '@nuclie/plugin-tailwind';
import pwa from '@nuclie/plugin-pwa';

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
| `@nuclie/plugin-react` | React Fast Refresh + JSX | `nuclie plugin install @nuclie/plugin-react` |
| `@nuclie/plugin-vue` | Vue 3 SFC support | `nuclie plugin install @nuclie/plugin-vue` |
| `@nuclie/plugin-svelte` | Svelte compiler | `nuclie plugin install @nuclie/plugin-svelte` |
| `@nuclie/plugin-solid` | Solid.js JSX | `nuclie plugin install @nuclie/plugin-solid` |
| `@nuclie/plugin-angular` | Angular AOT compiler | `nuclie plugin install @nuclie/plugin-angular` |
| `@nuclie/plugin-preact` | Preact with Fast Refresh | `nuclie plugin install @nuclie/plugin-preact` |

### CSS & Styling

| Plugin | Description | Install |
|--------|-------------|---------|
| `@nuclie/plugin-tailwind` | Tailwind CSS v3+ | `nuclie plugin install @nuclie/plugin-tailwind` |
| `@nuclie/plugin-sass` | Sass/SCSS compiler | `nuclie plugin install @nuclie/plugin-sass` |
| `@nuclie/plugin-less` | Less compiler | `nuclie plugin install @nuclie/plugin-less` |
| `@nuclie/plugin-postcss` | PostCSS processor | `nuclie plugin install @nuclie/plugin-postcss` |
| `@nuclie/plugin-styled-components` | CSS-in-JS support | `nuclie plugin install @nuclie/plugin-styled-components` |
| `@nuclie/plugin-emotion` | Emotion CSS-in-JS | `nuclie plugin install @nuclie/plugin-emotion` |

### Assets & Media

| Plugin | Description | Install |
|--------|-------------|---------|
| `@nuclie/plugin-svgr` | SVG to React components | `nuclie plugin install @nuclie/plugin-svgr` |
| `@nuclie/plugin-image-optimizer` | Image compression | `nuclie plugin install @nuclie/plugin-image-optimizer` |
| `@nuclie/plugin-webp` | WebP conversion | `nuclie plugin install @nuclie/plugin-webp` |
| `@nuclie/plugin-fonts` | Font optimization | `nuclie plugin install @nuclie/plugin-fonts` |

### Performance

| Plugin | Description | Install |
|--------|-------------|---------|
| `@nuclie/plugin-compression` | Gzip/Brotli compression | `nuclie plugin install @nuclie/plugin-compression` |
| `@nuclie/plugin-preload` | Resource preloading | `nuclie plugin install @nuclie/plugin-preload` |
| `@nuclie/plugin-lazy-load` | Code splitting helpers | `nuclie plugin install @nuclie/plugin-lazy-load` |
| `@nuclie/plugin-bundle-analyzer` | Bundle size analysis | `nuclie plugin install @nuclie/plugin-bundle-analyzer` |

### Security

| Plugin | Description | Install |
|--------|-------------|---------|
| `@nuclie/plugin-csp` | Content Security Policy | `nuclie plugin install @nuclie/plugin-csp` |
| `@nuclie/plugin-sri` | Subresource Integrity | `nuclie plugin install @nuclie/plugin-sri` |
| `@nuclie/plugin-security-headers` | HTTP security headers | `nuclie plugin install @nuclie/plugin-security-headers` |

### Testing

| Plugin | Description | Install |
|--------|-------------|---------|
| `@nuclie/plugin-vitest` | Vitest integration | `nuclie plugin install @nuclie/plugin-vitest` |
| `@nuclie/plugin-jest` | Jest integration | `nuclie plugin install @nuclie/plugin-jest` |
| `@nuclie/plugin-playwright` | E2E testing | `nuclie plugin install @nuclie/plugin-playwright` |

### i18n

| Plugin | Description | Install |
|--------|-------------|---------|
| `@nuclie/plugin-i18next` | i18next integration | `nuclie plugin install @nuclie/plugin-i18next` |
| `@nuclie/plugin-react-intl` | React Intl | `nuclie plugin install @nuclie/plugin-react-intl` |
| `@nuclie/plugin-vue-i18n` | Vue I18n | `nuclie plugin install @nuclie/plugin-vue-i18n` |

### State Management

| Plugin | Description | Install |
|--------|-------------|---------|
| `@nuclie/plugin-redux` | Redux DevTools | `nuclie plugin install @nuclie/plugin-redux` |
| `@nuclie/plugin-zustand` | Zustand integration | `nuclie plugin install @nuclie/plugin-zustand` |
| `@nuclie/plugin-jotai` | Jotai atoms | `nuclie plugin install @nuclie/plugin-jotai` |

### Deployment

| Plugin | Description | Install |
|--------|-------------|---------|
| `@nuclie/plugin-vercel` | Vercel deployment | `nuclie plugin install @nuclie/plugin-vercel` |
| `@nuclie/plugin-netlify` | Netlify deployment | `nuclie plugin install @nuclie/plugin-netlify` |
| `@nuclie/plugin-cloudflare` | Cloudflare Workers | `nuclie plugin install @nuclie/plugin-cloudflare` |
| `@nuclie/plugin-docker` | Docker containerization | `nuclie plugin install @nuclie/plugin-docker` |

### Analytics

| Plugin | Description | Install |
|--------|-------------|---------|
| `@nuclie/plugin-google-analytics` | GA4 integration | `nuclie plugin install @nuclie/plugin-google-analytics` |
| `@nuclie/plugin-plausible` | Plausible Analytics | `nuclie plugin install @nuclie/plugin-plausible` |
| `@nuclie/plugin-sentry` | Error tracking | `nuclie plugin install @nuclie/plugin-sentry` |

---

## Plugin Security

### Plugin Security Model

Nuclie currently executes plugins in an isolated VM-based runtime with strict permission controls. A secure WASM runtime for plugin execution is planned, but the current model is based on runtime isolation and API safety checks.

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
nuclie plugin verify @nuclie/plugin-react

# Output:
✅ Signature valid
✅ Publisher: Nuclie Team
✅ Published: 2026-01-15
✅ SHA-256: a3f2...
```

### Plugin Manifest

```json
{
  "name": "@nuclie/plugin-react",
  "version": "2.0.0",
  "author": "Nuclie Team",
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
import { NucliePlugin } from 'nuclie';

export default function myPlugin(options = {}): NucliePlugin {
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
export interface NucliePlugin {
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
import { NucliePlugin } from 'nuclie';
import { marked } from 'marked';

export default function markdownPlugin(): NucliePlugin {
  return {
    name: 'nuclie-plugin-markdown',
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
// nuclie.config.ts
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
import { defineConfig } from 'nuclie';
import { rollupAdapter } from '@nuclie/plugin-compat';
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
import { webpackLoaderAdapter } from '@nuclie/plugin-compat';

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
nuclie plugin list --all

# Search by category
nuclie plugin search --category framework

# Filter by verified
nuclie plugin search --verified
```

### Plugin Ratings

```bash
# View plugin details
nuclie plugin info @nuclie/plugin-react

# Output:
📦 @nuclie/plugin-react v2.0.0
⭐ 4.8/5.0 (1,234 reviews)
📥 50,000 downloads/week
✅ Verified by Nuclie Team
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
npm uninstall @nuclie/plugin-name
nuclie plugin install @nuclie/plugin-name

# Or skip verification (not recommended)
nuclie plugin install @nuclie/plugin-name --skip-verify
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
import react from '@nuclie/plugin-react';
```

⚠️ **Avoid** (unless necessary):
```typescript
import react from 'some-unofficial-plugin';
```

### 2. Verify Plugin Signatures

```bash
# Always verify before using
nuclie plugin verify @nuclie/plugin-name
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
nuclie build --profile

# Output shows plugin timings
```

---

## Plugin Development

### Publishing a Plugin

```bash
# 1. Build plugin
npm run build

# 2. Sign plugin
nuclie plugin sign ./dist

# 3. Publish to marketplace
nuclie plugin publish

# 4. Verify published
nuclie plugin verify @your-org/your-plugin
```

### Plugin Testing

```typescript
// plugin.test.ts
import { describe, it, expect } from '@nuclie/test';
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
