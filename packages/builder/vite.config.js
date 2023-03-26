const copy = require('rollup-plugin-copy')

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

  ]
}