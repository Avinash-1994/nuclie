export default {
  preset: 'spa',
  entryPoints: ['./src/index.jsx'],
  publicPath: '/mfe/host/',
  outDir: './dist',
  server: { port: 3000, strictPort: true },
  federation: {
    name: 'hostApp',
    remotes: {
      navApp: 'http://localhost:3001/remoteEntry.js',
      sidebarApp: 'http://localhost:3003/remoteEntry.js',
      footerApp: 'http://localhost:3002/remoteEntry.js',
      bannerApp: 'http://localhost:3004/remoteEntry.js'
    },
    shared: {
      react: { singleton: true, requiredVersion: '^19.2.3', import: 'react' },
      'react-dom': { singleton: true, requiredVersion: '^19.2.3', import: 'react-dom' }
    }
  }
};
