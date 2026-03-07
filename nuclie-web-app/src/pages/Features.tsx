import React from 'react';
import { Link } from 'react-router-dom';
import {
    Zap,
    ShieldCheck,
    Code2,
    Cpu,
    Activity,
    Palette,
    Package,
    Puzzle,
    TrendingUp,
    CheckCircle2,
    Rocket,
    ArrowRight,
    FileCode,
    Settings,
    Layers,
    Globe
} from 'lucide-react';

const StatusBadge = ({ status, color = 'blue' }: { status: string, color?: string }) => {
    const colorMap: Record<string, string> = {
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        pink: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
        red: 'bg-red-500/10 text-red-500 border-red-500/20',
        violet: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
        teal: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${colorMap[color] || colorMap.blue}`}>
            {status}
        </span>
    );
};

const FeatureItem = ({ name, description, implementation, file, available = true }: {
    name: string,
    description: string,
    implementation: string,
    file: string,
    available?: boolean
}) => (
    <div className={`group relative p-6 rounded-2xl bg-[var(--surface-color)] border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${available ? 'border-[var(--border-color)] hover:border-blue-500/50' : 'border-amber-500/20 opacity-80'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
                    {name}
                </h3>
                {available
                    ? <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                    : <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Experimental</span>
                }
            </div>

            <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed min-h-[40px]">
                {description}
            </p>

            <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border-color)]">
                    <Settings size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-0.5">How it works</div>
                        <div className="text-xs text-[var(--text-secondary)] leading-relaxed">{implementation}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border-color)]">
                    <FileCode size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-0.5">Source</div>
                        <code className="text-xs text-[var(--text-secondary)] font-mono break-all">{file}</code>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const Features: React.FC = () => {
    const features = [
        {
            category: "Core Build Engine",
            icon: Zap,
            tag: "Core",
            color: "blue",
            description: "The actual engine under the hood — what runs when you type nuclie build.",
            items: [
                {
                    name: "Universal Transformer",
                    description: "Transforms TypeScript, JSX, TSX, Vue SFCs, Svelte components, and plain JS/CSS through a single pipeline.",
                    implementation: "SWC-based native transformer with per-file type detection and fallback JS paths",
                    file: "src/core/universal-transformer.ts"
                },
                {
                    name: "Dependency Graph Engine",
                    description: "Builds a module dependency graph with cycle detection, topological sorting, and incremental invalidation.",
                    implementation: "Custom graph built from static import analysis; nodes are content-hashed for cache keys",
                    file: "src/core/graph/"
                },
                {
                    name: "Parallel Chunk Execution",
                    description: "Chunks are grouped into parallel waves and processed concurrently to minimise wall-clock build time.",
                    implementation: "Promise.all over parallelGroups computed by the execution planner",
                    file: "src/core/engine/execute.ts"
                },
                {
                    name: "Incremental Builds",
                    description: "Only chunks whose content hash has changed are rebuilt. Unchanged chunks are served from the in-memory cache.",
                    implementation: "Per-chunk cache keyed on module content hashes, config hash, and plugin pipeline hash",
                    file: "src/core/engine/cache.ts"
                }
            ]
        },
        {
            category: "Development Server",
            icon: Code2,
            tag: "DevServer",
            color: "purple",
            description: "The local dev server — designed for fast feedback during development.",
            items: [
                {
                    name: "Hot Module Replacement (HMR)",
                    description: "Pushes updated modules to the browser over WebSocket without a full page reload.",
                    implementation: "WebSocket server sends module update events; client runtime patches the running module graph",
                    file: "src/dev/devServer.ts"
                },
                {
                    name: "Dependency Pre-bundling",
                    description: "Node_modules are pre-bundled on first start so the browser only fetches a single optimised file per dependency.",
                    implementation: "esbuild-based prebundler that batches all declared deps and caches the output",
                    file: "src/dev/preBundler.ts"
                },
                {
                    name: "Framework Auto-Detection",
                    description: "Nuclie reads your package.json and project structure to pick the right transformer and HMR strategy automatically.",
                    implementation: "Dependency name + file extension heuristics implemented in the detection scanner",
                    file: "src/core/framework-detector.ts"
                },
                {
                    name: "TypeScript Support",
                    description: "TS / TSX files are transpiled on the fly. Type checking is intentionally left to your editor (tsc --noEmit) for speed.",
                    implementation: "SWC strips types at transform time; tsc is only invoked via npm run typecheck",
                    file: "src/core/universal-transformer.ts"
                }
            ]
        },
        {
            category: "CSS & Styling",
            icon: Palette,
            tag: "Styling",
            color: "pink",
            description: "CSS processing built into the core pipeline — no extra config needed for basics.",
            items: [
                {
                    name: "LightningCSS Processing",
                    description: "CSS is parsed and transformed by LightningCSS (Rust-native) for vendor prefixing, syntax lowering, and minification.",
                    implementation: "Native .node binding wraps the LightningCSS library; JS fallback available if native fails",
                    file: "src/core/css/engine.ts"
                },
                {
                    name: "CSS Framework Detection",
                    description: "Automatically detects if your project uses Tailwind CSS, UnoCSS, or plain CSS and applies the right PostCSS pipeline.",
                    implementation: "config file scanning + package.json dependency inspection",
                    file: "src/core/css-framework-detector.ts"
                },
                {
                    name: "Tailwind CSS Integration",
                    description: "Tailwind is processed through the standard PostCSS plugin chain. JIT mode works as configured in your tailwind.config.*.",
                    implementation: "PostCSS pipeline with tailwindcss plugin auto-injected when detected",
                    file: "src/plugins/tailwind.ts"
                },
                {
                    name: "SCSS / Sass",
                    description: "Import .scss files directly. Nuclie compiles them via the sass package if installed in your project.",
                    implementation: "Dynamic import of the sass compiler; gracefully errors if sass is not installed",
                    file: "src/plugins/sass.ts",
                    available: false
                }
            ]
        },
        {
            category: "Module Federation",
            icon: Globe,
            tag: "Federation",
            color: "emerald",
            description: "Built-in support for micro-frontend architectures via module federation.",
            items: [
                {
                    name: "Remote Module Loading",
                    description: "Load UI components from separately deployed apps at runtime — no rebuild required.",
                    implementation: "createFederationPlugin() wraps remoteEntry.js negotiation and exposes a module map",
                    file: "src/plugins/federation_next.ts"
                },
                {
                    name: "Shared Dependency Singleton",
                    description: "Libraries like React can be shared across remotes to avoid loading them twice.",
                    implementation: "Version range matching at runtime; shared map is checked before module download",
                    file: "src/plugins/federation_next.ts"
                },
                {
                    name: "Expose Modules",
                    description: "Any module in your app can be exposed as a federated remote and consumed by another Nuclie app.",
                    implementation: "exposes config key generates a remoteEntry.js with the specified module map",
                    file: "src/plugins/federation_next.ts"
                },
                {
                    name: "Dev-mode Federation",
                    description: "Remotes work in development mode with HMR — changes to a remote propagate to the host without restart.",
                    implementation: "WebSocket federation event bus shared between dev server instances",
                    file: "src/plugins/federation_next.ts",
                    available: false
                }
            ]
        },
        {
            category: "Production Optimisation",
            icon: TrendingUp,
            tag: "Production",
            color: "amber",
            description: "What happens when you run nuclie build.",
            items: [
                {
                    name: "Tree Shaking",
                    description: "Dead code is detected via static export analysis and removed before the final bundle is written.",
                    implementation: "AutoFixEngine.treeShake() analyses each module's exports and prunes unused ones",
                    file: "src/fix/ast-transforms.ts"
                },
                {
                    name: "Minification",
                    description: "JS is minified through the native SWC minifier; CSS through LightningCSS. Falls back to esbuild if native fails.",
                    implementation: "GlobalOptimizer runs minifier in sequence: native → esbuild fallback",
                    file: "src/core/build/globalOptimizer.ts"
                },
                {
                    name: "Code Splitting",
                    description: "Dynamic imports create separate chunk boundaries. Each async import becomes its own bundle file.",
                    implementation: "Async import edges in the dependency graph trigger separate ChunkPlan entries in the planner",
                    file: "src/core/engine/plan.ts"
                },
                {
                    name: "Source Maps",
                    description: "External, inline, or hidden source maps are generated for production bundles.",
                    implementation: "Source map JSON is appended or written as a separate .map file depending on config",
                    file: "src/core/engine/execute.ts"
                }
            ]
        },
        {
            category: "Native Performance",
            icon: Cpu,
            tag: "Native",
            color: "teal",
            description: "Rust-powered native modules that speed up the most expensive operations.",
            items: [
                {
                    name: "Native Hash Functions",
                    description: "Content hashing uses xxHash via a Rust native addon for consistent, collision-resistant, fast IDs.",
                    implementation: "napi-rs binding exposes xxHash64; fallback to Node.js crypto.createHash('sha256')",
                    file: "native/src/lib.rs"
                },
                {
                    name: "SWC Transform",
                    description: "JavaScript and TypeScript are transformed by SWC — a Rust-based JS compiler significantly faster than Babel.",
                    implementation: "swc_core crate with configurable jsx_runtime, target, and decorator support",
                    file: "native/src/transform.rs"
                },
                {
                    name: "LightningCSS Minifier",
                    description: "CSS minification is handled in Rust by LightningCSS rather than a JS postcss plugin.",
                    implementation: "lightningcss crate with PrinterOptions { minify: true }",
                    file: "native/src/transform.rs"
                },
                {
                    name: "JS Fallback",
                    description: "If the native .node binary is unavailable (e.g., unsupported OS or arch), all native operations fall back transparently to JS equivalents.",
                    implementation: "try/catch around native binding import; graceful downgrade to esbuild / crypto",
                    file: "native/index.cjs"
                }
            ]
        },
        {
            category: "Plugin System",
            icon: Puzzle,
            tag: "Plugins",
            color: "violet",
            description: "A simple, hook-based plugin API for extending the build pipeline.",
            items: [
                {
                    name: "load Hook",
                    description: "Override how any module is read. Return { code } to replace file contents before transformation.",
                    implementation: "PluginManager.runHook('load', ...) is called before fs.readFile in the execute stage",
                    file: "src/core/plugins/manager.ts"
                },
                {
                    name: "transform Hook",
                    description: "Process module source code after it is loaded. Return { code } to deliver transformed output.",
                    implementation: "Applied after UniversalTransformer; last plugin wins",
                    file: "src/core/plugins/manager.ts"
                },
                {
                    name: "100+ Bundled Plugin Stubs",
                    description: "Plugin definitions exist for Tailwind, ESLint, Vitest, Playwright, Prisma, Zustand, and many more — ready to be wired up.",
                    implementation: "Type-safe plugin factory functions in src/plugins/implementations/",
                    file: "src/plugins/implementations/"
                },
                {
                    name: "Plugin Compat Layer",
                    description: "A compatibility shim allows most Rollup-style plugins to run inside Nuclie with minimal changes.",
                    implementation: "Rollup hook → Nuclie hook mapping in the compat adapter",
                    file: "src/plugins/compat/rollup.ts"
                }
            ]
        },
        {
            category: "Quality & Testing",
            icon: ShieldCheck,
            tag: "Quality",
            color: "red",
            description: "What we test and how we verify Nuclie works correctly.",
            items: [
                {
                    name: "109 Tests — 14 Suites",
                    description: "Unit, integration, property-based, real-world, and load tests all run on every CI push.",
                    implementation: "Jest with ts-jest; fast-check for property-based tests; Node.js worker load tests",
                    file: "tests/ + src/**/__tests__/"
                },
                {
                    name: "Permission Boundary Enforcement",
                    description: "File system access outside the declared project root is rejected at the engine level.",
                    implementation: "Path traversal checks in PermissionManager before any fs.readFile call",
                    file: "src/core/permissions.ts"
                },
                {
                    name: "Build Determinism",
                    description: "Given identical inputs, Nuclie always produces byte-identical output — verified by snapshot tests.",
                    implementation: "Module sort order + content hash determinism enforced in plan.ts and execute.ts",
                    file: "tests/build/snapshot.test.ts"
                },
                {
                    name: "CLI Health Check",
                    description: "nuclie doctor diagnoses common configuration problems and suggests fixes.",
                    implementation: "Checks for missing entry files, conflicting deps, and native binary availability",
                    file: "src/commands/doctor.ts"
                }
            ]
        }
    ];

    return (
        <div className="animate-in fade-in duration-1000">
            {/* Hero Section */}
            <section className="relative mb-24 pt-20 pb-12 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
                <div className="relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm font-bold mb-8 backdrop-blur-sm">
                        <Rocket size={16} />
                        <span>What Nuclie v1.0 actually ships</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight text-[var(--text-primary)] leading-[1.1] mb-8">
                        Honest
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ml-4">
                            Feature Set
                        </span>
                    </h1>

                    <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed mb-4">
                        Every feature listed here is implemented and ships in v1.0. Items marked <span className="text-amber-500 font-semibold">Experimental</span> exist in code but aren't fully production-validated yet.
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 opacity-70">
                        Source file paths link to actual files in the repository — check for yourself.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                        {features.map((cat, idx) => (
                            <a
                                key={idx}
                                href={`#${cat.tag.toLowerCase()}`}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
                            >
                                <cat.icon size={16} className="text-blue-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{cat.tag}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <div className="space-y-24">
                {features.map((category, idx) => (
                    <section
                        key={idx}
                        id={category.tag.toLowerCase()}
                        className="scroll-mt-32"
                    >
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-4">
                            <div className="flex items-start gap-4">
                                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                                    <category.icon size={32} className="text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black font-display tracking-tight text-[var(--text-primary)] mb-2">
                                        {category.category}
                                    </h2>
                                    <p className="text-lg text-[var(--text-secondary)] max-w-xl">
                                        {category.description}
                                    </p>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <StatusBadge status={`${category.items.length} Features`} color={category.color} />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {category.items.map((feature, featureIdx) => (
                                <FeatureItem
                                    key={featureIdx}
                                    name={feature.name}
                                    description={feature.description}
                                    implementation={feature.implementation}
                                    file={feature.file}
                                    available={'available' in feature ? feature.available : true}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Footer CTA */}
            <section className="py-24 text-center border-t border-[var(--border-color)] mt-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                <div className="relative">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-[var(--text-primary)]">
                        Ready to Build?
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-xl mx-auto mb-12 leading-relaxed">
                        Install Nuclie globally and scaffold your first project in under a minute.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/docs/getting-started"
                            className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 active:scale-95 flex items-center gap-2"
                        >
                            Get Started
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="https://github.com/Avinash-1994/Nuclie"
                            className="px-10 py-5 border-2 border-[var(--border-color)] font-bold rounded-2xl hover:bg-[var(--surface-color)] hover:border-blue-500 transition-all duration-300 active:scale-95 flex items-center gap-2"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Code2 size={20} />
                            View on GitHub
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Features;
