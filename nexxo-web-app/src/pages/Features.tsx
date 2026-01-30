import React from 'react';
import { Link } from 'react-router-dom';
import {
    Zap,
    ShieldCheck,
    Code2,
    Cpu,
    Globe,
    Activity,
    Palette,
    Package,
    Cloud,
    Puzzle,
    TrendingUp,
    CheckCircle2,
    Rocket,
    ArrowRight,
    FileCode,
    Settings,
    Layers
} from 'lucide-react';

const StatusBadge = ({ status, color = 'blue' }: { status: string, color?: string }) => {
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${color}-500/10 text-${color}-500 border border-${color}-500/20 shadow-sm`}>
            {status}
        </span>
    );
};

const FeatureItem = ({ name, description, implementation, file }: { name: string, description: string, implementation: string, file: string }) => (
    <div className="group relative p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
                    {name}
                </h3>
                <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
            </div>

            <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed min-h-[40px]">
                {description}
            </p>

            <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border-color)] group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                    <Settings size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-0.5">Implementation</div>
                        <div className="text-xs text-[var(--text-secondary)] leading-relaxed">{implementation}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border-color)] group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
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
            category: "Core Build System",
            icon: Zap,
            tag: "Core",
            color: "blue",
            description: "The heart of Nexxo, designed for speed and reliability.",
            items: [
                {
                    name: "Universal Framework Support",
                    description: "Single build tool for React, Vue, Svelte, Solid, Angular, Lit, Preact, Qwik, Astro, and more",
                    implementation: "UniversalTransformer with framework-specific adapters using esbuild and SWC",
                    file: "src/core/universal-transformer.ts"
                },
                {
                    name: "Zero-Config Auto-Detection",
                    description: "Automatically detects your framework from package.json and project structure",
                    implementation: "Framework detection via dependency analysis and file patterns",
                    file: "src/core/framework-detector.ts"
                },
                {
                    name: "Incremental Builds",
                    description: "Only rebuild changed modules for lightning-fast development",
                    implementation: "File-level caching with content hashing and dependency tracking",
                    file: "src/core/engine/incremental.ts"
                },
                {
                    name: "Parallel Processing",
                    description: "Multi-threaded builds using Rust-powered native workers",
                    implementation: "Rust native module with worker pool for CPU-intensive tasks",
                    file: "native/src/lib.rs"
                }
            ]
        },
        {
            category: "Development Experience",
            icon: Code2,
            tag: "DevEx",
            color: "purple",
            description: "Features that make developers happy and productive.",
            items: [
                {
                    name: "Hot Module Replacement (HMR)",
                    description: "Instant updates without full page reload for all frameworks",
                    implementation: "WebSocket-based HMR with framework-specific runtime adapters",
                    file: "src/dev/hmr.ts"
                },
                {
                    name: "Dev Server with Middleware",
                    description: "Built-in dev server with proxy, CORS, and custom middleware support",
                    implementation: "Node.js HTTP server with middleware pipeline and WebSocket support",
                    file: "src/dev/devServer.ts"
                },
                {
                    name: "Source Maps",
                    description: "Full source map support for debugging transformed code",
                    implementation: "Inline and external source maps via esbuild and custom transformers",
                    file: "src/core/universal-transformer.ts"
                },
                {
                    name: "TypeScript Support",
                    description: "First-class TypeScript support with type checking",
                    implementation: "TSX loader with optional type checking via tsc",
                    file: "src/core/universal-transformer.ts"
                }
            ]
        },
        {
            category: "CSS & Styling",
            icon: Palette,
            tag: "Styling",
            color: "pink",
            description: "Advanced styling support out of the box.",
            items: [
                {
                    name: "CSS Modules",
                    description: "Scoped CSS with automatic class name hashing",
                    implementation: "PostCSS-based CSS Modules with local scope transformation",
                    file: "src/plugins/css.ts"
                },
                {
                    name: "Tailwind CSS",
                    description: "Built-in Tailwind CSS support with JIT compilation",
                    implementation: "Tailwind plugin with automatic config detection and JIT engine",
                    file: "src/plugins/tailwind.ts"
                },
                {
                    name: "CSS-in-JS",
                    description: "Support for Emotion, Styled-Components, and other CSS-in-JS libraries",
                    implementation: "Framework-agnostic CSS-in-JS bundling with runtime injection",
                    file: "src/plugins/css-in-js.ts"
                },
                {
                    name: "SASS/SCSS",
                    description: "Native SASS/SCSS compilation",
                    implementation: "Sass compiler integration with source maps",
                    file: "src/plugins/sass.ts"
                }
            ]
        },
        {
            category: "Module Federation",
            icon: Globe,
            tag: "Federation",
            color: "emerald",
            description: "Built-in micro-frontend capabilities.",
            items: [
                {
                    name: "Micro-Frontend Architecture",
                    description: "Build and deploy independent micro-frontends",
                    implementation: "Custom module federation runtime with dynamic remote loading",
                    file: "src/runtime/federation.js"
                },
                {
                    name: "Shared Dependencies",
                    description: "Share common dependencies across micro-frontends",
                    implementation: "Dependency deduplication with version resolution and singleton enforcement",
                    file: "src/federation/shared.ts"
                },
                {
                    name: "Hot Federation",
                    description: "HMR support for federated modules",
                    implementation: "WebSocket-based federation updates with runtime module replacement",
                    file: "src/dev/hotFederation.ts"
                },
                {
                    name: "Framework-Agnostic Federation",
                    description: "Mix React, Vue, Svelte, and other frameworks in the same app",
                    implementation: "Universal module wrapper with framework-specific adapters",
                    file: "src/federation/universal.ts"
                }
            ]
        },
        {
            category: "Production Optimization",
            icon: TrendingUp,
            tag: "Production",
            color: "amber",
            description: "Optimize your bundles for maximum performance.",
            items: [
                {
                    name: "Tree Shaking",
                    description: "Remove unused code for smaller bundles",
                    implementation: "ESM-based tree shaking via esbuild with dead code elimination",
                    file: "src/core/engine/bundler.ts"
                },
                {
                    name: "Code Splitting",
                    description: "Automatic code splitting with dynamic imports",
                    implementation: "Chunk graph analysis with optimal splitting strategy",
                    file: "src/core/engine/splitter.ts"
                },
                {
                    name: "Minification",
                    description: "Advanced minification with terser and esbuild",
                    implementation: "Multi-pass minification with identifier mangling and compression",
                    file: "src/core/engine/minifier.ts"
                },
                {
                    name: "Asset Optimization",
                    description: "Image optimization, font subsetting, and asset compression",
                    implementation: "Sharp-based image optimization with WebP conversion and lazy loading",
                    file: "src/plugins/assets.ts"
                }
            ]
        },
        {
            category: "Developer Tools",
            icon: Activity,
            tag: "Tools",
            color: "cyan",
            description: "Visualizers and metrics to understand your build.",
            items: [
                {
                    name: "Dependency Graph Visualization",
                    description: "Interactive visualization of your project's dependency graph",
                    implementation: "D3.js-based graph rendering with real-time updates",
                    file: "src/visual/graph-ui.ts"
                },
                {
                    name: "Bundle Analyzer",
                    description: "Analyze bundle size and composition",
                    implementation: "Treemap visualization with size breakdown and optimization suggestions",
                    file: "src/visual/bundle-analyzer.ts"
                },
                {
                    name: "Performance Metrics",
                    description: "Track build times, bundle sizes, and HMR performance",
                    implementation: "Performance API integration with historical tracking",
                    file: "src/dev/metrics.ts"
                }
            ]
        },
        {
            category: "Quality & Governance",
            icon: ShieldCheck,
            tag: "Quality",
            color: "red",
            description: "Ensure code quality and security standards.",
            items: [
                {
                    name: "Built-in Linting",
                    description: "ESLint integration with framework-specific rules",
                    implementation: "Custom ESLint plugin with governance rules",
                    file: "eslint-plugin-nexxo-governance/index.js"
                },
                {
                    name: "Accessibility Audits",
                    description: "Automatic accessibility checking during builds",
                    implementation: "axe-core integration with HTML parsing and ARIA validation",
                    file: "src/plugins/a11y.ts"
                },
                {
                    name: "Security Scanning",
                    description: "Dependency vulnerability scanning",
                    implementation: "npm audit integration with SNYK API for advanced scanning",
                    file: "src/security/scanner.ts"
                },
                {
                    name: "Governance Rules",
                    description: "Enforce architectural boundaries and best practices",
                    implementation: "Custom rule engine with import restrictions and pattern enforcement",
                    file: "src/governance/rules.ts"
                }
            ]
        },
        {
            category: "Cloud & Deployment",
            icon: Cloud,
            tag: "Cloud",
            color: "indigo",
            description: "Deploy to any platform with ease.",
            items: [
                {
                    name: "Edge Deployment",
                    description: "Deploy to Cloudflare Workers, Vercel Edge, and more",
                    implementation: "Platform-specific adapters with automatic code transformation",
                    file: "src/deploy/edge.ts"
                },
                {
                    name: "SSR/SSG Support",
                    description: "Server-side rendering and static site generation",
                    implementation: "Framework-specific SSR adapters with hydration support",
                    file: "src/ssr/renderer.ts"
                },
                {
                    name: "CDN Integration",
                    description: "Automatic asset upload to CDN",
                    implementation: "S3-compatible storage with CloudFront invalidation",
                    file: "src/deploy/cdn.ts"
                },
                {
                    name: "Docker Support",
                    description: "Generate optimized Docker images",
                    implementation: "Multi-stage Dockerfile generation with layer caching",
                    file: "src/deploy/docker.ts"
                }
            ]
        },
        {
            category: "Plugin System",
            icon: Puzzle,
            tag: "Plugins",
            color: "violet",
            description: "Extensible architecture for custom needs.",
            items: [
                {
                    name: "Custom Plugins",
                    description: "Extend Nexxo with custom transformations and hooks",
                    implementation: "Plugin API with lifecycle hooks and transform pipeline",
                    file: "src/plugins/plugin-api.ts"
                },
                {
                    name: "Plugin Marketplace",
                    description: "Discover and install community plugins",
                    implementation: "NPM-based plugin registry with version management",
                    file: "marketplace/index.ts"
                },
                {
                    name: "Framework Adapters",
                    description: "Add support for new frameworks via adapters",
                    implementation: "Adapter API with framework detection and transformation hooks",
                    file: "src/adapters/adapter-api.ts"
                }
            ]
        },
        {
            category: "Advanced Features",
            icon: Cpu,
            tag: "Advanced",
            color: "teal",
            description: "For complex enterprise requirements.",
            items: [
                {
                    name: "Monorepo Support",
                    description: "Build multiple packages in a monorepo efficiently",
                    implementation: "Workspace detection with shared cache and parallel builds",
                    file: "src/core/workspace.ts"
                },
                {
                    name: "Pre-bundling",
                    description: "Pre-bundle dependencies for faster dev server startup",
                    implementation: "Dependency analysis with esbuild-based pre-bundling and caching",
                    file: "src/dev/prebundle.ts"
                },
                {
                    name: "Watch Mode",
                    description: "Intelligent file watching with debouncing",
                    implementation: "Chokidar-based file watcher with change detection and rebuild queue",
                    file: "src/dev/watcher.ts"
                },
                {
                    name: "Environment Variables",
                    description: "Dotenv support with mode-specific files",
                    implementation: "Dotenv parsing with mode resolution and build-time replacement",
                    file: "src/config/env.ts"
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
                        <span>{features.reduce((acc, cat) => acc + cat.items.length, 0)} Production-Ready Features</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight text-[var(--text-primary)] leading-[1.1] mb-8">
                        Complete
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ml-4">
                            Feature Set
                        </span>
                    </h1>

                    <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed mb-12">
                        Everything you need for modern web development, from zero-config builds to production deployment.
                        Designed to scale from hobby projects to enterprise monorepos.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                        {features.map((cat, idx) => (
                            <a
                                key={idx}
                                href={`#${cat.tag.toLowerCase()}`}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
                            >
                                <cat.icon size={16} className={`text-${cat.color}-500 group-hover:scale-110 transition-transform`} />
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
                                <div className={`p-4 rounded-2xl bg-${category.color}-500/10 border border-${category.color}-500/20 shadow-lg shadow-${category.color}-500/10`}>
                                    <category.icon size={32} className={`text-${category.color}-500`} />
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

                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {category.items.map((feature, featureIdx) => (
                                <FeatureItem
                                    key={featureIdx}
                                    name={feature.name}
                                    description={feature.description}
                                    implementation={feature.implementation}
                                    file={feature.file}
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
                        Get started in seconds with zero configuration and production-grade features out of the box.
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
                            href="https://github.com/Avinash-1994/nexxo"
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
