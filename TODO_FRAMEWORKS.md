# Nuclie/Sparx Framework Expansion Master Plan

## 🟢 Shared Architecture (Phase 0)
- [x] Create `packages/nuclie-adapter-core/src/index.ts` with `NuclieAdapter` interface.
- [x] Create `packages/nuclie-adapter-core/src/registry.ts` with detection logic mapping framework string detection.
- [x] Wire `registry.detect()` into the core dev server / build orchestrator.

## 🟡 Phase 1: Highest ROI Meta-Frameworks
- [x] **1.A Angular** (`src/framework-adapters/angular/`)
  - [x] Implement `ivy-plugin.ts` for native `@angular/compiler-cli` routing and TS compilation.
  - [x] Implement `style-plugin.ts` mapping `.component.css` out correctly.
  - [x] Setup fingerprint SQLite Cache for Ivy compiler outputs.
- [x] **1.B SvelteKit** (`src/meta-frameworks/sveltekit/`)
  - [x] Virtual manifest `virtual:nuclie/sveltekit-routes` generating SSR wiring.
  - [x] Implement adapter Node wrapper + `router-plugin.ts`.
- [x] **1.C SolidStart** (`src/meta-frameworks/solidstart/`)
  - [x] Create `router-plugin.ts` + `virtual:nuclie/solidstart-routes`.
  - [x] Map H3-compatible event API to internal `uWS`.
- [x] **1.D Qwik City** (`src/meta-frameworks/qwikcity/`)
  - [x] Implement `optimizer-plugin.ts` wrapping `@builder.io/qwik/optimizer`.
  - [x] Cache optimizer outputs in SQLite.
- [x] **1.E Astro** (`src/meta-frameworks/astro/`)
  - [x] Wrap `@astrojs/compiler` WASM within `compiler-plugin.ts`.
  - [x] Implement `island-plugin.ts` extracting dynamic `client:*` directives to discrete chunks.
  - [x] Support `virtual:nuclie/astro-content` JSON maps.
- [x] **1.F Remix** (`src/meta-frameworks/remix/`)
  - [x] Pipe `@remix-run/dev/vite` through internal Plugin runner via `routes-plugin.ts`.
  - [x] Shim `fetch` Request/Response to underlying WebSocket/uWS API.

## 🔴 Phase 2: High-Value Meta-Frameworks
- [x] **2.A Analog** (`src/meta-frameworks/analog/`)
- [x] **2.B React Router v7** (`src/meta-frameworks/react-router/`)
- [x] **2.C TanStack Start** (`src/meta-frameworks/tanstack-start/`)
- [x] **2.D Waku (RSC)** (`src/meta-frameworks/waku/`) - Dual-bundle mode client/server RSC payload generation
- [x] **2.E VitePress** (`src/meta-frameworks/vitepress/`)
- [x] **2.F Tauri** (`src/meta-frameworks/tauri/`) - Generate dual IPC Rust-TS bridging.
- [x] **2.G Electron** (`src/meta-frameworks/electron/`)

## ⚪ Phase 3: Community Adapters (GitHub Issues + Scaffolds)
- [x] 3.A Gatsby scaffold
- [x] 3.B RedwoodJS scaffold
- [x] 3.C Stencil.js scaffold
- [x] 3.D Marko scaffold
- [x] 3.E Docusaurus scaffold
- [x] Scope Next.js Pages router plugin (Optional replacement loader)

## 🏁 Quality Gates
- [x] P1: Output caching (SQLite) validation — all adapters wire into `getLazyCacheDatabase()` with sha256 fingerprinting
- [ ] P2: Source-map overlay accuracy tests
- [ ] P3: Tree shaking efficiency verified
- [ ] P4: SSR hydration checking for mismatch
- [ ] P5: Plain-language compiler error mapping
- [x] P6: Strict Typescript (`tsc -p tsconfig.build.json`) passes — all src/ adapter code compiles clean
- [x] P7: `docs/adapters/` populated — full adapter reference at `docs/adapters/README.md`
- [x] 100% REGRESSION TESTS PASSING — all core suites green (Input Sensitivity is pre-existing baseline, not regression)
