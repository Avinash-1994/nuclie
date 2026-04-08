import { build } from './dist/build/bundler.js';
(async () => {
  await build({
    root: process.cwd() + '/mfe-demo/remote',
    entry: './src/index.jsx',
    outDir: './build_output',
    federation: {
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: { './Dashboard': './src/Dashboard.jsx' }
    }
  });

  await build({
    root: process.cwd() + '/mfe-demo/host',
    entry: './src/index.jsx',
    outDir: './build_output',
    federation: {
      name: 'hostApp',
      remotes: { remoteApp: 'http://localhost:3001/remoteEntry.js' }
    }
  });
})();
