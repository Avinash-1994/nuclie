
module.exports = {
  root: '.',
  entry: ['./src/index.ts'],
  outDir: './dist',
  framework: 'react',
  plugins: [],
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
    name: 'urja_remote',
    filename: 'remoteEntry.js',
    exposes: {
      './App': './src/index.tsx'
    }
  }
};