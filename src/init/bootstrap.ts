
import fs from 'fs/promises';
import path from 'path';
import { log } from '../utils/logger.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function bootstrapProject(cwd: string, template: string = 'react') {
  log.info(`Bootstrapping new ${template} project in ${cwd}`);

  // 1. Check if template exists in templates/standard/
  const templateDir = path.join(__dirname, '..', '..', 'templates', 'standard', template);

<<<<<<< HEAD
  // 2. Create package.json
  const pkg = {
    name: path.basename(cwd),
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      "dev": "nuclie dev",
      "build": "nuclie build",
      "preview": "nuclie dev --port 4173"
    },
    dependencies: (template === 'react' || template === 'react-ts') ? {
      "react": "^19.2.3",
      "react-dom": "^19.2.3"
    } : {},
    devDependencies: {
      "nuclie": "latest",
      "typescript": "^5.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0"
=======
  if (await fs.access(templateDir).then(() => true).catch(() => false)) {
    log.info(`Copying template from ${templateDir}`);
    // Copy all files
    await fs.cp(templateDir, cwd, { recursive: true });

    // Create basic package.json if it doesn't have one
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
        pkg.dependencies = { "solid-js": "^1.8.1" };
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

      // Determine entry point based on template
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

      const config = {
        entry: [entryFile],
        mode: "development",
        preset: "spa",
        platform: "browser",
        adapter
      };
      await fs.writeFile(path.join(cwd, 'nuclie.config.json'), JSON.stringify(config, null, 2));
>>>>>>> 6fcaca356ddb76eea1edeb70e0632e8438290c74
    }
  } else {
    log.info(`Template ${template} not found in physical templates, using programmatic fallback...`);
    // 1. Create directory structure
    await fs.mkdir(path.join(cwd, 'src'), { recursive: true });
    await fs.mkdir(path.join(cwd, 'public'), { recursive: true });

<<<<<<< HEAD
  // 3. Create initial source files
  if (template === 'react' || template === 'react-ts') {
    await fs.writeFile(path.join(cwd, 'src/main.tsx'), `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
=======
    // 2. Create package.json
    const pkg = {
      name: path.basename(cwd),
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts: {
        "dev": "nuclie dev",
        "build": "nuclie build",
        "preview": "nuclie dev --port 4173"
      },
      dependencies: template.includes('react') ? {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      } : {},
      devDependencies: {
        "nuclie": "latest",
        "typescript": "^5.0.0"
      }
    };
    await fs.writeFile(path.join(cwd, 'package.json'), JSON.stringify(pkg, null, 2));
>>>>>>> 6fcaca356ddb76eea1edeb70e0632e8438290c74

    // 3. Create initial source files
    if (template.includes('react')) {
      await fs.writeFile(path.join(cwd, 'src/main.tsx'), `
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

      await fs.writeFile(path.join(cwd, 'src/App.tsx'), `
  import React, { useState } from 'react';

  function App() {
    const [count, setCount] = useState(0);

    return (
      <div className="App">
        <h1>Nuclie + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
      </div>
    );
  }

  export default App;
          `.trim());

      await fs.writeFile(path.join(cwd, 'src/index.css'), `
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #242424;
    color: white;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
  }
          `.trim());
    }

    // 4. Create index.html
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
      <script type="module" src="/src/main.tsx"></script>
    </body>
  </html>
      `.trim());

    // 5. Create nuclie.config.json
    const config = {
      entry: ["src/main.tsx"],
      mode: "development",
      preset: "spa",
      platform: "browser"
    };
    await fs.writeFile(path.join(cwd, 'nuclie.config.json'), JSON.stringify(config, null, 2));
  }

  log.success(`Successfully bootstrapped ${template} project!`);
  log.info(`To get started:\n  cd ${path.basename(cwd)}\n  npm install\n  npm run dev`);
}
