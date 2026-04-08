export default {
  preset: 'spa',
  entryPoints: ['./src/index.jsx'],
  outDir: './dist',
  server: { port: 3010 },
  federation: {
    name: 'hostApp',
    remotes: {
      tasksApp:     'http://localhost:3011/remoteEntry.js',
      analyticsApp: 'http://localhost:3012/remoteEntry.js'
    },
    shared: {
      react: { singleton: true, requiredVersion: '^18.0.0' },
      'react-dom': { singleton: true, requiredVersion: '^18.0.0' }
    }
  }
};
