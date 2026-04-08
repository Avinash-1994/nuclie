export default {
  preset: 'spa',
  entryPoints: ['./src/index.jsx'],
  outDir: './dist',
  server: { port: 3011 },
  federation: {
    name: 'tasksApp',
    filename: 'remoteEntry.js',
    exposes: {
      './TaskManager': './src/TaskManager.jsx'
    },
    shared: {
      react: { singleton: true, requiredVersion: '^18.0.0' },
      'react-dom': { singleton: true, requiredVersion: '^18.0.0' }
    }
  }
};
