export default {
  preset: 'spa',
  entryPoints: ['./src/index.jsx'],
  publicPath: '/',
  outDir: './dist',
  server: { port: 3001, strictPort: true },
  framework: 'react',
  federation: {
    name: 'navApp',
    filename: 'remoteEntry.js',
    exposes: { './Header': './src/Header.jsx' },
    shared: {
      react: { singleton: true, requiredVersion: '^19.2.3', import: 'react' },
      'react-dom': { singleton: true, requiredVersion: '^19.2.3', import: 'react-dom' }
    }
  }
};
