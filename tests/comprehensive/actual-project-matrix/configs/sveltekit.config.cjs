
module.exports = {
  root: '.',
  entry: ['./src/routes/+page.svelte'],
  outDir: './dist',
  framework: 'svelte',
  build: {
    minify: true,
    sourcemap: 'external',
    cssModules: true,
  },
  dev: {
    port: 3000,
    hmr: true,
  },
  federation: {
    name: 'nuclie_remote',
    filename: 'remoteEntry.js',
    exposes: {
      './App': './src/main.ts'
    }
  }
};