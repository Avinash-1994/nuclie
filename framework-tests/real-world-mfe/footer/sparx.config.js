export default {
  preset: 'spa',
  framework: 'react',
  entryPoints: ['./src/preview.jsx'],
  publicPath: '/',
  outDir: './dist',
  server: { port: 3002, strictPort: true },
  federation: {
    name: 'footerApp',
    filename: 'remoteEntry.js',
    exposes: { './Footer': './src/Footer.jsx' },
    shared: {
      react: { singleton: true, requiredVersion: '^19.2.3', import: 'react' },
      'react-dom': { singleton: true, requiredVersion: '^19.2.3', import: 'react-dom' }
    }
  }
};
