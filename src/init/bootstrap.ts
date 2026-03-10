import fs from 'fs/promises';
import path from 'path';
import { TEMPLATES } from '../utils/templates.js';
import { log } from '../utils/logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function bootstrapProject(cwd: string, template: string = 'react-ts') {
  log.info(`Bootstrapping new ${template} project in ${cwd}...`);

  // 1. Get current nuclie version for package.json
  let nuclieVersion = 'latest';
  try {
    const pkgPath = path.resolve(__dirname, '../../package.json');
    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
    nuclieVersion = `^${pkg.version}`;
  } catch (e) { /* fallback to latest */ }

  // 2. Look up template definition from shared TEMPLATES registry
  const templateDef = TEMPLATES[template];

  if (!templateDef) {
    log.warn(`Unknown template "${template}". Available: ${Object.keys(TEMPLATES).join(', ')}`);
    log.warn('Falling back to react-ts...');
  }

  const def = templateDef ?? TEMPLATES['react-ts'];

  // 3. Check for physical template directory first (overrides programmatic)
  const templateDir = path.join(__dirname, '..', '..', 'templates', 'standard', template);
  const hasPhysical = await fs.access(templateDir).then(() => true).catch(() => false);

  if (hasPhysical) {
    log.info(`Copying physical template from ${templateDir}`);
    await fs.cp(templateDir, cwd, { recursive: true });
  } else {
    // 4. Write all files from the TEMPLATES definition (single source of truth)
    log.info(`Scaffolding ${def.name} from template registry...`);

    // Create src and public dirs
    await fs.mkdir(path.join(cwd, 'src'), { recursive: true });
    await fs.mkdir(path.join(cwd, 'public'), { recursive: true });

    // Write every file defined in the template, replacing version placeholder
    const versionLabel = nuclieVersion.replace('^', '');
    for (const file of def.files) {
      const filePath = path.join(cwd, file.path);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      const content = file.content.replace(/\{\{NUCLIE_VERSION\}\}/g, versionLabel);
      await fs.writeFile(filePath, content, 'utf8');
    }
  }

  // 5. Always write a fresh package.json with the correct nuclie version
  const pkg = {
    name: path.basename(cwd),
    version: '0.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'nuclie dev',
      build: 'nuclie build',
      preview: 'nuclie dev --port 4173'
    },
    dependencies: { ...def.dependencies },
    devDependencies: {
      nuclie: nuclieVersion,
      ...def.devDependencies
    }
  };
  await fs.writeFile(path.join(cwd, 'package.json'), JSON.stringify(pkg, null, 2), 'utf8');

  // 6. Derive adapter and entry from the template's index.html
  const adapterMap: Record<string, string> = {
    react: 'react', vue: 'vue', svelte: 'svelte', solid: 'solid',
    preact: 'preact', qwik: 'qwik', lit: 'lit', alpine: 'alpine', 'alpine-ts': 'alpine',
    mithril: 'mithril', 'mithril-ts': 'mithril', vanilla: 'vanilla', 'vanilla-ts': 'vanilla'
  };
  const adapter = Object.entries(adapterMap).find(([k]) => template.includes(k))?.[1] ?? 'vanilla';

  // Find the entry file from the template files list
  const entryFile = def.files.find(f =>
    f.path.startsWith('src/') && (
      f.path.endsWith('.tsx') || f.path.endsWith('.ts') ||
      f.path.endsWith('.jsx') || f.path.endsWith('.js') ||
      f.path.endsWith('.svelte')
    )
  )?.path ?? 'src/main.ts';

  const config = {
    entry: [entryFile],
    mode: 'development',
    preset: 'spa',
    platform: 'browser',
    adapter
  };
  await fs.writeFile(path.join(cwd, 'nuclie.config.json'), JSON.stringify(config, null, 2), 'utf8');

  log.success(`Successfully bootstrapped ${def.name} project!`);
  log.info(`To get started:\n  cd ${path.basename(cwd)}\n  npm install\n  npm run dev`);
}
