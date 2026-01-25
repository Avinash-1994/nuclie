
module.exports = {
  root: '.',
  entry: ['./src/index.tsx'],
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
};