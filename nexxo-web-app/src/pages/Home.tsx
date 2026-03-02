import React from 'react';
import {
    Zap,
    ShieldCheck,
    Box,
    Code2,
    Terminal,
    Cpu,
    Globe,
    Activity,
    CheckCircle2,
    Layers,
    Rocket,
    Copy,
    TrendingUp,
    Package,
    GitBranch,
    Sparkles,
    ArrowRight,
    FileCode,
    Gauge,
    Blocks,
    Workflow,
    Lock,
    Repeat
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CodeBlock = ({ code, language = 'bash' }: { code: string, language?: string }) => {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3 bg-slate-800/80 border-b border-slate-700/50 backdrop-blur-sm">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50" />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">{language}</span>
                    <button
                        onClick={copyToClipboard}
                        className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-slate-700/50 rounded-lg"
                        title="Copy to clipboard"
                    >
                        {copied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                </div>
            </div>
            <pre className="p-6 text-sm font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, details, gradient }: {
    icon: any,
    title: string,
    description: string,
    details?: string[],
    gradient: string
}) => (
    <div className="group relative p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
        <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
        <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">{title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{description}</p>
            {details && (
                <ul className="space-y-1.5">
                    {details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
);

export const Home: React.FC = () => {
    return (
        <div className="animate-in fade-in duration-1000">
            {/* Hero Section with Gradient Background */}
            <section className="relative mb-24 pt-16 pb-12 overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative text-center max-w-5xl mx-auto px-4">
                    {/* Version Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold mb-6 backdrop-blur-sm animate-in slide-in-from-top duration-700">
                        <Sparkles size={16} className="animate-pulse" />
                        <span>v1.0 • Production Ready • 109 Tests Passing</span>
                    </div>

                    {/* Main Headline - Reduced size */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.1] mb-4 animate-in slide-in-from-bottom duration-700 delay-100">
                        Next Generation
                        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Build Tool
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed mb-10 animate-in slide-in-from-bottom duration-700 delay-200">
                        A high-performance build tool with <span className="text-blue-500 font-semibold">69ms cold starts</span>,
                        instant HMR, universal framework support, and enterprise-grade features.
                        Built for modern web development.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12 animate-in slide-in-from-bottom duration-700 delay-300">
                        <Link
                            to="/docs/getting-started"
                            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center gap-2"
                        >
                            Get Started
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="https://github.com/Avinash-1994/nexxo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 border-2 border-[var(--border-color)] font-bold rounded-2xl hover:bg-[var(--surface-color)] hover:border-blue-500 transition-all duration-300 active:scale-95 flex items-center gap-2"
                        >
                            <GitBranch size={18} />
                            View on GitHub
                        </a>
                    </div>

                    {/* Quick Install */}
                    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom duration-700 delay-400">
                        <CodeBlock code={`npm install -g nexxo
nexxo bootstrap --name my-app --template react-ts
cd my-app && nexxo dev`} />
                    </div>
                </div>
            </section>

            {/* Performance Metrics */}
            <section className="mb-24">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-black mb-3 text-[var(--text-primary)]">
                        Performance That Speaks
                    </h2>
                    <p className="text-base text-[var(--text-secondary)]">Real metrics from production applications</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            label: 'Cold Start',
                            value: '69ms',
                            icon: Zap,
                            gradient: 'from-yellow-400 to-orange-500',
                            description: 'Instant dev server'
                        },
                        {
                            label: 'HMR Speed',
                            value: '10-60ms',
                            icon: Activity,
                            gradient: 'from-emerald-400 to-teal-500',
                            description: 'Lightning updates'
                        },
                        {
                            label: 'Tests Passing',
                            value: '109',
                            icon: CheckCircle2,
                            gradient: 'from-green-400 to-emerald-500',
                            description: '14 test suites'
                        },
                        {
                            label: 'Bundle Size',
                            value: '6.9KB',
                            icon: Package,
                            gradient: 'from-purple-400 to-pink-500',
                            description: 'Optimized output'
                        },
                    ].map(metric => (
                        <div
                            key={metric.label}
                            className="group relative p-6 rounded-3xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                    <metric.icon size={24} className="text-white" />
                                </div>
                                <div className="text-3xl font-black mb-2 text-[var(--text-primary)]">{metric.value}</div>
                                <div className="text-sm font-semibold text-[var(--text-secondary)] mb-1">{metric.label}</div>
                                <div className="text-xs text-[var(--text-secondary)] opacity-70">{metric.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Features - Detailed */}
            <section className="mb-24">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-black mb-3 text-[var(--text-primary)]">
                        Core Features
                    </h2>
                    <p className="text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Everything you need for modern web development, built-in and optimized
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={Zap}
                        title="Lightning Fast Dev Server"
                        description="Native ESM-based development server with instant startup and HMR."
                        details={[
                            '69ms cold start time',
                            'No bundling during development',
                            'Instant server-side transformations',
                            'Smart dependency pre-bundling'
                        ]}
                        gradient="bg-gradient-to-br from-yellow-400 to-orange-500"
                    />
                    <FeatureCard
                        icon={Rocket}
                        title="Hot Module Replacement"
                        description="Blazing fast HMR that stays fast regardless of application size."
                        details={[
                            '10-60ms update speed',
                            'Preserves application state',
                            'Framework-aware updates',
                            'Automatic error recovery'
                        ]}
                        gradient="bg-gradient-to-br from-blue-400 to-cyan-500"
                    />
                    <FeatureCard
                        icon={Code2}
                        title="Universal Transformer"
                        description="Single transformer supporting all major frameworks and file types."
                        details={[
                            'React, Vue, Svelte, Angular',
                            'Solid, Preact, Qwik, Lit',
                            'TypeScript, JSX, TSX',
                            'CSS, SCSS, PostCSS'
                        ]}
                        gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
                    />
                    <FeatureCard
                        icon={Box}
                        title="Optimized Production Builds"
                        description="Highly optimized bundles with automatic code splitting and tree-shaking."
                        details={[
                            'Rollup-based bundling',
                            'Automatic code splitting',
                            'Tree-shaking & minification',
                            'Source map generation'
                        ]}
                        gradient="bg-gradient-to-br from-purple-400 to-pink-500"
                    />
                    <FeatureCard
                        icon={Layers}
                        title="Module Federation"
                        description="Native support for micro-frontends with built-in Module Federation."
                        details={[
                            'Share dependencies across apps',
                            'Dynamic remote loading',
                            'Version management',
                            'Runtime module sharing'
                        ]}
                        gradient="bg-gradient-to-br from-indigo-400 to-purple-500"
                    />
                    <FeatureCard
                        icon={Cpu}
                        title="Native Performance"
                        description="Rust-powered native modules for maximum performance."
                        details={[
                            'Native hash functions',
                            'Fast file processing',
                            'RocksDB caching',
                            'Automatic JS fallback'
                        ]}
                        gradient="bg-gradient-to-br from-red-400 to-orange-500"
                    />
                    <FeatureCard
                        icon={Gauge}
                        title="Smart Caching"
                        description="Persistent caching with RocksDB for instant rebuilds."
                        details={[
                            'Persistent disk cache',
                            'Dependency graph caching',
                            'Transform result caching',
                            'Incremental builds'
                        ]}
                        gradient="bg-gradient-to-br from-cyan-400 to-blue-500"
                    />
                    <FeatureCard
                        icon={Workflow}
                        title="Plugin System"
                        description="Extensible plugin architecture with WASM sandboxing."
                        details={[
                            'WASM-sandboxed plugins',
                            'Hook-based API',
                            'Transform & resolve hooks',
                            'Build lifecycle control'
                        ]}
                        gradient="bg-gradient-to-br from-pink-400 to-rose-500"
                    />
                    <FeatureCard
                        icon={ShieldCheck}
                        title="Production Ready"
                        description="Tested with a comprehensive suite covering core engine, federation, caching, CSS, and more."
                        details={[
                            '109 tests passing',
                            '14 test suites',
                            'Property-based tests included',
                            'Load & stress tests included'
                        ]}
                        gradient="bg-gradient-to-br from-green-400 to-emerald-500"
                    />
                </div>
            </section>

            {/* Advanced Features */}
            <section className="mb-24 py-16 px-8 rounded-[40px] bg-gradient-to-br from-slate-900/5 to-blue-900/5 dark:from-slate-800/20 dark:to-blue-900/20 border border-slate-500/10 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

                <div className="relative">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-black mb-3 text-[var(--text-primary)]">
                            Advanced Capabilities
                        </h2>
                        <p className="text-base text-[var(--text-secondary)]">
                            Enterprise features for complex applications
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)]">
                            <FileCode className="text-blue-500 mb-3" size={28} />
                            <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">Dependency Graph Engine</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">
                                Advanced dependency tracking with cycle detection and incremental updates.
                            </p>
                            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>Automatic cycle detection and prevention</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>Delta engine for incremental updates</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>Topological sorting for optimal build order</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)]">
                            <Lock className="text-purple-500 mb-3" size={28} />
                            <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">Security & Sandboxing</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">
                                WASM-based plugin sandboxing for secure third-party extensions.
                            </p>
                            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>Isolated plugin execution environment</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>Memory and CPU limits for plugins</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>Secure communication channels</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)]">
                            <Blocks className="text-emerald-500 mb-3" size={28} />
                            <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">CSS Processing</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">
                                Built-in CSS processing with PostCSS, modules, and preprocessing.
                            </p>
                            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>CSS Modules with scoped styles</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>PostCSS integration with autoprefixer</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>SCSS/SASS preprocessing</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)]">
                            <Repeat className="text-orange-500 mb-3" size={28} />
                            <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">Live Configuration</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">
                                Hot reload configuration changes without restarting the dev server.
                            </p>
                            <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>Watch config files for changes</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>Instant config updates via WebSocket</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>No server restart required</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Framework Support */}
            <section className="mb-24">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-black mb-3 text-[var(--text-primary)]">
                        Universal Framework Support
                    </h2>
                    <p className="text-base text-[var(--text-secondary)]">
                        Production-tested on popular open-source projects
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { name: 'React', version: '16.x - 19.x' },
                        { name: 'Vue', version: '2.x, 3.x' },
                        { name: 'Svelte', version: '3.x - 5.x' },
                        { name: 'Angular', version: '2 - 17+' },
                        { name: 'Solid', version: 'All versions' },
                        { name: 'Preact', version: 'All versions' },
                        { name: 'Qwik', version: 'All versions' },
                        { name: 'Lit', version: 'All versions' },
                    ].map(framework => (
                        <div
                            key={framework.name}
                            className="group p-5 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Code2 size={18} className="text-blue-500" />
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                    ✓ Supported
                                </span>
                            </div>
                            <h4 className="font-bold text-base mb-1 text-[var(--text-primary)]">{framework.name}</h4>
                            <p className="text-xs text-[var(--text-secondary)] font-mono">{framework.version}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        to="/features"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors"
                    >
                        View All Features
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Test Results */}
            <section className="mb-24">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-black mb-3 text-[var(--text-primary)]">
                        Proven Reliability
                    </h2>
                    <p className="text-base text-[var(--text-secondary)]">
                        109 tests across 14 suites — unit, integration, property-based, and stress
                    </p>
                </div>

                <div className="p-8 rounded-3xl bg-[var(--surface-color)] border border-[var(--border-color)] shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                            <div className="text-5xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                                14
                            </div>
                            <div className="text-base font-semibold text-[var(--text-secondary)]">
                                Test Suites
                            </div>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                            <div className="text-5xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                                109
                            </div>
                            <div className="text-base font-semibold text-[var(--text-secondary)]">
                                Tests Passing
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            { suite: 'Core Engine', count: '✓' },
                            { suite: 'Module Federation', count: '✓' },
                            { suite: 'CSS Processing', count: '✓' },
                            { suite: 'Cache Correctness', count: '✓' },
                            { suite: 'Universal Transformer', count: '✓' },
                            { suite: 'Error Handling', count: '✓' },
                            { suite: 'Property-Based (Resolver)', count: '✓' },
                            { suite: 'Property-Based (Transformer)', count: '✓' },
                            { suite: 'Build Snapshot', count: '✓' },
                            { suite: 'Performance Regression', count: '✓' },
                            { suite: 'Real-World Integration', count: '✓' },
                            { suite: 'Load / Stress', count: '✓' },
                        ].map(item => (
                            <div
                                key={item.suite}
                                className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors"
                            >
                                <span className="font-semibold text-sm text-[var(--text-primary)]">{item.suite}</span>
                                <span className="text-emerald-500 font-bold flex items-center gap-2 text-sm">
                                    <CheckCircle2 size={16} />
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-6">
                        <Link
                            to="/benchmarks"
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all"
                        >
                            View Detailed Benchmarks
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 text-center border-t border-[var(--border-color)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                <div className="relative">
                    <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-[var(--text-primary)]">
                        Ready to Build Faster?
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join developers building modern web applications with Nexxo.
                        Get started in less than a minute.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/docs/getting-started"
                            className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 active:scale-95 flex items-center gap-2"
                        >
                            Start Building Now
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/docs"
                            className="px-10 py-5 border-2 border-[var(--border-color)] font-bold rounded-2xl hover:bg-[var(--surface-color)] hover:border-blue-500 transition-all duration-300 active:scale-95"
                        >
                            Read Documentation
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
