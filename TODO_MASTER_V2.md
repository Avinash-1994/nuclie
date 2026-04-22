# SPARX — COMPLETE MASTER PROMPT v2.0 TODO LIST

## GOLDEN RULES
- [ ] **RULE 1:** Zero breaking changes. All new behaviour is additive or behind an opt-in config key. No existing public API surface, plugin hook, N-API export, config key, or CLI flag may be renamed, removed, or have its type changed.
- [ ] **RULE 2:** Every new framework adapter is an optional peer dependency. Missing peer dep = one clear INFO line, not a crash.
- [ ] **RULE 3:** Every feature ships with a real-world test fixture that proves it works under realistic conditions. Toy fixtures are not acceptable.
- [ ] **RULE 4:** Performance gates are CI requirements, not aspirations. If a gate is missed, the phase does not merge.
- [ ] **RULE 5:** The REGRESSION GATE runs after every phase. 100% green before the next phase begins.
- [ ] **RULE 6:** Deprecation over deletion. Anything removed gets a `console.warn()` pointing to `https://sparx.dev/migrate` and survives for one major version.
- [ ] **RULE 7:** All new config keys are namespaced and optional with defaults that reproduce current behaviour when omitted.
- [ ] **RULE 8:** Every production build runs the secret scanner and CVE check unless explicitly disabled. Security is on by default.

---

## PHASE 0 — SHARED INFRASTRUCTURE

### 0.1 ADAPTER BASE
- [x] Define `SparxAdapter` interface in `packages/sparx-adapter-core/src/index.ts`
  - [x] `name: string`
  - [x] `detect(projectRoot: string, pkg: PackageJson): boolean`
  - [x] `plugins(): Plugin[]`
  - [x] `config(config: SparxConfig): SparxConfig | Promise<SparxConfig>`
  - [x] `serverMiddleware?(): Middleware[]`
  - [x] `ssrEntry?(config: SparxConfig): string | undefined`
  - [x] `buildOutput?(outputDir: string): Promise<void>`
- [x] Implement adapter registry in `packages/sparx-adapter-core/src/registry.ts` with detection priority (first match wins):
  - [x] `@sveltejs/kit` → svelte-kit adapter
  - [x] `nuxt` → nuxt adapter
  - [x] `@solidjs/start` → solid-start adapter
  - [x] `@builder.io/qwik-city` → qwik-city adapter
  - [x] `@angular/core` → angular adapter
  - [x] `@analogjs/platform` → analog adapter
  - [x] `@remix-run/dev` → remix adapter
  - [x] `@tanstack/start` → tanstack-start adapter
  - [x] `react-router ≥7` → react-router adapter
  - [x] `waku` → waku adapter
  - [x] `vitepress` → vitepress adapter
  - [x] `astro` → astro adapter
  - [x] `gatsby` → gatsby adapter (warn: community preview)
  - [x] `@redwoodjs/core` → redwood adapter

### 0.2 TEST HARNESS INFRASTRUCTURE
- [x] Create `tests/harness/index.ts` exposing:
  - [x] `buildFixture(name)`
  - [x] `devFixture(name)`
  - [x] `hmrTrigger(server, file, content)`
  - [x] `measureHmr(server, file, content)`
  - [x] `bundleContains(dist, module)`
  - [x] `bundleExcludes(dist, module)`
  - [x] `sourcemapTraces(dist, file, line)`
  - [x] `securityScan(dist)`
- [x] Create `tests/harness/playwright.ts` exposing:
  - [x] `browserHmr(url, trigger, assertion)`
  - [x] `screenshotDiff(url, reference)`
  - [x] `hydrationCheck(url)`
- [x] Create `e2e/fixtures/` and `benchmarks/fixtures/` directories

### 0.3 FIXTURE GENERATOR
- [x] Create `scripts/generate-fixtures.ts` with `generateApp()`
  - [x] Params: `modules: 100 | 1000 | 5000`, `framework`, `features`
  - [x] Feature generation capabilities:
    - [x] `routes` (file-based, realistic paths)
    - [x] `components` (with props/state)
    - [x] `api` (server routes)
    - [x] `mfe` (MFE remote setup)
    - [x] `i18n` (internationalisation)
    - [x] `auth` (protected routes + JWT)
    - [x] `db` (mocked database queries)
    - [x] `charts` (data visualisation)

---

## PHASE 1 — ARCHITECTURE FIXES AND IMPROVEMENTS

### 1.1 [SAFE REMOVAL] Remove Wasmtime sandbox
- [x] Delete `crates/sparx_native/src/wasmtime.rs` and Cargo dependencies (`wasmtime`, `wasmtime-wasi`)
- [x] Remove `WasmPluginRunner::execute()` calls
- [x] Add startup validation: emit descriptive error for `.wasm` plugins
- [x] Emit deprecation warning pointing to migration URL
- [x] **Fixture:** `e2e/fixtures/plugin-migration-app/` (React app, 5 rewritten TS hooks)
  - [x] TEST: All 5 plugin hooks fire in correct order
  - [x] TEST: .wasm plugin entry throws descriptive error
  - [x] TEST: sparx migrate rewrites wasm plugin refs
  - [x] TEST: Build output identical before and after removal

### 1.2 [SAFE REMOVAL] Remove LevelDB, consolidate SQLite
- [x] Delete `crates/sparx_native/src/cache/leveldb.rs` and Cargo dependencies (`rocksdb`, `leveldb`)
- [x] Extend SQLite schema with `cache_type TEXT` column
- [x] Set `PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;`
- [x] Implement LevelDB → SQLite migration and dir rename on first startup
- [x] Use single `.sparx/cache/cache.db`
- [x] **Fixture:** `e2e/fixtures/large-monorepo-cache/` (3-app monorepo, 800 modules)
  - [x] TEST: SQLite cache hit rate > 95% on second build
  - [x] TEST: WAL mode: 3 parallel builds do not deadlock
  - [x] TEST: LevelDB migration: old cache entries imported
  - [x] TEST: Cache size < 50MB after 10 builds
  - [x] TEST: Build time with warm cache < 500ms

### 1.3 Replace Express with uWebSockets.js
- [x] Uninstall `express` + `@types/express`
- [x] Install `uWebSockets.js`
- [x] Rewrite `packages/sparx-dev-server/src/server.ts` to `uWS.App()`
- [x] Ensure `DevServerPlugin` hook object is byte-identical (connect-adapter shim)
- [x] **Fixture:** `e2e/fixtures/high-traffic-dev-server/`
  - [x] TEST: 10 concurrent connections all receive HMR updates
  - [x] TEST: p99 HMR latency < 80ms under load
  - [x] TEST: No memory leak after 1000 HMR events
  - [x] TEST: Existing DevServerPlugin hooks fire identically
  - [x] TEST: CORS headers identical
  - [x] TEST: Static file serving cache headers identical

### 1.4 Hoist LightningCSS to peer of SWC
- [x] Separate `lightning_css` from `swc_pipeline`
- [x] Orchestrate parallel processing
- [x] Add N-API exports: `transformCss` and `transformJs`
- [x] Keep existing `transform()` export working
- [x] **Fixture:** `e2e/fixtures/css-hoisting/`
  - [x] TEST: SWC and LightningCSS run in parallel
  - [x] TEST: CSS nesting resolved correctly
  - [x] TEST: CSS Modules class names stable
  - [x] TEST: Source maps accurate for CSS and JS
  - [x] TEST: Build time < 8s

### 1.5 Native FS watcher
- [x] Create `crates/sparx_native/src/watcher.rs` using `notify` crate, 50ms debounce
- [x] Add N-API exports: `startWatcher(paths)`, `onWatchEvent(callback)`
- [x] Replace `chokidar` in dev server (keep chokidar as fallback)
- [x] **Fixture:** `e2e/fixtures/monorepo-watcher/` (5 packages, 200 files watched)
  - [x] TEST: 200-file watch starts in < 50ms
  - [x] TEST: File change detected in < 10ms
  - [x] TEST: chokidar fallback activates if native fails
  - [x] TEST: Cross-package change propagates HMR correctly
  - [x] TEST: Debounce 10 rapid saves → 1 HMR event
  - [x] TEST: Watcher RSS memory < 30MB

### 1.6 HMR client runtime
- [x] Create `packages/sparx-hmr-client/src/index.ts` (<5KB, zero dep)
- [x] Implement WebSocket endpoint to `SPARX_HMR_URL` or `location.host`
- [x] Support `update` event (re-import with `?t=timestamp`), CSS swap, `full-reload`
- [x] Inject `<script type="module">` into HTML
- [x] **Fixture:** `e2e/fixtures/hmr-scenarios/` (Playwright)
  - [x] TEST: JS module change → module re-executed, UI updates
  - [x] TEST: CSS change → stylesheet swapped, no flash
  - [x] TEST: Vue SFC <template> change → component re-rendered
  - [x] TEST: Vue SFC <script> change → full component reload
  - [x] TEST: Vue SFC <style> change → CSS swap only
  - [x] TEST: React/Svelte component changes re-rendered
  - [x] TEST: HMR preserves component state
  - [x] TEST: Full-reload message reloads page once
  - [x] TEST: WebSocket reconnects automatically

### 1.7 Source map merger
- [x] Create `crates/sparx_native/src/sourcemap_merger.rs`
- [x] Compose SWC + LightningCSS maps into one using VLQ encoding
- [x] N-API: `mergeSourceMaps(maps: string[]): string`
- [x] **Fixture:** `e2e/fixtures/sourcemap-accuracy/` (Vue/TS/SCSS errors)
  - [x] TEST: Vue SFC error shows .vue line
  - [x] TEST: Typescript error shows .ts line
  - [x] TEST: SCSS error shows .scss line
  - [x] TEST: Accurate after minification & code splitting
  - [x] TEST: Chrome DevTools step-through lands on source

### 1.8 Chunker + DCE (tree shaking)
- [ ] Create `crates/sparx_native/src/chunker.rs`
- [ ] DCE: reachability traversal, live binding marking
- [ ] Configure `strategy: Manual|Auto`, `max_chunk_size_kb`
- [ ] N-API: `sparxChunk(graphJson, config)`
- [ ] **Fixture:** `e2e/fixtures/e-commerce-app/` (React + Query/Zustand)
  - [ ] TEST: 1 chunk per route
  - [ ] TEST: date-fns and Zustand unused slices tree-shaken
  - [ ] TEST: Shared deps extracted to vendor chunk
  - [ ] TEST: Initial route JS < 80KB gzip, Total bundle < 400KB gzip
  - [ ] TEST: Unused React APIs removed
  - [ ] TEST: Lazy images split to async chunks

### 1.9 SSR runner
- [ ] Create `packages/sparx-ssr/src/runner.ts` using `vm.Module`
- [ ] Export `renderToString(entryPath, context) -> { html, head, state }`
- [ ] Wire dev server to pipe `ssr: true` requests
- [ ] **Fixture:** `e2e/fixtures/ssr-blog/` (React, 50 posts)
  - [ ] TEST: Server rendered HTML returned (no blank page)
  - [ ] TEST: Zero hydration errors in console
  - [ ] TEST: SEO tags present in HTML
  - [ ] TEST: Data in HTML before JS executes
  - [ ] TEST: SSR error shows overlay in dev
  - [ ] TEST: Cached TTFB < 100ms

### 1.10 Pre-bundle cache
- [ ] Create `crates/sparx_native/src/cache/prebundle.rs` in `.sparx/cache/deps/`
- [ ] Key on package versions + lockfile fingerprint
- [ ] N-API: `prebundle(modules)`
- [ ] Check fingerprint on dev server start
- [ ] **Fixture:** `e2e/fixtures/heavy-deps-app/`
  - [ ] TEST: Cold start pre-bundles 50 deps < 3s
  - [ ] TEST: Warm start < 100ms
  - [ ] TEST: Dep update only re-bundles changed dep
  - [ ] TEST: All deps resolve at runtime

### 1.11 Module registry (browser MFE)
- [ ] Create `packages/sparx-module-registry/src/index.ts`
- [ ] API: `register(scope, url)`, `load(scope, module)`, `invalidate(scope)`
- [ ] Bootstrap `__sparx_registry_init__` script (Tested in Phase 2 MFE)

### 1.12 Remote cache (S3 + Sparx Cloud)
- [ ] Create `packages/sparx-remote-cache/src/index.ts` implementing `RemoteCacheProvider`
- [ ] Providers: S3, SparxCloud (`https://cache.sparx.dev/v1/`)
- [ ] Options: provider (default: false), bucket, token, readOnly
- [ ] **Fixture:** `e2e/fixtures/ci-cache-simulation/`
  - [ ] TEST: Full build uploads artifacts to S3
  - [ ] TEST: PR build replays unchanged tasks
  - [ ] TEST: Time reduction > 80%
  - [ ] TEST: readOnly flag prevents writes
  - [ ] TEST: Collision / project isolation works
  - [ ] TEST: Fallback graceful on network failure

### 1.13 Task graph (incremental build)
- [ ] Create `crates/sparx_native/src/task_graph.rs`
- [ ] Track inputs, outputs, fn_hash (SWC/Lightning config hash)
- [ ] Diff current vs SQLite table, N-API `planBuild(manifest)`
- [ ] **Fixture:** `e2e/fixtures/incremental-builds/` (1000-module app)
  - [ ] TEST: 1-file change: > 99% task hit rate
  - [ ] TEST: SWC bump invalidates all transform tasks
  - [ ] TEST: Config change only invalidates affected tasks
  - [ ] TEST: Shared utility change propagates correctly
  - [ ] TEST: Incremental output equals full clean build output

### 1.14 Rollup/Vite plugin compatibility
- [ ] Implement detailed Rollup and Vite hooks in `packages/sparx-plugin-runner/src/runner.ts`
  - [ ] Rollup hooks: buildStart, resolveId, load, transform, moduleParsed, buildEnd, generateBundle, writeBundle, closeBundle, renderChunk, banner, footer, intro, outro
  - [ ] Vite hooks: configResolved, configureServer, configurePreviewServer, handleHotUpdate, transformIndexHtml, resolveFileUrl, renderBuiltUrl
- [ ] **Fixture:** `e2e/fixtures/vite-plugin-compat/` check 10 real plugins unmodified:
  - [ ] `vite-plugin-vue`
  - [ ] `vite-plugin-svelte`
  - [ ] `@vitejs/plugin-react`
  - [ ] `vite-plugin-checker`
  - [ ] `vite-plugin-pwa`
  - [ ] `unplugin-auto-import`
  - [ ] `unplugin-vue-components`
  - [ ] `vite-plugin-inspect`
  - [ ] `@iconify/vite`
  - [ ] `vite-plugin-imagemin`

### 1.15 Zero-config auto-detection
- [ ] Create `packages/sparx-autoconfig/src/detect.ts`
- [ ] Detect framework via package deps, entry script, monorepo manifest, TS config.
- [ ] **Fixture:** `e2e/fixtures/zero-config-suite/` (6 sub-apps)
  - [ ] TEST: Vue, React, Svelte, Angular, SvelteKit, Nuxt all detect and start correctly with NO config file.

### 1.16 Monorepo workspace support
- [ ] Create `packages/sparx-workspace/src/index.ts`
- [ ] Map cross-package deps (no symlink tracking), HMR boundaries
- [ ] Allow `sparx build --all` topological builds
- [ ] **Fixture:** `e2e/fixtures/enterprise-monorepo/`
  - [ ] TEST: HMR crosses borders packages/ui → apps/customer
  - [ ] TEST: Change in utility updates all 3 apps
  - [ ] TEST: --all respects topological order
  - [ ] TEST: Parallel build processes apps independent
  - [ ] TEST: Total build < 25s

### 1.17 Error overlay
- [ ] Create `packages/sparx-error-overlay/src/index.ts`
- [ ] Visual UI, clear phrasing, `vscode://` deep links, auto-clears.
- [ ] **Fixture:** `e2e/fixtures/error-scenarios/`
  - [ ] TEST: Shows exact file+line for TS, Vue, Svelte, NG, Astro, CSS, or missing import errors.
  - [ ] TEST: Auto clears in < 200ms
  - [ ] TEST: vscode:// link correct

### 1.18 Bundle analyser, `sparx why`, `sparx check`
- [ ] Create `packages/sparx-analyze/src/index.ts`
- [ ] Implement `--analyze` (D3 Treemap), `why <module>`, and `check` CLI params.
- [ ] **Fixture:** `e2e/fixtures/bundle-analysis-app/`
  - [ ] TEST: --analyze renders UI
  - [ ] TEST: only 3 used lodash functions shown
  - [ ] TEST: sparx why prints dependency chain
  - [ ] TEST: sparx why missing-module exits 1
  - [ ] TEST: sparx check catches circular dependencies & TS errors

---

## PHASE 2 — FRAMEWORK ADAPTER ECOSYSTEM
Each requires implementation file + real-world fixture testing

- [ ] **2.1 ANGULAR** (`src/framework-adapters/angular/index.ts`)
  - [ ] Hook `@angular/compiler-cli`, cache via SQLite, SWC downlevel.
  - [ ] LightningCSS styles (ViewEncapsulation setup).
  - [ ] **Fixture:** `e2e/fixtures/angular-enterprise/` (200 components)
    - [ ] PASS: Cold <8s, warm <600ms, HMR <200ms, build <12s, tree shaken, SSR zero mismatch.
- [ ] **2.2 NUXT.JS** (`src/meta-frameworks/nuxt/*`)
  - [ ] Custom routing, Nitro bridge, `auto-imports-bridge.ts`.
  - [ ] **Fixture:** `e2e/fixtures/nuxt-saas-platform/`
    - [ ] PASS: SSR build, SSG routes, Pinia hydration, Server APIs.
- [ ] **2.3 SVELTEKIT** (`src/meta-frameworks/sveltekit/index.ts`)
  - [ ] Routing conventions, Server API `+server.ts` wiring.
  - [ ] **Fixture:** `e2e/fixtures/sveltekit-fullstack/`
    - [ ] PASS: Data load functions, Post without JS, Auth guard redirect.
- [ ] **2.4 SOLIDSTART** (`src/meta-frameworks/solidstart/index.ts`)
  - [ ] Node.js streaming `renderToStream()`.
  - [ ] **Fixture:** `e2e/fixtures/solidstart-dashboard/`
    - [ ] PASS: Streaming SSR (TTFB <50ms), server actions.
- [ ] **2.5 QWIK CITY** (`src/meta-frameworks/qwikcity/index.ts`)
  - [ ] Optimizer transform, QRL loading script.
  - [ ] **Fixture:** `e2e/fixtures/qwikcity-store/`
    - [ ] PASS: Zero JS initial load, Resumable state, Lighthouse > 95.
- [ ] **2.6 ASTRO** (`src/meta-frameworks/astro/index.ts`)
  - [ ] `@astrojs/compiler` WASM cache. Support `client:idle|load|visible` chunks.
  - [ ] **Fixture:** `e2e/fixtures/astro-content-platform/`
    - [ ] PASS: Islands lazy load correctly, MDX render, Content types.
- [ ] **2.7 REMIX** (`src/meta-frameworks/remix/index.ts`)
  - [ ] `fetch` Request/Response shim over uWS.
  - [ ] **Fixture:** `e2e/fixtures/remix-job-board/`
    - [ ] PASS: loaders/actions work, zero mismatch.
- [ ] **2.8 ANALOG** (`src/meta-frameworks/analog/index.ts`)
  - [ ] File routing logic, renderApplication().
  - [ ] **Fixture:** `e2e/fixtures/analog-cms/`
    - [ ] PASS: File routing resolves, tRPC API works.
- [ ] **2.9 REACT ROUTER v7** (`src/meta-frameworks/react-router/index.ts`)
  - [ ] SPA vs SSR logic via `react-router.config.ts`.
  - [ ] **Fixture:** `e2e/fixtures/react-router-app/`
    - [ ] PASS: Server rendered profiles, SPA client routes.
- [ ] **2.10 TANSTACK START** (`src/meta-frameworks/tanstack-start/index.ts`)
  - [ ] Create server fn shim, module preload hints.
  - [ ] **Fixture:** `e2e/fixtures/tanstack-invoicing/`
    - [ ] PASS: Server functions execute, type safety on endpoints.
- [ ] **2.11 WAKU** (`src/meta-frameworks/waku/index.ts`)
  - [ ] RSC boundary parsing `'use server'/'use client'`.
  - [ ] **Fixture:** `e2e/fixtures/waku-storefront/`
    - [ ] PASS: RSC state refreshes correctly, no Vercel lock.
- [ ] **2.12 VITEPRESS** (`src/meta-frameworks/vitepress/index.ts`)
  - [ ] Markdown pipeline, static site generation.
  - [ ] **Fixture:** `e2e/fixtures/vitepress-docs/`
    - [ ] PASS: 80 pages generate in < 4s, Theme/mermaid work.
- [ ] **2.13 TAURI** (`src/meta-frameworks/tauri/index.ts`)
  - [ ] `cargo tauri dev` hook, JSON command type inference.
  - [ ] **Fixture:** `e2e/fixtures/tauri-file-manager/`
    - [ ] PASS: Desktop build executes, IPC commands infer types.
- [ ] **2.14 ELECTRON** (`src/meta-frameworks/electron/index.ts`)
  - [ ] Dual bundle logic, `ELECTRON_DEV_SERVER_URL`.
  - [ ] **Fixture:** `e2e/fixtures/electron-notes/`
    - [ ] PASS: IPC generated typing, renderer is browser build, main is Node.
- [ ] **2.15 NEXT.JS (PAGES)** (`src/meta-frameworks/nextjs/pages-only.ts`)
  - [ ] Overwrite `next.config.js` to replace Babel with SWC.
  - [ ] **Fixture:** `e2e/fixtures/nextjs-pages-migration/`
    - [ ] PASS: Drops safely into existing Next app with HMR boost.
- [ ] **2.16 COMMUNITY SCAFFOLDS**
  - [ ] Implement simple templates for Gatsby, RedwoodJS, Stencil, Marko, Docusaurus.

---

## PHASE 3 — SECURITY

### 3.1 Supply chain security
- [ ] Create `packages/sparx-security/src/supply-chain.ts`
- [ ] Generate SBOM `dist/sparx-sbom.json`
- [ ] Verify Lockfile hash checksums.
- [ ] CVE scan using OSV DB, blocking High vulnerabilities.
- [ ] **Fixture:** `e2e/fixtures/security-supply-chain/`
  - [ ] TEST: CVE scanner blocks bad deps, lockfile tampering triggers abort.

### 3.2 Build process isolation
- [ ] Create `packages/sparx-security/src/env-guard.ts` & native sandbox
- [ ] Enforce plugin permissions (fs, net, env, exec) via `sparx.plugin.json`.
- [ ] Deep path safety & regex based secret scanning string output checks (AWS, stripe, private keys, JWT, github).
- [ ] **Fixture:** `e2e/fixtures/security-isolation/`
  - [ ] TEST: Unauthorized plugins blocked, cleartext secrets abort build.

### 3.3 Output hardening
- [ ] Create `packages/sparx-build/src/sri.ts`, `csp.ts`, `security-headers.ts`
- [ ] Inject `integrity` hashes.
- [ ] Generate strict Content Security Policies in HTML + Headers config.
- [ ] **Fixture:** `e2e/fixtures/security-hardened-app/`
  - [ ] TEST: Valid CSP, valid SRI tags.

### 3.4 Security CLI commands
- [ ] Add `security audit`, `security sbom`, `security plugin-audit`, `security fix`
- [ ] **Fixture:** `e2e/fixtures/security-cli/`
  - [ ] TEST: fix script auto-upgrades lockfiles, process.env rewrite.

---

## PHASE 4 — LAUNCH PLUGIN ECOSYSTEM

Implement Rollup-compatible plugins tracking to `packages/sparx-plugin-{name}/`:
- [ ] **plugin-env**: Load vars, auto gen `src/env.d.ts`, block secret patterns.
- [ ] **plugin-pwa**: Web App Manifest, ServiceWorker auto-install precache.
- [ ] **plugin-icons**: On-demand icon loader (`~icons/mdi/...`).
- [ ] **plugin-svg**: URL import, raw import, rendering component import.
- [ ] **plugin-legacy**: `<script nomodule>` transpiled fallback using SWC corejs injection.
- [ ] **plugin-compression**: Fast Rust Brotli/Gzip parallel thread processing.
- [ ] **plugin-auto-import**: Import hooks, `.eslintrc-auto-import` sync.
- [ ] **plugin-inspect**: Vue/React GUI to watch dev timings mapped visually.
- [ ] **plugin-checker**: Worker thread linter testing (tsc, eslint, stylelint).
- [ ] **plugin-mock**: Fast REST intercept + GraphQL local generation mocks.
- [ ] **plugin-image**: sharp optimization, AVIF+WebP responsive srcset output.

_(All must pass their matching `plugin-<name>-app` fixture tested in browser!)_

---

## PHASE 5 — FULL TEST SUITE

### 5.1 WEBPACK MIGRATION PARITY
- [ ] Tests 001 - 015 confirming single chunks, CSS modules, aliasing, MFE compat, dynamic chunks matching webpack baseline.

### 5.2 VITE MIGRATION PARITY
- [ ] Tests 001 - 012 ensuring `import.meta.glob`, outputs, pre/post enforces, lib-mode output dual format.

### 5.3 JS TRANSFORM CORRECTNESS
- [ ] Tests 001 - 015 verifying modern ES2022+ TC39 (private class, await tops, decorators) transpiles correctly.

### 5.4 CSS CORRECTNESS
- [ ] Tests 001 - 010 verifying LightningCSS cascade layers, nesting syntax, Grid structures.

### 5.5 SOURCE MAP CORRECTNESS
- [ ] Tests 001 - 009 validating traces match lines in .vue, .ts, .astro, .scss, minification outputs perfectly.

### 5.6 TREE SHAKING CORRECTNESS
- [ ] Tests 001 - 010 targeting `sideEffects=false`, unused named exports, complex dead branches.

### 5.7 EDGE CASE SUITE
- [ ] Tests 001 - 018 confirming resilience involving deep recursive imports, multi-case FS checks, mixed formats (CJS/ESM), giant files (10MB).

### 5.8 PERFORMANCE BENCHMARKS (GATES)
- [ ] 001: Cold 100-modules (<250ms)
- [ ] 002: Cold 1000-m (<400ms)
- [ ] 003: Cold 5000-m (<800ms)
- [ ] 004: Warm start (<100ms)
- [ ] 005: Playwright HMR p50 (<50ms)
- [ ] 008: Prod build 1000-module (<8s)
- [ ] 011: Peak RSS RAM load 5000 (<2GB)
- [ ] No test falls >110% below previous CI.

### 5.9 SECURITY TEST SUITE
- [ ] Tests 001 - 015 attacking sandbox paths, CVE vulnerabilities, CSP constraints.

### 5.10 FRAMEWORK-SPECIFIC REGRESSION & 5.11 CROSS FRAMEWORKS
- [ ] All 15 Meta Frameworks pass end-to-end dev/build logic test loops.
- [ ] CROSS-001/002/003 tests MFE module boundaries bridging Vue<>React<>Webpack.

---

## REGRESSION GATE & CLEAN-UP (The Final Rule)
- [ ] ALL Pre-existing UI pipelines (Vue, React, Svelte, Lit, Solid) test **GREEN**.
- [ ] `grep -r "wasmtime" packages/ crates/` -> ZERO MATCHES
- [ ] `grep -r "leveldb\|rocksdb" packages/ crates/` -> ZERO MATCHES
- [ ] `grep -r "express" packages/ crates/` -> ZERO MATCHES
- [ ] Final TSC strict run is flawless.
