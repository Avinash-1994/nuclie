export default {
  preset: 'spa',
  framework: 'svelte',
  entryPoints: ['./src/preview.js'],
  publicPath: '/',
  outDir: './dist',
  server: { port: 3004, strictPort: true },
  federation: {
    name: 'bannerApp',
    filename: 'remoteEntry.js',
    exposes: { './Banner': './src/preview.js' }
  }
};
