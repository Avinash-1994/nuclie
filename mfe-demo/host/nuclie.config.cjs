module.exports = {
  entry: './src/index.jsx',
  outDir: './build_output',
  port: 3000,
  federation: {
    name: 'hostApp',
    remotes: {
      remoteApp: 'http://localhost:3001/remoteEntry.js'
    },
    shared: {
      react: { singleton: true },
      'react-dom': { singleton: true }
    }
  }
};
