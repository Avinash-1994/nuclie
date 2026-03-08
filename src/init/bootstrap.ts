import fs from 'fs/promises';
import path from 'path';
import { log } from '../utils/logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function bootstrapProject(cwd: string, template: string = 'react') {
  log.info(`Bootstrapping new ${template} project in ${cwd}`);

  const templateDir = path.join(__dirname, '..', '..', 'templates', 'standard', template);

  if (await fs.access(templateDir).then(() => true).catch(() => false)) {
    log.info(`Copying template from ${templateDir}`);
    await fs.cp(templateDir, cwd, { recursive: true });

    if (!(await fs.access(path.join(cwd, 'package.json')).then(() => true).catch(() => false))) {
      const pkg: any = {
        name: path.basename(cwd),
        version: '0.1.0',
        private: true,
        type: 'module',
        scripts: {
          "dev": "nuclie dev",
          "build": "nuclie build"
        },
        devDependencies: {
          "nuclie": "latest",
        }
      };
      if (template.includes('react')) {
        pkg.dependencies = {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          ...(template.includes('router') ? { "react-router-dom": "^6.20.0" } : {})
        };
      } else if (template.includes('vue')) {
        pkg.dependencies = { "vue": "^3.3.0" };
      } else if (template.includes('svelte')) {
        pkg.dependencies = { "svelte": "^4.2.0" };
      } else if (template.includes('solid')) {
        pkg.dependencies = { "solid-js": "^1.8.17" };
        pkg.devDependencies["babel-preset-solid"] = "^1.8.17";
        pkg.devDependencies["@babel/core"] = "^7.24.0";
      } else if (template.includes('preact')) {
        pkg.dependencies = { "preact": "^10.19.0" };
      } else if (template.includes('qwik')) {
        pkg.dependencies = { "@builder.io/qwik": "^1.4.3" };
      } else if (template.includes('lit')) {
        pkg.dependencies = { "lit": "^3.1.2" };
      } else if (template.includes('mithril')) {
        pkg.dependencies = { "mithril": "^2.2.2" };
      } else if (template.includes('alpine')) {
        pkg.dependencies = { "alpinejs": "^3.13.3" };
      }
      if (template.includes('ts')) {
        pkg.devDependencies["typescript"] = "^5.0.0";
        if (template.includes('react')) {
          pkg.devDependencies["@types/react"] = "^18.2.0";
          pkg.devDependencies["@types/react-dom"] = "^18.2.0";
        }
      }
      await fs.writeFile(path.join(cwd, 'package.json'), JSON.stringify(pkg, null, 2));

      const isTS = template.includes('ts');
      const ext = isTS ? 'ts' : 'js';
      const jsxExt = isTS ? 'tsx' : 'jsx';
      let entryFile = `src/main.${ext}`;
      let adapter = 'vanilla';

      if (template.includes('react')) { entryFile = `src/main.${jsxExt}`; adapter = 'react'; }
      else if (template.includes('vue')) { adapter = 'vue'; }
      else if (template.includes('svelte')) { adapter = 'svelte'; }
      else if (template.includes('solid')) { entryFile = `src/index.${jsxExt}`; adapter = 'solid'; }
      else if (template.includes('preact')) { entryFile = `src/main.${jsxExt}`; adapter = 'preact'; }
      else if (template.includes('qwik')) { entryFile = `src/root.${jsxExt}`; adapter = 'qwik'; }
      else if (template.includes('lit')) { entryFile = `src/index.${ext}`; adapter = 'lit'; }

      const config = {
        entry: [entryFile],
        mode: "development",
        preset: "spa",
        platform: "browser",
        adapter
      };
      await fs.writeFile(path.join(cwd, 'nuclie.config.json'), JSON.stringify(config, null, 2));
    }
  } else {
    log.info(`Template ${template} not found in physical templates, using programmatic fallback...`);
    await fs.mkdir(path.join(cwd, 'src'), { recursive: true });
    await fs.mkdir(path.join(cwd, 'public'), { recursive: true });

    const pkg: any = {
      name: path.basename(cwd),
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts: {
        "dev": "nuclie dev",
        "build": "nuclie build",
        "preview": "nuclie dev --port 4173"
      },
      dependencies: {},
      devDependencies: {
        "nuclie": "latest",
        "typescript": "^5.0.0"
      }
    };

    if (template.includes('react')) {
      pkg.dependencies = {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        ...(template.includes('router') ? { "react-router-dom": "^6.20.0" } : {})
      };
      if (template.includes('ts')) {
        pkg.devDependencies["@types/react"] = "^18.2.0";
        pkg.devDependencies["@types/react-dom"] = "^18.2.0";
      }
    } else if (template.includes('vue')) {
      pkg.dependencies = { "vue": "^3.3.0" };
    } else if (template.includes('svelte')) {
      pkg.dependencies = { "svelte": "^4.2.0" };
    } else if (template.includes('solid')) {
      pkg.dependencies = { "solid-js": "^1.8.17" };
      pkg.devDependencies["babel-preset-solid"] = "^1.8.17";
      pkg.devDependencies["@babel/core"] = "^7.24.0";
    } else if (template.includes('preact')) {
      pkg.dependencies = { "preact": "^10.19.0" };
    } else if (template.includes('qwik')) {
      pkg.dependencies = { "@builder.io/qwik": "^1.4.3" };
    } else if (template.includes('lit')) {
      pkg.dependencies = { "lit": "^3.1.2" };
    } else if (template.includes('mithril')) {
      pkg.dependencies = { "mithril": "^2.2.2" };
    } else if (template.includes('alpine')) {
      pkg.dependencies = { "alpinejs": "^3.13.3" };
    }

    if (!template.includes('ts')) {
      delete pkg.devDependencies["typescript"];
    }

    await fs.writeFile(path.join(cwd, 'package.json'), JSON.stringify(pkg, null, 2));

    const getPremiumCss = (hexBase: string, hexRgbMap: string, buttonColor: string, shadowHex: string) => `
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.app-container {
  max-width: 900px;
  width: 100%;
  padding: 4rem 2rem;
  text-align: center;
}

.badge {
  background: rgba(${hexRgbMap}, 0.2);
  color: ${hexBase};
  padding: 0.3rem 0.8rem;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(${hexRgbMap}, 0.3);
}

.hero h1 {
  font-size: 4.5rem;
  margin: 1rem 0;
  background: linear-gradient(135deg, #f8fafc, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
}

.hero .subtitle {
  font-size: 1.25rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 16px;
  text-align: left;
  transition: transform 0.2s, background 0.2s;
}

.feature-card:hover {
  transform: translateY(-2px);
  background: rgba(30, 41, 59, 0.8);
}

.feature-card h3 {
  margin: 0 0 1rem 0;
  color: #f8fafc;
  font-size: 1.1rem;
}

.feature-card p {
  margin: 0;
  color: #94a3b8;
  line-height: 1.5;
  font-size: 0.95rem;
}

.interactive-btn {
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  background: ${buttonColor};
  color: white;
  margin-top: 10px;
  box-shadow: 0 4px 14px 0 ${shadowHex};
  font-weight: 600;
  transition: transform 0.2s;
}

.interactive-btn:hover {
  transform: scale(1.05);
}

.code-area {
  background: #020617;
  padding: 1.5rem;
  border-radius: 12px;
  font-family: 'Fira Code', ui-monospace, monospace;
  font-size: 0.9rem;
  text-align: left;
  line-height: 1.6;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 3rem;
}

.footer {
  color: #64748b;
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 2rem;
}

.footer a {
  color: #3b82f6;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
`;

    if (template.includes('react')) {
      const jsxExt = template.includes('ts') ? 'tsx' : 'jsx';
      await fs.writeFile(path.join(cwd, `src/main.${jsxExt}`), `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
      `.trim());

      await fs.writeFile(path.join(cwd, `src/App.${jsxExt}`), `
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
<div className="app-container">
      <header className="hero">
        <span className="badge">v1.0.0 Stable</span>
        <h1>Nuclie <span style={{color: '#61dafb'}}>+ React</span></h1>
        <p className="subtitle">
          The high-performance build engine for modern web applications.<br/>
          Engineered for speed. Built for stability.
        </p>
      </header>
      <main className="features">
        <div className="feature-card">
          <h3>Native Core</h3>
          <p>Rust-powered hashing and scanning for lightning-fast module resolution.</p>
        </div>
        <div className="feature-card">
          <h3>Sub-100ms HMR</h3>
          <p>Instant feedback loop with state preservation across all major frameworks.</p>
        </div>
        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Interactive React</h3>
          <p><button className="interactive-btn" onClick={() => setCount(c => c + 1)}>Count is: {count}</button></p>
        </div>
      </main>
      <div className="code-area">
        <span style={{ color: '#6366F1' }}>$</span> nuclie build --optimize
        <br />
        <span style={{ color: '#94A3B8', opacity: 0.6 }}>// Generating optimized production bundle...</span>
        <br />
        <span style={{ color: '#10B981' }}>✓ Build complete in 1.4s</span>
      </div>
      <footer className="footer">
        Powered by <a href="https://nuclie.dev" target="_blank" rel="noopener noreferrer">Nuclie Build Tool</a>
      </footer>
    </div>
  );
}

export default App;
      `.trim());

      await fs.writeFile(path.join(cwd, 'src/index.css'), getPremiumCss('#93c5fd', '97, 218, 251', '#3b82f6', 'rgba(59, 130, 246, 0.4)'));
    } else if (template.includes('solid')) {
      const jsxExt = template.includes('ts') ? 'tsx' : 'jsx';
      await fs.writeFile(path.join(cwd, `src/index.${jsxExt}`), `
/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (root) {
  render(() => <App />, root);
}
      `.trim());

      await fs.writeFile(path.join(cwd, `src/App.${jsxExt}`), `
import { createSignal } from 'solid-js';

function App() {
  const [count, setCount] = createSignal(0);

  return (
<div class="app-container">
      <header class="hero">
        <span class="badge">v1.0.0 Stable</span>
        <h1>Nuclie <span style={{color: '#446b9e'}}>+ SolidJS</span></h1>
        <p class="subtitle">
          The high-performance build engine for modern web applications.<br/>
          Engineered for speed. Built for stability.
        </p>
      </header>
      <main class="features">
        <div class="feature-card">
          <h3>Native Core</h3>
          <p>Rust-powered hashing and scanning for lightning-fast module resolution.</p>
        </div>
        <div class="feature-card">
          <h3>Sub-100ms HMR</h3>
          <p>Instant feedback loop with state preservation across all major frameworks.</p>
        </div>
        <div class="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Interactive SolidJS</h3>
          <p><button class="interactive-btn" onClick={() => setCount(count() + 1)}>Count is: {count()}</button></p>
        </div>
      </main>
      <div class="code-area">
        <span style={{ color: '#6366F1' }}>$</span> nuclie build --optimize
        <br />
        <span style={{ color: '#94A3B8', opacity: 0.6 }}>// Generating optimized production bundle...</span>
        <br />
        <span style={{ color: '#10B981' }}>✓ Build complete in 1.4s</span>
      </div>
      <footer class="footer">
        Powered by <a href="https://nuclie.dev" target="_blank" rel="noopener noreferrer">Nuclie Build Tool</a>
      </footer>
    </div>
  );
}

export default App;
      `.trim());

      await fs.writeFile(path.join(cwd, 'src/index.css'), getPremiumCss('#93c5fd', '68, 107, 158', '#446b9e', 'rgba(68, 107, 158, 0.4)'));
    } else if (template.includes('vue')) {
      await fs.writeFile(path.join(cwd, 'src/main.ts'), `
import { createApp } from 'vue';
import App from './App.vue';
import './index.css';

createApp(App).mount('#root');
      `.trim());

      await fs.writeFile(path.join(cwd, 'src/App.vue'), `
<template>
<div class="app-container">
      <header class="hero">
        <span class="badge">v1.0.0 Stable</span>
        <h1>Nuclie <span style={{color: '#42b883'}}>+ Vue</span></h1>
        <p class="subtitle">
          The high-performance build engine for modern web applications.<br/>
          Engineered for speed. Built for stability.
        </p>
      </header>
      <main class="features">
        <div class="feature-card">
          <h3>Native Core</h3>
          <p>Rust-powered hashing and scanning for lightning-fast module resolution.</p>
        </div>
        <div class="feature-card">
          <h3>Sub-100ms HMR</h3>
          <p>Instant feedback loop with state preservation across all major frameworks.</p>
        </div>
        <div class="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Interactive Vue</h3>
          <p><button class="interactive-btn" @click="count++">Count is: {{ count }}</button></p>
        </div>
      </main>
      <div class="code-area">
        <span style={{ color: '#6366F1' }}>$</span> nuclie build --optimize
        <br />
        <span style={{ color: '#94A3B8', opacity: 0.6 }}>// Generating optimized production bundle...</span>
        <br />
        <span style={{ color: '#10B981' }}>✓ Build complete in 1.4s</span>
      </div>
      <footer class="footer">
        Powered by <a href="https://nuclie.dev" target="_blank" rel="noopener noreferrer">Nuclie Build Tool</a>
      </footer>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const count = ref(0);
</script>
      `.trim());

      await fs.writeFile(path.join(cwd, 'src/index.css'), getPremiumCss('#86efac', '66, 184, 131', '#10b981', 'rgba(16, 185, 129, 0.4)'));
    } else if (template.includes('svelte')) {
      await fs.writeFile(path.join(cwd, 'src/main.ts'), `
import App from './App.svelte';
import './index.css';

const app = new App({
  target: document.getElementById('root')!,
});

export default app;
      `.trim());

      await fs.writeFile(path.join(cwd, 'src/App.svelte'), `
<script lang="ts">
  let count = 0;
</script>

<div class="app-container">
      <header class="hero">
        <span class="badge">v1.0.0 Stable</span>
        <h1>Nuclie <span style={{color: '#ff3e00'}}>+ Svelte</span></h1>
        <p class="subtitle">
          The high-performance build engine for modern web applications.<br/>
          Engineered for speed. Built for stability.
        </p>
      </header>
      <main class="features">
        <div class="feature-card">
          <h3>Native Core</h3>
          <p>Rust-powered hashing and scanning for lightning-fast module resolution.</p>
        </div>
        <div class="feature-card">
          <h3>Sub-100ms HMR</h3>
          <p>Instant feedback loop with state preservation across all major frameworks.</p>
        </div>
        <div class="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Interactive Svelte</h3>
          <p><button class="interactive-btn" on:click={() => count++}>Count is: {count}</button></p>
        </div>
      </main>
      <div class="code-area">
        <span style={{ color: '#6366F1' }}>$</span> nuclie build --optimize
        <br />
        <span style={{ color: '#94A3B8', opacity: 0.6 }}>// Generating optimized production bundle...</span>
        <br />
        <span style={{ color: '#10B981' }}>✓ Build complete in 1.4s</span>
      </div>
      <footer class="footer">
        Powered by <a href="https://nuclie.dev" target="_blank" rel="noopener noreferrer">Nuclie Build Tool</a>
      </footer>
    </div>
      `.trim());

      await fs.writeFile(path.join(cwd, 'src/index.css'), getPremiumCss('#fca5a5', '255, 62, 0', '#ef4444', 'rgba(239, 68, 68, 0.4)'));
    } else if (template.includes('preact')) {
      const jsxExt = template.includes('ts') ? 'tsx' : 'jsx';
      await fs.writeFile(path.join(cwd, `src/main.${jsxExt}`), `
import { render, h } from 'preact';
import App from './App';
import './index.css';

render(<App />, document.getElementById('root') as HTMLElement);
      `.trim());

      await fs.writeFile(path.join(cwd, `src/App.${jsxExt}`), `
import { h } from 'preact';
import { useState } from 'preact/hooks';

function App() {
  const [count, setCount] = useState(0);

  return (
<div class="app-container">
      <header class="hero">
        <span class="badge">v1.0.0 Stable</span>
        <h1>Nuclie <span style={{color: '#673ab7'}}>+ Preact</span></h1>
        <p class="subtitle">
          The high-performance build engine for modern web applications.<br/>
          Engineered for speed. Built for stability.
        </p>
      </header>
      <main class="features">
        <div class="feature-card">
          <h3>Native Core</h3>
          <p>Rust-powered hashing and scanning for lightning-fast module resolution.</p>
        </div>
        <div class="feature-card">
          <h3>Sub-100ms HMR</h3>
          <p>Instant feedback loop with state preservation across all major frameworks.</p>
        </div>
        <div class="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Interactive Preact</h3>
          <p><button class="interactive-btn" onClick={() => setCount(count + 1)}>Count is: {count}</button></p>
        </div>
      </main>
      <div class="code-area">
        <span style={{ color: '#6366F1' }}>$</span> nuclie build --optimize
        <br />
        <span style={{ color: '#94A3B8', opacity: 0.6 }}>// Generating optimized production bundle...</span>
        <br />
        <span style={{ color: '#10B981' }}>✓ Build complete in 1.4s</span>
      </div>
      <footer class="footer">
        Powered by <a href="https://nuclie.dev" target="_blank" rel="noopener noreferrer">Nuclie Build Tool</a>
      </footer>
    </div>
  );
}

export default App;
      `.trim());

      await fs.writeFile(path.join(cwd, 'src/index.css'), getPremiumCss('#c4b5fd', '103, 58, 183', '#7c3aed', 'rgba(124, 58, 237, 0.4)'));
    } else if (template.includes('qwik')) {
      const jsxExt = template.includes('ts') ? 'tsx' : 'jsx';
      await fs.writeFile(path.join(cwd, `src/root.${jsxExt}`), `
import { component$, useSignal } from '@builder.io/qwik';
import './index.css';

export default component$(() => {
  const count = useSignal(0);
  return (
<div class="app-container">
      <header class="hero">
        <span class="badge">v1.0.0 Stable</span>
        <h1>Nuclie <span style={{color: '#18b6f6'}}>+ Qwik</span></h1>
        <p class="subtitle">
          The high-performance build engine for modern web applications.<br/>
          Engineered for speed. Built for stability.
        </p>
      </header>
      <main class="features">
        <div class="feature-card">
          <h3>Native Core</h3>
          <p>Rust-powered hashing and scanning for lightning-fast module resolution.</p>
        </div>
        <div class="feature-card">
          <h3>Sub-100ms HMR</h3>
          <p>Instant feedback loop with state preservation across all major frameworks.</p>
        </div>
        <div class="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Interactive Qwik</h3>
          <p><button class="interactive-btn" onClick$={() => count.value++}>Count is: {count.value}</button></p>
        </div>
      </main>
      <div class="code-area">
        <span style={{ color: '#6366F1' }}>$</span> nuclie build --optimize
        <br />
        <span style={{ color: '#94A3B8', opacity: 0.6 }}>// Generating optimized production bundle...</span>
        <br />
        <span style={{ color: '#10B981' }}>✓ Build complete in 1.4s</span>
      </div>
      <footer class="footer">
        Powered by <a href="https://nuclie.dev" target="_blank" rel="noopener noreferrer">Nuclie Build Tool</a>
      </footer>
    </div>
  );
});
      `.trim());

      await fs.writeFile(path.join(cwd, 'src/index.css'), getPremiumCss('#7dd3fc', '24, 182, 246', '#0ea5e9', 'rgba(14, 165, 233, 0.4)'));
    } else {
      const ext = template.includes('ts') ? 'ts' : 'js';
      await fs.writeFile(path.join(cwd, `src/main.${ext}`), `
document.querySelector<HTMLDivElement>('#app')!.innerHTML = \`
  <div>
    <h1>Nuclie App</h1>
    <p>Edit <code>src/main.${ext}</code> to get started</p>
  </div>
\`;
      `.trim());
    }

    let entryScript = template.includes('solid')
      ? `/src/index.${template.includes('ts') ? 'tsx' : 'jsx'}`
      : template.includes('react') || template.includes('preact')
        ? `/src/main.${template.includes('ts') ? 'tsx' : 'jsx'}`
        : `/src/main.${template.includes('ts') ? 'ts' : 'js'}`;

    if (template.includes('qwik')) {
      entryScript = `/src/root.${template.includes('ts') ? 'tsx' : 'jsx'}`;
    }

    await fs.writeFile(path.join(cwd, 'index.html'), `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nuclie App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${entryScript}"></script>
  </body>
</html>
    `.trim());

    let adapter = 'vanilla';
    let entryFile = `src/main.${template.includes('ts') ? 'ts' : 'js'}`;

    if (template.includes('react')) { adapter = 'react'; entryFile = `src/main.${template.includes('ts') ? 'tsx' : 'jsx'}`; }
    else if (template.includes('vue')) { adapter = 'vue'; }
    else if (template.includes('svelte')) { adapter = 'svelte'; }
    else if (template.includes('solid')) { adapter = 'solid'; entryFile = `src/index.${template.includes('ts') ? 'tsx' : 'jsx'}`; }
    else if (template.includes('preact')) { adapter = 'preact'; entryFile = `src/main.${template.includes('ts') ? 'tsx' : 'jsx'}`; }
    else if (template.includes('qwik')) { adapter = 'qwik'; entryFile = `src/root.${template.includes('ts') ? 'tsx' : 'jsx'}`; }

    const config = {
      entry: [entryFile],
      mode: "development",
      preset: "spa",
      platform: "browser",
      adapter
    };
    await fs.writeFile(path.join(cwd, 'nuclie.config.json'), JSON.stringify(config, null, 2));
  }

  log.success(`Successfully bootstrapped ${template} project!`);
  log.info(`To get started:\n  cd ${path.basename(cwd)}\n  npm install\n  npm run dev`);
}
