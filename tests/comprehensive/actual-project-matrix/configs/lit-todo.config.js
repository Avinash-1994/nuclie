
module.exports = {
  root: '.',
  entry: ['./src/index.ts'],
  outDir: './dist',
  plugins: [],
  build: {
    minify: true,
    sourcemap: 'external',
  },
  dev: {
    port: 3000,
    hmr: true,
  },
};