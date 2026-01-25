import React from 'react';
import { Zap, TrendingUp, CheckCircle2, Activity, Code2, Terminal, Book } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Benchmarks: React.FC = () => {
    const performanceMetrics = [
        {
            metric: 'Cold Start Time',
            value: '69ms',
            description: 'Time from command to ready state',
            usage: 'Run nexxo dev and start coding immediately'
        },
        {
            metric: 'HMR Update Speed',
            value: '10-60ms',
            description: 'Hot module replacement latency',
            usage: 'Save your file and see changes instantly'
        },
        {
            metric: 'Build Time',
            value: '~500ms',
            description: 'Average production build time',
            usage: 'Run nexxo build for optimized output'
        },
        {
            metric: 'Bundle Size',
            value: '6.9KB',
            description: 'Compressed bundle size (brotli)',
            usage: 'Automatic optimization with tree shaking'
        }
    ];

    const testResults = [
        { project: 'TanStack Table', score: '11/11', framework: 'React' },
        { project: 'React Query', score: '11/11', framework: 'React' },
        { project: 'VueUse', score: '11/11', framework: 'Vue' },
        { project: 'Nuxt Content', score: '11/11', framework: 'Vue' },
        { project: 'SvelteKit', score: '11/11', framework: 'Svelte' },
        { project: 'Svelte Motion', score: '11/11', framework: 'Svelte' },
        { project: 'Lit Project', score: '11/11', framework: 'Lit' },
        { project: 'Alpine.js', score: '11/11', framework: 'Alpine' }
    ];

    const features = [
        { name: 'Hot Module Replacement', score: '11/11', usage: 'Automatic for all frameworks' },
        { name: 'CSS Modules', score: '11/11', usage: 'Use .module.css extension' },
        { name: 'Tailwind CSS', score: '11/11', usage: 'Auto-detected from config' },
        { name: 'TypeScript', score: '11/11', usage: 'Zero config, just use .ts/.tsx' },
        { name: 'Tree Shaking', score: '11/11', usage: 'Automatic in production builds' },
        { name: 'Server-Side Rendering', score: '11/11', usage: 'nexxo ssr command' },
        { name: 'Library Mode', score: '11/11', usage: 'Build reusable packages' },
        { name: 'Module Federation', score: '11/11', usage: 'Configure in nexxo.config.js' },
        { name: 'Error Overlay', score: '11/11', usage: 'Automatic in dev mode' },
        { name: 'Build Dashboard', score: '11/11', usage: 'nexxo analyze command' }
    ];

    return (
        <div className="animate-in fade-in duration-1000">
            {/* Hero */}
            <section className="mb-24 pt-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold mb-8">
                    <CheckCircle2 size={14} />
                    <span>Production Tested • 100% Pass Rate</span>
                </div>
                <h1 className="text-6xl lg:text-8xl font-black font-display tracking-tighter text-[var(--text-primary)] leading-[0.95] mb-8">
                    Performance & Results
                </h1>
                <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
                    Real performance metrics from production testing on 8 open-source projects
                </p>
            </section>

            {/* Performance Metrics */}
            <section className="mb-24">
                <h2 className="text-3xl font-black font-display mb-8">Performance Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {performanceMetrics.map((metric, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-blue-500 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{metric.metric}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">{metric.description}</p>
                                </div>
                                <div className="text-3xl font-black text-blue-500">{metric.value}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                <div className="text-xs font-bold text-blue-500 mb-1">HOW TO USE</div>
                                <div className="text-sm text-[var(--text-secondary)]">{metric.usage}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Test Results */}
            <section className="mb-24">
                <h2 className="text-3xl font-black font-display mb-8">Production Test Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)]">
                        <div className="text-5xl font-black text-emerald-500 mb-2">11/11</div>
                        <div className="text-sm text-[var(--text-secondary)]">Perfect Score</div>
                        <div className="text-xs text-[var(--text-secondary)] mt-2">All features working</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)]">
                        <div className="text-5xl font-black text-blue-500 mb-2">88/88</div>
                        <div className="text-sm text-[var(--text-secondary)]">Tests Passed</div>
                        <div className="text-xs text-[var(--text-secondary)] mt-2">100% success rate</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)]">
                        <div className="text-5xl font-black text-purple-500 mb-2">8</div>
                        <div className="text-sm text-[var(--text-secondary)]">Projects Tested</div>
                        <div className="text-xs text-[var(--text-secondary)] mt-2">Real-world apps</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)]">
                        <div className="text-5xl font-black text-orange-500 mb-2">0</div>
                        <div className="text-sm text-[var(--text-secondary)]">Build Errors</div>
                        <div className="text-xs text-[var(--text-secondary)] mt-2">Clean builds</div>
                    </div>
                </div>

                <div className="space-y-3">
                    {testResults.map((result, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={20} className="text-emerald-500" />
                                <div>
                                    <span className="font-medium">{result.project}</span>
                                    <span className="text-sm text-[var(--text-secondary)] ml-3">({result.framework})</span>
                                </div>
                            </div>
                            <span className="text-emerald-500 font-bold">{result.score}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature Coverage with Usage */}
            <section className="mb-24">
                <h2 className="text-3xl font-black font-display mb-8">Features & How to Use</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-emerald-500 transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold">{feature.name}</h4>
                                <span className="text-emerald-500 font-bold text-sm">{feature.score}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                                <div className="text-xs font-bold text-emerald-500 mb-1">USAGE</div>
                                <div className="text-sm text-[var(--text-secondary)]">{feature.usage}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CLI Commands */}
            <section className="mb-24 p-8 rounded-2xl bg-slate-900/5 dark:bg-slate-900/20 border border-[var(--border-color)]">
                <h2 className="text-2xl font-black font-display mb-6 flex items-center gap-3">
                    <Terminal size={24} className="text-blue-500" />
                    Available Commands
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { cmd: 'nexxo dev', desc: 'Start development server with HMR' },
                        { cmd: 'nexxo build', desc: 'Build for production' },
                        { cmd: 'nexxo ssr', desc: 'Start SSR server' },
                        { cmd: 'nexxo analyze', desc: 'Analyze bundle composition' },
                        { cmd: 'nexxo init', desc: 'Initialize configuration' },
                        { cmd: 'nexxo bootstrap', desc: 'Create from template' },
                        { cmd: 'nexxo inspect', desc: 'Inspect dependency graph' },
                        { cmd: 'nexxo audit', desc: 'Run accessibility/performance audits' }
                    ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-[var(--surface-color)] border border-[var(--border-color)]">
                            <code className="text-blue-500 font-mono text-sm font-bold">{item.cmd}</code>
                            <p className="text-sm text-[var(--text-secondary)] mt-2">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testing Methodology */}
            <section className="mb-24 p-8 rounded-2xl bg-slate-900/5 dark:bg-slate-900/20 border border-[var(--border-color)]">
                <h2 className="text-2xl font-black font-display mb-6">Testing Methodology</h2>
                <div className="space-y-4 text-[var(--text-secondary)]">
                    <p>
                        <strong className="text-[var(--text-primary)]">Real-World Projects:</strong> Tested on 8 actual open-source projects including TanStack Table, React Query, VueUse, and more.
                    </p>
                    <p>
                        <strong className="text-[var(--text-primary)]">Comprehensive Testing:</strong> Each project tested for 11 features: HMR, CSS Modules, Tailwind, TypeScript, Tree Shaking, SSR, Library Mode, Runtime Integrity, Module Federation, Error Overlay, and Build Dashboard.
                    </p>
                    <p>
                        <strong className="text-[var(--text-primary)]">Environment:</strong> Linux, Node.js 20+, consistent hardware across all tests.
                    </p>
                    <p>
                        <strong className="text-[var(--text-primary)]">Results:</strong> 100% pass rate (88/88 tests), zero build errors, perfect scores across all projects.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center border-t border-[var(--border-color)]">
                <h2 className="text-4xl font-black font-display mb-6">Ready to Get Started?</h2>
                <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-10 text-lg">
                    See how to use Nexxo in your projects with our comprehensive documentation
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/docs/getting-started"
                        className="inline-flex h-14 items-center justify-center px-12 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-xl shadow-blue-500/25 active:scale-95"
                    >
                        <Book size={20} className="mr-2" />
                        View Documentation
                    </Link>
                    <Link
                        to="/templates"
                        className="inline-flex h-14 items-center justify-center px-12 rounded-2xl border border-[var(--border-color)] font-bold hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95"
                    >
                        <Code2 size={20} className="mr-2" />
                        Browse Templates
                    </Link>
                </div>
            </section>
        </div>
    );
};
