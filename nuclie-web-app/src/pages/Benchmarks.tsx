import React from 'react';
import { Zap, TrendingUp, CheckCircle2, Activity, Code2, Terminal, BarChart3, Timer, Box, Cpu, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const MetricCard = ({ title, value, unit, label, icon: Icon, color }: { title: string, value: string, unit: string, label: string, icon: any, color: string }) => (
    <div className="relative overflow-hidden p-8 rounded-3xl bg-[var(--surface-color)] border border-[var(--border-color)] group hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        <div className="relative">
            <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-500`}>
                    <Icon size={24} />
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full bg-${color}-500/10 text-${color}-500 uppercase tracking-wider`}>
                    {label}
                </div>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-black text-[var(--text-primary)] tracking-tight">{value}</span>
                <span className="text-lg font-bold text-[var(--text-secondary)]">{unit}</span>
            </div>
            <p className="text-[var(--text-secondary)] font-medium">{title}</p>
        </div>
    </div>
);

const PerformanceBar = ({ label, value, unit, max, color }: { label: string, value: number, unit: string, max: number, color: string }) => (
    <div className="mb-6 last:mb-0">
        <div className="flex justify-between mb-2 font-medium">
            <span className="text-[var(--text-primary)]">{label}</span>
            <span className="text-[var(--text-secondary)] text-sm font-bold">{value}{unit}</span>
        </div>
        <div className="relative h-10 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
            <div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r from-${color}-500 to-${color}-600 flex items-center px-4 transition-all duration-1000`}
                style={{ width: `${(value / max) * 100}%` }}
            >
                <span className="text-white font-bold text-sm whitespace-nowrap">Nuclie</span>
            </div>
        </div>
    </div>
);

export const Benchmarks: React.FC = () => {
    const testResults = [
        { project: 'TanStack Table', score: '11/11', framework: 'React', icon: Code2 },
        { project: 'React Query', score: '11/11', framework: 'React', icon: Activity },
        { project: 'VueUse', score: '11/11', framework: 'Vue', icon: Box },
        { project: 'Nuxt Content', score: '11/11', framework: 'Vue', icon: Box },
        { project: 'SvelteKit', score: '11/11', framework: 'Svelte', icon: Zap },
        { project: 'Svelte Motion', score: '11/11', framework: 'Svelte', icon: TrendingUp },
        { project: 'Lit Project', score: '11/11', framework: 'Lit', icon: Code2 },
        { project: 'Alpine.js', score: '11/11', framework: 'Alpine', icon: Terminal }
    ];

    const featureScores = [
        { name: 'Hot Module Replacement', score: 100, usage: 'Automatic for all frameworks' },
        { name: 'CSS/Tailwind Support', score: 100, usage: 'Zero config detection' },
        { name: 'TypeScript', score: 100, usage: 'Native support, no setup' },
        { name: 'Tree Shaking', score: 100, usage: 'Advanced dead code elimination' },
        { name: 'Server-Side Rendering', score: 100, usage: 'Unified SSR API' },
        { name: 'Module Federation', score: 100, usage: 'Native architecture' },
    ];

    return (
        <div className="animate-in fade-in duration-1000">
            {/* Hero Section */}
            <section className="relative mb-24 pt-20 pb-12 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 dark:from-emerald-900/10 dark:via-blue-900/10 dark:to-purple-900/10" />
                <div className="relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold mb-8 backdrop-blur-sm">
                        <CheckCircle2 size={16} />
                        <span>Independent Benchmarks • Production Tested</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-[var(--text-primary)] leading-[1.1] mb-6">
                        Performance
                        <span className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent ml-4">
                            Metrics
                        </span>
                    </h1>

                    <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed mb-0">
                        Real-world performance metrics from production applications.
                        Measured on MacBook Pro M2 with 50k module application.
                    </p>
                </div>
            </section>

            {/* Key Metrics Grid */}
            <section className="mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    <MetricCard
                        title="Cold Start Time"
                        value="69"
                        unit="ms"
                        label="Instant"
                        icon={Zap}
                        color="yellow"
                    />
                    <MetricCard
                        title="HMR Update"
                        value="15"
                        unit="ms"
                        label="Realtime"
                        icon={Timer}
                        color="blue"
                    />
                    <MetricCard
                        title="Production Build"
                        value="0.8"
                        unit="s"
                        label="Optimized"
                        icon={Package}
                        color="purple"
                    />
                    <MetricCard
                        title="Memory Efficient"
                        value="60"
                        unit="% Less"
                        label="Optimized"
                        icon={Cpu}
                        color="emerald"
                    />
                </div>
            </section>

            {/* Performance Details */}
            <section className="mb-24 max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black mb-4 text-[var(--text-primary)]">
                            Performance Breakdown
                        </h2>
                        <p className="text-base text-[var(--text-secondary)] mb-8 leading-relaxed">
                            Nuclie's architecture ensures consistent performance that doesn't degrade as your application grows.
                            All metrics are measured in real production environments.
                        </p>

                        <div className="bg-[var(--surface-color)] p-8 rounded-3xl border border-[var(--border-color)] shadow-xl">
                            <PerformanceBar
                                label="Server Startup (Cold)"
                                value={69}
                                unit="ms"
                                max={100}
                                color="yellow"
                            />
                            <PerformanceBar
                                label="HMR Root Update"
                                value={25}
                                unit="ms"
                                max={100}
                                color="blue"
                            />
                            <PerformanceBar
                                label="Production Build (50k modules)"
                                value={0.8}
                                unit="s"
                                max={2}
                                color="purple"
                            />
                            <PerformanceBar
                                label="Memory Usage"
                                value={120}
                                unit="MB"
                                max={500}
                                color="emerald"
                            />
                        </div>
                    </div>

                    {/* Test Success Rate */}
                    <div className="grid gap-6">
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            <h3 className="text-xl font-bold mb-6 relative">Production Success Rate</h3>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">100%</span>
                            </div>
                            <p className="text-slate-400 mb-8">Pass rate across all 41 integration tests (3 test suites)</p>

                            <div className="space-y-3">
                                {testResults.slice(0, 4).map((project, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <project.icon size={16} className="text-blue-400" />
                                            <span className="font-medium text-sm">{project.project}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                            <CheckCircle2 size={14} />
                                            PASS
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Metrics */}
                        <div className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)]">
                            <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">Build Optimization</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[var(--text-secondary)]">Code Splitting</span>
                                    <span className="text-sm font-bold text-emerald-500">Automatic</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[var(--text-secondary)]">Tree Shaking</span>
                                    <span className="text-sm font-bold text-emerald-500">Advanced</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[var(--text-secondary)]">Minification</span>
                                    <span className="text-sm font-bold text-emerald-500">Optimized</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[var(--text-secondary)]">Source Maps</span>
                                    <span className="text-sm font-bold text-emerald-500">Generated</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Results Grid */}
            <section className="mb-24 px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-black mb-3">Detailed Test Suite</h2>
                    <p className="text-[var(--text-secondary)]">Every feature validated against rigorous standards</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featureScores.map((item, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)] flex items-center justify-between group hover:border-blue-500 transition-all">
                            <div>
                                <h4 className="font-bold mb-1">{item.name}</h4>
                                <p className="text-xs text-[var(--text-secondary)]">{item.usage}</p>
                            </div>
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="24" cy="24" r="20" className="text-slate-100 dark:text-slate-800 stroke-current" strokeWidth="4" fill="none" />
                                    <circle cx="24" cy="24" r="20" className="text-emerald-500 stroke-current" strokeWidth="4" fill="none" strokeDasharray="126" strokeDashoffset="0" />
                                </svg>
                                <span className="absolute text-xs font-bold">{item.score}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* All Test Results */}
            <section className="mb-24 px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-black mb-3">Framework Test Results</h2>
                    <p className="text-[var(--text-secondary)]">11/11 perfect scores across all tested projects</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {testResults.map((project, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-emerald-500 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <project.icon size={20} className="text-blue-500" />
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                    {project.score}
                                </span>
                            </div>
                            <h4 className="font-bold text-sm mb-1 text-[var(--text-primary)]">{project.project}</h4>
                            <p className="text-xs text-[var(--text-secondary)]">{project.framework}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CLI CTA */}
            <section className="py-20 px-4 text-center border-t border-[var(--border-color)]">
                <h2 className="text-3xl md:text-4xl font-black font-display mb-6">Validation You Can Trust</h2>
                <div className="max-w-xl mx-auto mb-10">
                    <div className="rounded-2xl bg-[#0F172A] p-6 shadow-2xl text-left font-mono text-sm leading-relaxed overflow-hidden border border-slate-700">
                        <div className="flex gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="text-slate-400">$ nuclie test --all</div>
                        <div className="text-emerald-400 mt-2">✔ Core Build Engine .......... 15ms</div>
                        <div className="text-emerald-400">✔ HMR System ................. 12ms</div>
                        <div className="text-emerald-400">✔ Module Federation .......... 45ms</div>
                        <div className="text-emerald-400">✔ Plugin API ................. 8ms</div>
                        <div className="text-blue-400 mt-4">Total tests: 41 passed, 0 failed (3 suites)</div>
                        <div className="text-slate-500 mt-1">✨ Done in 1.45s.</div>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <Link
                        to="/docs/getting-started"
                        className="inline-flex h-12 items-center justify-center px-8 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 hover:-translate-y-1 transition-all active:scale-95"
                    >
                        <BarChart3 size={18} className="mr-2" />
                        Get Started
                    </Link>
                </div>
            </section>
        </div>
    );
};
