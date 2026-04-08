module.exports = {
  entry: './src/index.jsx',
  outDir: './build_output',
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
