╔══════════════════════════════════════════════════════════════════╗
║  SPARX — MASTER BUILD PROMPT v1.0                                ║
║  Status: PUBLISHED & LIVE. All frameworks + MFE working.         ║
║  Goal:   Make Sparx the best build tool ever built.              ║
╚══════════════════════════════════════════════════════════════════╝

GOLDEN RULE — READ BEFORE TOUCHING ANYTHING
─────────────────────────────────────────────
Sparx is already published and used in production. Every framework
adaptor (Vue, Svelte, React, Lit, Solid) and the full MFE orchestration
pipeline are working and must remain working after every phase.

Before writing a single line of code, internalize these constraints:

  1. NEVER modify the public plugin hook surface
     (buildStart, resolveId, load, transform, moduleParsed, buildEnd,
     generateBundle, writeBundle, configResolved, configureServer,
     handleHotUpdate, transformIndexHtml). Shape, arguments, and
     return types are frozen. Existing Vite/Rollup plugins must
     continue to work unchanged.

  2. NEVER modify the public sparx.config.ts schema for existing keys.
     You may ADD new optional keys. You may never rename, remove, or
     change the type of any existing key. All new config keys must
     default to values that reproduce current behaviour when omitted.

  3. NEVER remove or rename any N-API export that is currently
     documented. You may add new exports. Removing one breaks every
     published user who calls it.

  4. NEVER change output file naming, chunk structure, manifest.json
     format, or import map shape unless behind an explicit opt-in flag.
     Users have deploy pipelines built against the current output.

  5. Every phase must pass the regression gate before moving to the
     next phase (see REGRESSION GATE at the bottom). Do not skip it.

  6. Deprecations over deletions. If something must eventually go,
     emit a console.warn() with a migration guide URL pointing to
     https://sparx.dev/migrate — never a silent removal.

Treat any change to an existing public surface as a breaking change
requiring a semver major bump and explicit sign-off. Everything below
is additive unless marked [SAFE REMOVAL] with justification.

══════════════════════════════════════════════════════════════════════
 PHASE 1 — SAFE REMOVALS  (internal implementation only, not public)
══════════════════════════════════════════════════════════════════════

Both of these are internal implementation details with no public API
surface. Confirmed safe to remove.

1.1  [DONE] Wasmtime plugin sandbox
     Justification: No production build tool (Vite, esbuild, Turbopack,
     Parcel) uses a WASM sandbox for plugins. It adds 20MB+ to the
     binary, restricts plugin capabilities, and solves a problem that
     doesn't exist. The plugin runner already has a better model via
     napi-rs in Node.js.

     • Delete crates/sparx_native/src/wasmtime.rs and its module.       ✅
     • Remove `wasmtime` and `wasmtime-wasi` from Cargo.toml.           ✅
     • Remove all internal calls to WasmPluginRunner::execute().         ✅
     • Plugins that previously routed through Wasmtime now call the
       existing Node.js plugin hook pipeline directly. No API change.   ✅
     • In sparx.config.ts validator: if a plugin's `main` resolves
       to a .wasm file, throw a descriptive error:
       "Sparx no longer supports WASM plugins. Please use a JS/TS
       plugin entry point. See https://sparx.dev/migrate#wasm-plugins"  ✅
     • Update internal docs only. No public changelog needed since
       WASM plugins were never in the public docs.

1.2  [DONE] LevelDB / RocksDB persistence backend
     Justification: Running LevelDB alongside SQLite is redundant.
     SQLite ships as a single file, is trivial to inspect, zero
     native compilation issues on Windows, and handles both artifact
     and graph caching with WAL mode at comparable throughput.

     • Delete crates/sparx_native/src/cache/leveldb.rs.                 ✅
     • Remove `rocksdb` and `leveldb` from Cargo.toml.                  ✅
     • Remove CacheBackend::LevelDB and CacheBackend::RocksDB enum
       variants from cache_manager.rs.                                   ✅
     • All cache reads/writes route through the SQLite backend only
       (see Phase 2.4 for schema extension).                             ✅
     • Grep for any config keys, CLI flags, or env vars referencing
       "leveldb" or "rocksdb" — emit a deprecation warning on each,
       then ignore the value silently (do not error, someone may have
       it in their CI env).                                              ✅

══════════════════════════════════════════════════════════════════════
 PHASE 2 — INTERNAL MODIFICATIONS  (zero public API change)
══════════════════════════════════════════════════════════════════════

All changes in this phase are to internal implementation only.
The public surface — config schema, CLI flags, N-API exports,
plugin hooks — must be identical before and after.

2.1  [DONE] Replace Express with uWebSockets.js
     Risk level: LOW — internal server plumbing, no public API.

     • Uninstall `express` and `@types/express`.                         ✅
     • Install `uWebSockets.js` (npm: github:uNetworking/uWebSockets.js). ✅
     • Rewrite src/meta-frameworks/ssr/server.ts:                        ✅
       - Replace express() with uWS.App().
       - Port all existing middleware to uWS app handlers using a thin
         shim so the existing DevServerPlugin hook surface is unchanged.
       - Migrate HMR WebSocket to uWS.App().ws() sharing one port.
     • The DevServerPlugin hook object exposed to user plugins must
       be byte-identical in shape. Do not rename any property.
     • Regression check: run the existing dev server integration test
       suite before moving on. All tests must pass.

2.2  [DONE] Hoist LightningCSS to peer of SWC
     Risk level: LOW — internal Rust module graph only.

     • In crates/sparx_native/src/lib.rs, move mod lightning_css
       out from under mod swc_pipeline and make it a sibling module.
     • Both swc_pipeline and lightning_css are called independently
       by the orchestrator. Neither calls the other.
     • N-API surface: add two new exports (additive, not replacing):
         transformCss(source: string, opts: CssOptions): TransformResult
         transformJs(source: string, opts: JsOptions): TransformResult
       The existing combined transform() export must remain and must
       continue to call both internally in the same order as before.
     • Cargo.toml: ensure lightningcss feature is not gated behind
       the swc feature flag.

2.3  [DONE] Constrain plugin runner to JS/TS hooks only
     Risk level: NONE — Wasmtime already removed in Phase 1.

     • Remove any remaining .wasm load paths in
       src/plugins/registry.ts and plugin runner files.
     • Add startup validation: if plugin main resolves to .wasm,
       throw the descriptive error from Phase 1.1.
     • Hook lifecycle (buildStart, transform, buildEnd,
       handleHotUpdate) is completely unchanged.

2.4  [DONE] Extend SQLite cache schema to replace LevelDB
     Risk level: LOW — internal storage, no public API.

     • In crates/sparx_native/src/cache.rs, extend the main cache
       table with a cache_type TEXT column to hold both artifact
       entries (previously SQLite) and dependency-graph edge entries
       (previously LevelDB/RocksDB).                                     ✅
     • Use WAL journal mode: PRAGMA journal_mode=WAL;                    ✅
     • Use PRAGMA synchronous=NORMAL; for write throughput parity.      ✅
     • DB location: <project_root>/.sparx_cache/cache.db (unchanged).
     • Migration: on first startup after this change, if an old
       LevelDB/RocksDB directory is detected, read its entries, import
       them into SQLite, then rename the directory to *.migrated/
       (do not delete). Print one INFO line to stderr about migration.  ✅

══════════════════════════════════════════════════════════════════════
 PHASE 3 — ADDITIVE FEATURES  (new packages and crates only)
══════════════════════════════════════════════════════════════════════

All items in this phase are purely additive — new files, new packages,
new crates. Nothing existing is modified except to wire in a new call
at the end of an existing pipeline step.

3.1  [DONE] Chunker + DCE (tree shaking) — Rust
     Create crates/sparx_native/src/chunker.rs.
     • chunk(graph: &DependencyGraph, config: ChunkerConfig) -> Vec<Chunk>
       - Walk the resolved dependency graph from entry points.
       - DCE: mark unreachable exports via reachability traversal.
       - Split live module set into chunks per ChunkerConfig
         { strategy: Manual | Auto, max_chunk_size_kb }.
       - Each Chunk carries member module IDs, resolved import map,
         and a stable content hash.
     • N-API export (new, additive): sparxChunk(graphJson, config)
     • Wire into orchestrator after resolve_graph() and before
       transform(). Existing single-file output is default.

3.2  [DONE] Source map merger — Rust
     Create crates/sparx_native/src/sourcemap_merger.rs.
     • merge_sourcemaps(maps: Vec<SourceMap>) -> SourceMap
       Correctly composes N maps from SWC + LightningCSS into one.
     • Use the sourcemap crate for VLQ encoding (add to Cargo.toml).
     • N-API export (new): mergeSourceMaps(maps: string[]): string
     • Wire after all transform stages, before writing dist output.

3.3  [DONE] Native FS watcher — Rust
     Create crates/sparx_native/src/watcher.rs.
     • Use the notify crate (add to Cargo.toml).
     • Watcher struct: start(paths, tx) debounces at 50ms. stop().
     • N-API: startWatcher(paths) + onWatchEvent(callback).
     • Replace chokidar usage in the dev server with the native watcher.
       Keep chokidar as a fallback if native module fails to load.       ✅

3.4  [DONE] HMR client runtime — Browser
     Create packages/sparx-hmr-client/src/index.ts.
     • Runs in the browser. Zero external dependencies.
     • Opens WebSocket to dev server HMR endpoint.
     • On { type: 'update', modules: string[] }: re-import each module
       with cache-busting query param ?t=<timestamp>.
     • On CSS-only updates: swap <link> hrefs directly, no reload.
     • On { type: 'full-reload' }: location.reload().
     • Bundle as ES module. Output: dist/hmr-client.js (< 5KB target).

3.5  [DONE] Module registry — Browser
     Create packages/sparx-module-registry/src/index.ts.
     • register(scope, url), load(scope, module), invalidate(scope).
     • Lightweight browser-side MFE remote map.

3.6  [DONE] SSR runner — Node.js
     Create packages/sparx-ssr/src/runner.ts.
     • renderToString(entryPath, context) -> { html, head, state }
     • Uses Node.js vm.Module for isolated context execution.
     • Framework-agnostic.
     • Dev server: when a route has ssr: true in sparx.config.ts,
       pipe through renderToString before sending the response.          ✅

3.7  [DONE] Pre-bundle cache — Persistence
     Create crates/sparx_native/src/cache/prebundle.rs.
     • Caches pre-bundled node_modules imports.
       Location: .sparx_cache/deps/
     • Key: SHA-256(package version + all transitive dep versions).
     • N-API export (new): prebundle(modules: string[])

══════════════════════════════════════════════════════════════════════
 PHASE 4 — COMPETITIVE SUPERIORITY
 Goal: beat Vite, Turbopack, Webpack, esbuild, Rspack on every axis.
══════════════════════════════════════════════════════════════════════

4.1  [DONE] Incremental task graph — beats Turbopack's core model
     Create crates/sparx_native/src/task_graph.rs.
     • Task { id, inputs: Vec<FileHash>, outputs: Vec<ArtifactKey>,
       fn_hash: u64 }
     • fn_hash = hash of transform function version (SWC version +
       config hash + LightningCSS version). Dep upgrade = auto-invalidate.
     • N-API export (new): planBuild(manifest): TaskPlan

4.2  [DONE] Remote cache — the feature that beats Turbopack's moat
     Create packages/sparx-remote-cache/src/index.ts.
     • Interface: RemoteCacheProvider {
         get(key: string): Promise<Buffer|null>
         put(key: string, data: Buffer): Promise<void>
       }
     • Ship two providers: S3Provider + SparxCloudProvider.
     • Add to sparx.config.ts (new optional key):
       cache?: {
         remote?: {
           provider: 's3' | 'sparx-cloud' | false
           bucket?: string
           token?: string
           readOnly?: boolean
         }
       }

4.3  [DONE] Rollup/Vite plugin compatibility — beats Vite's ecosystem moat
     Ensure exact implementation of every Rollup v4 and Vite 5 hook.
     Compatibility test suite must all pass:
       vite-plugin-vue, vite-plugin-svelte, @vitejs/plugin-react,
       vite-plugin-checker, vite-plugin-pwa,
       unplugin-auto-import, unplugin-vue-components

4.4  [DONE] PostCSS passthrough — required for Tailwind v4 support
     After LightningCSS transform, check for postcss.config.js.
     Order: LightningCSS → PostCSS → output.

4.5  [DONE] Production output parity with Rollup
     Implement packages/sparx-build/src/html-injector.ts.
     Add CLI flag --compat-rollup for byte-identical Vite output format.

4.6  [DONE] Module Federation 2.0
     Shared scope conflict resolution, Type federation, Dev-time remote mocking.

4.7  [DONE] Zero-config auto-detection
     Create packages/sparx-autoconfig/src/detect.ts.
     Detection order: package.json deps → index.html → monorepo detect → tsconfig.

4.8  [DONE] First-class monorepo support
     Create packages/sparx-workspace/src/index.ts.
     Cross-package HMR propagation, topological build order.

══════════════════════════════════════════════════════════════════════
 PHASE 5 — DX DETAILS THAT COMPOUND INTO DOMINANCE
══════════════════════════════════════════════════════════════════════

5.1  [DONE] Startup diagnostics
     Print structured timing breakdown to stderr after server starts.
     Highlight phases > 1000ms with [slow].

5.2  [DONE] Error overlay (surpasses Vite's)
     Create packages/sparx-error-overlay/src/index.ts (browser module).
     Full-screen overlay with original source (not compiled), copy button,
     "Open in editor" deep-link: vscode://file/{path}:{line}

5.3  [DONE] Built-in bundle analyser
     sparx build --analyze opens interactive treemap in browser.
     Data from chunker output directly — zero re-analysis pass.

5.4  [DONE] sparx why <module-path>
     Prints full import chain from entry to target module.
     Exit 0 if reachable. Exit 1 if not found.

5.5  [DONE] sparx check — pre-build validation CI command
     Runs full resolve + type-check without emitting output files.
     TypeScript, circular imports, MFE version conflicts.

5.6  [DONE] sparx migrate — automated upgrade assistant
     Create packages/sparx-migrate/src/index.ts.
     Detects deprecated config keys, proposes a diff, asks confirmation.

══════════════════════════════════════════════════════════════════════
 REGRESSION GATE — must pass after EVERY phase before proceeding
══════════════════════════════════════════════════════════════════════

Run this full gate after each numbered phase. Do not proceed to the
next phase until every line is green.

BUILD
  cargo build --release                              PASS
  pnpm -r build                                      PASS

EXISTING FRAMEWORK REGRESSION (these are already working — keep them)
  e2e/fixtures/vue-basic          dev + build        PASS
  e2e/fixtures/svelte-basic       dev + build        PASS
  e2e/fixtures/react-basic        dev + build        PASS
  e2e/fixtures/lit-basic          dev + build        PASS
  e2e/fixtures/solid-basic        dev + build        PASS

EXISTING MFE REGRESSION (already working — keep it)
  e2e/fixtures/mfe-shell-remote   dev + build        PASS
  e2e/fixtures/mfe-shared-scope   version resolve    PASS

PLUGIN COMPATIBILITY
  vite-plugin-vue                                    PASS
  vite-plugin-svelte                                 PASS
  @vitejs/plugin-react                               PASS
  vite-plugin-checker                                PASS

ZERO-CONFIG SMOKE
  e2e/fixtures/zero-config-vue                       PASS
  e2e/fixtures/zero-config-react                     PASS
  e2e/fixtures/zero-config-svelte                    PASS

CLEAN-UP VERIFICATION
  grep -r "wasmtime" packages/ crates/               ZERO MATCHES
  grep -r "leveldb\|rocksdb" packages/ crates/       ZERO MATCHES
  grep -r "express" packages/ crates/                ZERO MATCHES

PERFORMANCE TARGETS (reference: 1000-module mixed monorepo)
  Cold dev start (pre-bundle warm)                   < 400ms
  HMR round-trip (1 .vue SFC change)                 < 60ms
  Production build                                   < 8s
  Remote cache replay (nothing changed)              < 800ms

══════════════════════════════════════════════════════════════════════
 VERSIONING RULES
══════════════════════════════════════════════════════════════════════

Phase 1+2 (removals + internal modifications):  PATCH bump (x.x.+1)
  → No public API change. Safe for all existing users to auto-update.

Phase 3 (additive features):                    MINOR bump (x.+1.0)
  → New capabilities, all opt-in. No existing behaviour changes.

Phase 4+5 (competitive + DX):                   MINOR bump (x.+1.0)
  → All additive. --compat-rollup and --analyze are new flags.

Any unintended public API surface change:        MAJOR bump (+1.0.0)
  → Requires explicit sign-off before shipping.

══════════════════════════════════════════════════════════════════════
 END OF PROMPT
══════════════════════════════════════════════════════════════════════
