export default {
  preset: 'spa',
  entryPoints: ['./src/index.jsx'],
  outDir: './dist',
  server: { port: 3012 },
  federation: {
    name: 'analyticsApp',
    filename: 'remoteEntry.js',
    exposes: {
      './Analytics': './src/Analytics.jsx'
    },
    shared: {
      react: { singleton: true, requiredVersion: '^18.0.0' },
      'react-dom': { singleton: true, requiredVersion: '^18.0.0' }
    }
  }
};
