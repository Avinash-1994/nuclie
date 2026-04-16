module.exports = {
  entry: './src/index.jsx',
  outDir: './build_output',
  port: 3001,
  federation: {
    name: 'remoteApp',
    filename: 'remoteEntry.js',
    exposes: {
      './Dashboard': './src/Dashboard.jsx'
    },
    shared: {
      react: { singleton: true },
      'react-dom': { singleton: true }
    }
  }
};