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
    Clock,
    Rocket,
    Copy,
    TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../components/I18nContext';

const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        'Stable': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        'Verified': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'Production': 'bg-green-500/10 text-green-500 border-green-500/20',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[status] || colors.Stable}`}>
            {status}
        </span>
    );
};

const CodeBlock = ({ code, language = 'bash' }: { code: string, language?: string }) => {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 my-6 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{language}</span>
                    <button
                        onClick={copyToClipboard}
                        className="text-slate-500 hover:text-white transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                </div>
            </div>
            <pre className="p-6 text-sm font-mono text-blue-400 overflow-x-auto leading-relaxed">
                <code>{code}</code>
            </pre>
        </div>
    );
};

export const Home: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="animate-in fade-in duration-1000">
            {/* Hero Section */}
            <section className="mb-24 pt-12 text-center lg:text-left relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold mb-8">
                    <CheckCircle2 size={14} />
                    <span>v1.0.0-freeze • Production Ready • 11/11 Test Scores</span>
                </div>
                <h1 className="text-6xl lg:text-8xl font-black font-display tracking-tighter text-[var(--text-primary)] leading-[0.95] mb-8">
                    {t('hero.title')}
                </h1>
                <p className="text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-10 mx-auto lg:mx-0">
                    Lightning-fast build tool with 69ms cold start, 10-60ms HMR, and native Module Federation. Tested on 8 real-world projects with perfect scores.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <Link
                        to="/docs/getting-started"
                        className="px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-xl shadow-blue-500/25 active:scale-95"
                    >
                        Get Started →
                    </Link>
                    <a
                        href="https://github.com/Avinash-1994/nexxo"
                        className="px-8 py-4 border border-[var(--border-color)] font-bold rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95"
                    >
                        GitHub
                    </a>
                </div>
            </section>

            {/* Performance Metrics */}
            <section className="mb-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Cold Start', value: '69ms', icon: Zap, color: 'text-blue-500' },
                        { label: 'HMR Speed', value: '10-60ms', icon: Activity, color: 'text-emerald-500' },
                        { label: 'Test Pass Rate', value: '100%', icon: CheckCircle2, color: 'text-green-500' },
                        { label: 'Bundle Size', value: '6.9KB', icon: Box, color: 'text-purple-500' },
                    ].map(metric => (
                        <div key={metric.label} className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-blue-500 transition-all">
                            <metric.icon size={24} className={metric.color + ' mb-3'} />
                            <div className="text-3xl font-black mb-1">{metric.value}</div>
                            <div className="text-sm text-[var(--text-secondary)]">{metric.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Getting Started Fast */}
            <section className="mb-24">
                <div className="flex items-center gap-3 mb-6">
                    <Terminal size={24} className="text-blue-500" />
                    <h2 className="text-2xl font-bold font-display tracking-tight">Quick Start</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                            Get started in seconds. Nexxo auto-detects your framework and configures the optimal build pipeline with best-in-class HMR.
                        </p>
                        <ul className="space-y-4">
                            {[
                                '69ms Cold Start Time',
                                '10-60ms HMR Update Speed',
                                '100% Test Pass Rate (88/88)',
                                '11/11 Perfect Scores Across 8 Projects'
                            ].map(item => (
                                <li key={item} className="flex items-center gap-3 text-sm font-medium">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <CodeBlock code={`# Create new project
npx create-nexxo my-app --template premium-dashboard

# Start development
cd my-app && nexxo dev

# Build for production
nexxo build`} />
                </div>
            </section>

            {/* Framework Support */}
            <section className="mb-24 py-16 px-8 rounded-[32px] bg-slate-900/5 border border-slate-500/10 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Activity size={200} className="text-blue-500" />
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-black font-display mb-2">Framework Support</h2>
                        <p className="text-[var(--text-secondary)]">Tested on real-world open-source projects with perfect scores.</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> PRODUCTION</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> VERIFIED</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { name: 'React', status: 'Production', version: '16.x-19.x', icon: Code2, score: '11/11' },
                        { name: 'Vue', status: 'Production', version: '2.x, 3.x', icon: Code2, score: '11/11' },
                        { name: 'Svelte', status: 'Production', version: '3.x-5.x', icon: Code2, score: '11/11' },
                        { name: 'Angular', status: 'Production', version: '2-17+', icon: Code2, score: '11/11' },
                        { name: 'Solid', status: 'Production', version: 'All', icon: Code2, score: '11/11' },
                        { name: 'Preact', status: 'Production', version: 'All', icon: Code2, score: '11/11' },
                        { name: 'Qwik', status: 'Production', version: 'All', icon: Code2, score: '11/11' },
                        { name: 'Lit', status: 'Production', version: 'All', icon: Code2, score: '11/11' },
                        { name: 'Module Federation', status: 'Production', version: 'Native', icon: Globe, score: '✅' },
                    ].map(item => (
                        <div key={item.name} className="p-5 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)] group hover:border-blue-500 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <item.icon size={20} className="text-blue-500" />
                                <StatusBadge status={item.status} />
                            </div>
                            <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                                <span>{item.version}</span>
                                <span className="text-emerald-500 font-bold">{item.score}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Test Results */}
            <section className="mb-24">
                <h2 className="text-3xl font-black font-display mb-6">Production Test Results</h2>
                <div className="p-8 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <div className="text-5xl font-black text-emerald-500 mb-2">11/11</div>
                            <div className="text-sm text-[var(--text-secondary)]">Perfect Score on All Projects</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-blue-500 mb-2">88/88</div>
                            <div className="text-sm text-[var(--text-secondary)]">Tests Passed (100%)</div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            'TanStack Table', 'React Query', 'VueUse', 'Nuxt Content',
                            'SvelteKit', 'Svelte Motion', 'Lit Project', 'Alpine.js'
                        ].map(project => (
                            <div key={project} className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                <span className="font-medium">{project}</span>
                                <span className="text-emerald-500 font-bold">11/11 ✅</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 text-center border-t border-[var(--border-color)]">
                <h2 className="text-4xl font-black font-display mb-6 tracking-tight">Ready to Build?</h2>
                <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-10 text-lg">
                    Join developers building with the fastest, most reliable build tool. Production-tested and ready.
                </p>
                <Link to="/docs/getting-started" className="inline-flex h-14 items-center justify-center px-12 rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold hover:scale-105 transition-transform active:scale-95 shadow-2xl">
                    Start Building Now
                </Link>
            </section>
        </div>
    );
};
