const copy = require('rollup-plugin-copy')


export default {
  appType: "mpa",
  server: {
    mode: 'development',
    middlewareMode: true
  },
  build: {
    // rollupOptions: {
    //   plugins: [
    //     copy({
    //       targets: [
    //         { src: '.11ty-vite/api/*.json', dest: '_site/api' },
    //         { src: '.11ty-vite/feed/*.xml', dest: '_site/feed' },
    //         { src: '.11ty-vite/sitemap.xml', dest: '_site' }
    //       ]
    //     })
    //   ]
    // },
    // assetsInclude: ['api/*.json'],
    mode: "production",
  }
}