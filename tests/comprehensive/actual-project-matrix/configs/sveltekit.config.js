
module.exports = {
  root: '.',
  entry: ['./src/main.ts'],
  outDir: './dist',
  framework: 'svelte',
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