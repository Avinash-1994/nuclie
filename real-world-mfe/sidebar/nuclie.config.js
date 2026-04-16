export default {
  preset: 'spa',
  entryPoints: ['./src/preview.js'],
  publicPath: '/',
  outDir: './dist',
  server: { port: 3003, strictPort: true },
  framework: 'vue',
  federation: {
    name: 'sidebarApp',
    filename: 'remoteEntry.js',
    exposes: {
      './Sidebar': './src/index.js'
    }
  }
};
