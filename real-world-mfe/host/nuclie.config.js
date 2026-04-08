export default {
  preset: 'spa',
  entryPoints: ['./src/index.jsx'],
  publicPath: '/mfe/host/',
  outDir: './dist',
  server: { port: 3010 },
  federation: {
    name: 'hostApp',
    remotes: {
      navApp: '/mfe/nav/remoteEntry.js'
    },
    shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
  }
};
