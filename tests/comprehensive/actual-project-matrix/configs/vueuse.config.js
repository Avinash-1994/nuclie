
module.exports = {
  root: '.',
  entry: ['./src/main.ts'],
  outDir: './dist',
  framework: 'vue',
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