import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import {
    CheckCircle2,
    Copy,
    AlertCircle,
    Cpu,
    Zap,
    Layers,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';

import { CodeBlock } from '../components/CodeBlock';

export const FrameworkGuides = () => {
    const { framework } = useParams<{ framework: string }>();
    if (!framework) return <Navigate to="/docs/getting-started" />;

    const config = {
        react: {
            name: 'React',
            status: 'Stable (Tier 1)',
            statusColor: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
            install: 'npm install -g nexxo\nnexxo bootstrap --name my-app --template react-ts',
            preset: 'react',
            hmr: 'Fast Refresh (Component-level state preserved)',
            example: `// nexxo.config.js
module.exports = {
  entry: ['./src/main.tsx'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external',
  },

  dev: {
    port: 3000,
    hmr: true,
  },

  // Optional: CSS Modules + Tailwind
  css: {
    modules: true,
    framework: 'tailwind',
  },
};`,
            features: [
                { title: 'Full HMR', desc: 'Component-level Fast Refresh preserves state.' },
                { title: 'TSX / JSX', desc: 'Native transform via SWC — no Babel needed.' },
                { title: 'React 18 & 19', desc: 'Server components and concurrent mode ready.' }
            ],
            limitations: [
                'Class components fully supported; legacy createClass is not.',
                'Requires React ≥17 for the automatic JSX runtime.',
            ]
        },
        vue: {
            name: 'Vue',
            status: 'Stable (Tier 1)',
            statusColor: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
            install: 'npm install -g nexxo\nnexxo bootstrap --name my-app --template vue-ts',
            preset: 'vue',
            hmr: 'SFC Hot-Reload (file-level)',
            example: `// nexxo.config.js
module.exports = {
  entry: ['./src/main.ts'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external',
  },

  dev: {
    port: 5173,
    hmr: true,
  },

  // Optional: enable Vue i18n or Pinia
  plugins: [
    // nexxo plugins go here
  ],
};`,
            features: [
                { title: 'SFC Transform', desc: 'Native .vue single-file component support.' },
                { title: 'Vue 3 Composition API', desc: '<script setup> and composables fully supported.' },
                { title: 'Pinia / Vuex', desc: 'State managers work with HMR out of the box.' }
            ],
            limitations: [
                'Vue 2 requires the legacy-vue adapter plugin.',
                'SSR mode is experimental — use a standard Node server for now.',
            ]
        },
        svelte: {
            name: 'Svelte',
            status: 'Stable (Tier 1)',
            statusColor: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
            install: 'npm install -g nexxo\nnexxo bootstrap --name my-app --template svelte-ts',
            preset: 'svelte',
            hmr: 'Component Hot-Reload',
            example: `// nexxo.config.js
module.exports = {
  entry: ['./src/main.ts'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external',
  },

  dev: {
    port: 5173,
    hmr: true,
  },

  // Optional: enable preprocessor for TypeScript/SCSS inside .svelte files
  css: {
    modules: false,  // Svelte handles CSS scoping natively
  },
};`,
            features: [
                { title: 'Svelte 5 Runes', desc: 'Full $state, $derived, $effect support.' },
                { title: 'Scoped CSS', desc: 'Automatic style isolation per component.' },
                { title: 'Zero Runtime', desc: 'Compiles to vanilla JS — no framework overhead.' }
            ],
            limitations: [
                'Svelte 3/4 requires the svelte-compat preset.',
                'SvelteKit SSR (adapter-node) needs separate configuration.',
            ]
        },
        solid: {
            name: 'SolidJS',
            status: 'Stable (Tier 1)',
            statusColor: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
            install: 'npm install -g nexxo\nnexxo bootstrap --name my-app --template solid-ts',
            preset: 'solid',
            hmr: 'Hot Module Replacement (signal-aware)',
            example: `// nexxo.config.js
module.exports = {
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
};`,
            features: [
                { title: 'Fine-grained Reactivity', desc: 'Signal-based — no VDOM diffing.' },
                { title: 'JSX Compilation', desc: 'Compile-time JSX optimisation via babel-preset-solid.' },
                { title: 'createSignal HMR', desc: 'Reactive primitives preserved across reloads.' }
            ],
            limitations: [
                'Experimental SSR support only via SolidStart.',
                'Components must be pure functions (no class components).',
            ]
        },
        preact: {
            name: 'Preact',
            status: 'Stable (Tier 1)',
            statusColor: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
            install: 'npm install -g nexxo\nnexxo bootstrap --name my-app --template preact-ts',
            preset: 'preact',
            hmr: 'Fast Refresh',
            example: `// nexxo.config.js
module.exports = {
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

  // Optional: alias 'react' to 'preact/compat' for React library compatibility
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
};`,
            features: [
                { title: 'Tiny Bundle', desc: '~3KB runtime, identical API to React.' },
                { title: 'React Compat', desc: 'Use most React libraries via preact/compat alias.' },
                { title: 'Preact Signals', desc: 'Deep integration with @preact/signals.' }
            ],
            limitations: [
                'Some advanced React 18 APIs (useTransition, useDeferredValue) need shimming.',
            ]
        },
        lit: {
            name: 'Lit',
            status: 'Verified',
            statusColor: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
            install: 'npm install -g nexxo\nnexxo bootstrap --name my-app --template lit-ts',
            preset: 'lit',
            hmr: 'Web Component Hot-Patch',
            example: `// nexxo.config.js
module.exports = {
  entry: ['./src/main.ts'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external',
    target: 'es2020',   // Lit needs modern JS
  },

  dev: {
    port: 3000,
    hmr: true,
  },
};`,
            features: [
                { title: 'Decorator Support', desc: 'TC39 and TypeScript legacy decorators.' },
                { title: 'Shadow DOM HMR', desc: 'In-place style updates without full reload.' },
                { title: 'Platform Native', desc: 'Standards-based Web Components — no polyfills needed in modern browsers.' }
            ],
            limitations: [
                'HMR requires re-registration of custom elements on reload.',
            ]
        },
        alpine: {
            name: 'Alpine.js',
            status: 'Verified',
            statusColor: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
            install: 'npm install -g nexxo\nnexxo bootstrap --name my-app --template alpine-js',
            preset: 'alpine',
            hmr: 'Reactive Core Reload',
            example: `// nexxo.config.js
module.exports = {
  entry: ['./src/main.js'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: false,
  },

  dev: {
    port: 3000,
    hmr: true,
  },
};`,
            features: [
                { title: 'Zero Config', desc: 'Import Alpine.js and you are done.' },
                { title: 'Store HMR', desc: 'Global $store data survives hot reloads.' },
                { title: 'HTML-first', desc: 'Directives live in HTML — ideal for server-rendered pages.' }
            ],
            limitations: [
                'Complex component trees with x-for loops may need full page refresh.',
            ]
        },
        qwik: {
            name: 'Qwik',
            status: 'Experimental',
            statusColor: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
            install: 'npm install -g nexxo\nnexxo bootstrap --name my-app --template qwik-ts',
            preset: 'qwik',
            hmr: 'Resumability-aware HMR',
            example: `// nexxo.config.js
module.exports = {
  entry: ['./src/root.tsx'],
  outDir: './dist',

  build: {
    minify: true,
    sourcemap: 'external',
  },

  dev: {
    port: 5173,
    hmr: true,
  },
};`,
            features: [
                { title: 'Resumability', desc: 'Zero hydration — serializes state, not code.' },
                { title: 'Optimizer Hooks', desc: 'Full support for the Qwik Optimizer symbols.' },
                { title: 'Lazy Loading', desc: 'Automatic code splitting at component level.' }
            ],
            limitations: [
                'Experimental — SSR mode only for now.',
            ]
        },
        mithril: {
            name: 'Mithril.js',
            status: 'Legacy',
            statusColor: 'text-slate-500 border-slate-500/20 bg-slate-500/5',
            install: 'npm install -g nexxo\nnexxo bootstrap --name my-app --template mithril-js',
            preset: 'mithril',
            hmr: 'Full Module Replacement',
            example: `// nexxo.config.js
module.exports = {
  entry: ['./src/main.js'],
  outDir: './dist',

  build: {
    minify: true,
  },

  dev: {
    port: 3000,
    hmr: true,
  },
};`,
            features: [
                { title: 'Hyperscript', desc: 'm() API for programmatic VDOM construction.' },
                { title: 'Built-in Router', desc: 'Zero-dependency routing with m.route.' },
                { title: 'Small Core', desc: 'Under 10KB — ideal for embedded apps.' }
            ],
            limitations: [
                'State preservation across HMR cycles requires extra boilerplate.',
            ]
        }
    }[framework.toLowerCase()] || { name: framework, install: '', preset: '', example: '', features: [], limitations: [], status: 'Community', statusColor: 'text-slate-500 border-slate-500/20 bg-slate-500/5', hmr: 'Full Refresh' };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest mb-4">
                        Framework Guide
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black font-display tracking-tight">Using {config.name} with Nexxo</h1>
                </div>
                <div className={`px-4 py-2 rounded-xl border font-bold text-sm ${config.statusColor}`}>
                    {config.status}
                </div>
            </div>

            <p className="text-lg text-[var(--text-secondary)] mb-10 leading-relaxed max-w-3xl">
                Nexxo provides first-class support for {config.name} through specialized adapters that isolate your framework logic from the core build engine.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Cpu className="text-blue-500" size={20} />
                        Supported Capabilities
                    </h3>
                    <div className="space-y-3">
                        {config.features.map(f => (
                            <div key={f.title} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)]/50">
                                <div className="font-bold text-sm mb-1">{f.title}</div>
                                <div className="text-xs text-[var(--text-secondary)]">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" size={20} />
                        Guarantees & HMR
                    </h3>
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-6">
                        <div className="flex items-center gap-2 text-blue-400 font-mono text-sm mb-2">
                            <Zap size={14} /> HMR BEHAVIOR
                        </div>
                        <p className="text-slate-300 text-sm font-medium">{config.hmr}</p>
                    </div>

                    <h4 className="font-bold mb-3 flex items-center gap-2 text-red-500">
                        <AlertCircle size={18} /> Known Limitations
                    </h4>
                    <ul className="space-y-2">
                        {config.limitations.map(l => (
                            <li key={l} className="text-xs text-[var(--text-secondary)] flex gap-2">
                                <span>•</span> {l}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <section className="mb-12">
                <h3 className="text-xl font-bold mb-4">Installation</h3>
                <CodeBlock code={config.install} />
            </section>

            <section className="mb-12">
                <h3 className="text-xl font-bold mb-4">Configuration</h3>
                <p className="text-[var(--text-secondary)] mb-4">Update your <code>nexxo.config.js</code> to use the {config.name} adapter:</p>
                <CodeBlock code={config.example} />
            </section>

            <section className="p-8 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <h4 className="font-bold mb-2 uppercase text-xs tracking-widest text-blue-600">Architect's Tip</h4>
                <p className="text-sm text-[var(--text-secondary)] italic">
                    While Nexxo allows multiple frameworks in a single repository (e.g., a React Marketing site and a Vue Dashboard), it strictly enforces **one framework per runtime container**. You can mix frameworks across routes, but not within the same component tree.
                </p>
                <div className="mt-4">
                    <Link to="/mfe/framework-policy" className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1">
                        Read our Framework Isolation Policy <ArrowRight size={12} />
                    </Link>
                </div>
            </section>
        </div>
    );
};
