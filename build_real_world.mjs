import { build } from './dist/build/bundler.js';

(async () => {
  console.log('Building Nav Application...');
  await build({
    root: process.cwd() + '/real-world-mfe/nav',
    entry: './src/index.jsx',
    outDir: './dist',
    federation: {
      name: 'navApp',
      filename: 'remoteEntry.js',
      exposes: { './Header': './src/Header.jsx' }
    }
  });

  console.log('\nBuilding Host Application...');
  await build({
    root: process.cwd() + '/real-world-mfe/host',
    entry: './src/index.jsx',
    outDir: './dist',
    federation: {
      name: 'hostApp',
      remotes: { navApp: 'http://localhost:3001/remoteEntry.js' }
    }
  });

  console.log('\nMFE Architectures Built Successfully!');
})();
