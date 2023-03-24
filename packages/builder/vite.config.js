const copy = require('rollup-plugin-copy')
const vue = require('@vitejs/plugin-vue')

export default {
  appType: "mpa",
  server: {
    mode: 'development',
    middlewareMode: true
  },
  build: {
    mode: "production"
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => [
            'vm-video',
            'vm-ui',
            'vm-player'
          ].includes(tag)
        }
      }
    })
  ]
}