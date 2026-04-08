export default {
  preset: 'spa',
  entryPoints: ['./src/index.jsx'],
  publicPath: '/',
  outDir: './dist',
  server: { port: 3001 },
  federation: {
    name: 'navApp',
    filename: 'remoteEntry.js',
    exposes: { './Header': './src/Header.jsx' },
    shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
  }
};
