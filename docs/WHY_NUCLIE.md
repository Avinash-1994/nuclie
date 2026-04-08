# Why Nuclie?

> An honest comparison against Vite, Rspack, Turbopack, and Webpack.
> No marketing numbers — real trade-offs included.

---

## The Problem With Existing Tools

| Tool | Launch Year | Core Language | Main Pain Point |
|------|-------------|---------------|-----------------|
| **Webpack** | 2012 | JavaScript | Slow builds, complex config (1000+ line configs are common) |
| **Vite** | 2020 | JavaScript | Dev uses ESM/Rollup split (inconsistency), cold starts grow with project size |
| **Rspack** | 2023 | Rust | Webpack API compatibility mode adds overhead; not ESM-native |
| **Turbopack** | 2022 | Rust | Next.js-only; no standalone use; closed ecosystem |
| **Parcel** | 2017 | JavaScript | Magic config is great for simple apps, hard to extend for complex ones |

---

## Feature Matrix

| Feature | Nuclie | Vite | Rspack | Turbopack | Webpack 5 |
|---------|--------|------|--------|-----------|-----------|
| **HMR** | ✅ <60ms | ✅ ~50ms | ✅ ~80ms | ✅ ~30ms* | ✅ ~200ms |
| **Cold Start** | ✅ Fast | ✅ Fast | ✅ Fast | ✅ Fast | ❌ Slow |
| **Module Federation** | ✅ Built-in | ⚠️ Plugin | ✅ Built-in | ❌ N/A | ✅ Built-in |
| **CSS Modules** | ✅ Built-in | ✅ Built-in | ✅ Built-in | ✅ Built-in | ⚠️ Loaders |
| **TypeScript** | ✅ Built-in | ✅ Built-in | ✅ Built-in | ✅ Built-in | ⚠️ ts-loader |
| **Tree Shaking** | ✅ AST-based | ✅ Rollup | ✅ SWC-based | ✅ | ✅ |
| **React** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Vue** | ✅ | ✅ | ✅ | ❌ | ⚠️ |
| **Svelte** | ✅ | ✅ | ⚠️ | ❌ | ⚠️ |
| **Solid** | ✅ | ✅ | ⚠️ | ❌ | ⚠️ |
| **Qwik** | ⚠️ Experimental | ⚠️ | ❌ | ❌ | ❌ |
| **Standalone** | ✅ | ✅ | ✅ | ❌ Next.js only | ✅ |
| **Plugin API** | ✅ Vite-compatible | ✅ | ⚠️ Webpack compat | ❌ | ✅ |
| **Source Maps** | ✅ inline/external/hidden | ✅ | ✅ | ✅ | ✅ |
| **SWC Transform** | ✅ Native | ⚠️ Optional plugin | ✅ | ✅ | ⚠️ Plugin |
| **LightningCSS** | ✅ Native | ⚠️ Optional | ❌ | ✅ | ❌ |
| **Open Source** | ✅ MIT | ✅ MIT | ✅ MIT | ⚠️ Vercel-led | ✅ MIT |
| **Standalone OSS** | ✅ | ✅ | ✅ | ❌ | ✅ |

*Turbopack numbers are Next.js specific and may not apply to general use*

---

## Honest Strengths

### Where Nuclie Wins

**1. Unified architecture**
Nuclie uses a single pipeline for both dev and production — no Rollup/ESM split like Vite. What you test in dev is exactly what gets built.

**2. Built-in Module Federation**
No plugins required. Works with React, Vue, and Vanilla. Start a micro-frontend project in minutes, not hours.

**3. Framework breadth**
React, Vue, Svelte, Solid, Preact, Lit, Alpine, Qwik, Mithril, Vanilla — all from a single config shape.

**4. LightningCSS by default**
100x faster CSS processing than PostCSS for standard transformations. Tailwind and CSS Modules both supported natively.

**5. Smart caching**
Fingerprint-based incremental builds persist across restarts. Second builds are dramatically faster than first builds.

---

## Honest Weaknesses

### Where Nuclie is Behind

**1. Plugin ecosystem**
Vite has 1500+ plugins. Nuclie is newer — ecosystem is growing but not there yet. Most Vite plugins work through the compatibility adapter (~80%).

**2. Community size**
Smaller community means fewer StackOverflow answers and third-party tutorials. The docs are the primary reference.

**3. Battle-tested maturity**
Vite and Webpack have been used in production by millions of projects. Nuclie is newer and may have edge cases that haven't been encountered yet.

**4. SSR maturity**
SSR support is functional but less mature than Vite's. Complex SSR setups (streaming, edge rendering) may require more manual configuration.

**5. No framework-specific meta-framework**
Vite has SvelteKit, Nuxt, Remix (via adapter). Nuclie doesn't yet have equivalent meta-frameworks built around it.

---

## Who Should Use Nuclie

✅ **Good fit if you:**
- Are starting a new project and want a clean, fast setup
- Need module federation / micro-frontends out of the box
- Use multiple frameworks across your team
- Want consistent dev/prod behavior without surprises
- Care about CSS compilation performance

⚠️ **Consider alternatives if you:**
- Have an existing Vite project that's working well (no reason to migrate)
- Rely heavily on Vite-specific plugins with no Nuclie equivalent
- Need a large community / extensive third-party resources
- Are building with Next.js or Nuxt (stick with their native tooling)

---

## Migration Paths

| From | To Nuclie | Effort |
|------|-----------|--------|
| Vite | `npx nuclie migrate` auto-migrates ~95% | Low (15 min) |
| Webpack | `npx nuclie migrate` auto-migrates ~80% | Medium (30–60 min) |
| Rollup | Manual config translation | Medium (30 min) |
| Parcel | Manual, most features map 1:1 | Low (20 min) |
| CRA | Bootstrap new + copy src | Medium (45 min) |

---

## The Bottom Line

Nuclie is the right choice when you want a **modern, Rust-accelerated build tool** that works across all major frameworks with **module federation built in** and a **consistent dev/prod pipeline**.

It's not a Vite killer — it's a different tool with different priorities. If you're happy with Vite, stay there. If you want what Nuclie offers, it's production-ready and getting better every release.

---

## Resources

- [Getting Started](./getting-started.md)
- [Migration Guide](./migration.md)
- [Benchmarks](./benchmarks.md)
- [Plugin Guide](./plugins.md)
- [GitHub](https://github.com/Avinash-1994/Nuclie)
