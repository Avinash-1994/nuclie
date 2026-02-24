import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const Migration: React.FC = () => {
    return (
        <div className="animate-in fade-in duration-1000">
            <section className="mb-16 pt-12">
                <h1 className="text-4xl md:text-5xl font-black mb-6">Migration Guide</h1>
                <p className="text-lg text-[var(--text-secondary)] max-w-3xl">
                    Migrate your existing projects to Nexxo with minimal configuration changes.
                </p>
            </section>

            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
                <div className="bg-[var(--surface-color)] p-8 rounded-2xl border border-[var(--border-color)]">
                    <h3 className="text-xl font-bold mb-4">Install Nexxo</h3>
                    <pre className="bg-slate-900 text-white p-4 rounded-lg overflow-x-auto">
                        <code>npm install -D nexxo</code>
                    </pre>
                </div>
            </section>

            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Configuration</h2>
                <div className="space-y-6">
                    <div className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)]">
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-emerald-500" />
                            Create nexxo.config.js
                        </h3>
                        <pre className="bg-slate-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{`module.exports = {
  entry: ['./src/index.tsx'],
  outDir: './dist',
  build: {
    minify: true,
    sourcemap: 'external',
  },
  dev: {
    port: 3000,
    hmr: true,
  },
};`}</code>
                        </pre>
                    </div>

                    <div className="bg-[var(--surface-color)] p-6 rounded-2xl border border-[var(--border-color)]">
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-emerald-500" />
                            Update package.json scripts
                        </h3>
                        <pre className="bg-slate-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{`{
  "scripts": {
    "dev": "nexxo dev",
    "build": "nexxo build"
  }
}`}</code>
                        </pre>
                    </div>
                </div>
            </section>

            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6">Framework-Specific Guides</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {['React', 'Vue', 'Svelte'].map((framework) => (
                        <Link
                            key={framework}
                            to={`/guides/${framework.toLowerCase()}`}
                            className="p-6 rounded-2xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-blue-500 transition-all group"
                        >
                            <h3 className="text-lg font-bold mb-2">{framework}</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                Migrate your {framework} project to Nexxo
                            </p>
                            <div className="flex items-center gap-2 text-blue-500 text-sm font-medium">
                                View Guide
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="py-12 px-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <h2 className="text-2xl font-bold mb-4 text-center">Need Help?</h2>
                <p className="text-center text-[var(--text-secondary)] mb-6">
                    Check our documentation or join our community for support.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/docs/getting-started"
                        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all"
                    >
                        Documentation
                    </Link>
                </div>
            </section>
        </div>
    );
};
