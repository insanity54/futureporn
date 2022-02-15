const path = require("path");
const webpack = require('webpack')
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { merge } = require('webpack-merge')


const isDev = (process.env.NODE_ENV === "development");
const baseFilename = isDev ? "index" : "index.[contenthash]";


const paths = {
  build: path.resolve(__dirname, "_site", "assets")
}


const prod = {
  mode: 'production',
  devtool: false,
  output: {
    path: paths.build,
    publicPath: '/',
    filename: '[name].[contenthash].bundle.js'
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  // fix: https://github.com/webpack/webpack-dev-server/issues/2758
  target: 'browserslist'
}


const dev = {
  // Set the mode to development or production
  mode: 'development',

  // Control how source maps are generated
  devtool: 'inline-source-map'
}


const common = {
  entry: [
    path.resolve(__dirname, "website", "js", "index.js")
  ],
  output: {
    path: paths.build,
    filename: `${baseFilename}.js`,
  },
  module: {
    rules: [
          {
        test: /\.(ttf|eot|svg|woff|woff2)$/,
        type: 'asset'
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    esmodules: true
                  }
                }
              ]
            ],
          }
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                resources: ['./website/css/variables.scss']
              }
            }
          ]
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: `${baseFilename}.css` }),
    new WebpackManifestPlugin({ publicPath: "/assets/" }),
    // fixes Module not found: Error: Can't resolve 'stream' in '.../node_modules/nofilter/lib'
    new NodePolyfillPlugin(),
    // Note: stream-browserify has assumption about `Buffer` global in its
    // dependencies causing runtime errors. This is a workaround to provide
    // global `Buffer` until https://github.com/isaacs/core-util-is/issues/29
    // is fixed.
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    }),
  ],
};

module.exports = () => {
  const config = isDev ? dev : prod
  return merge(common, config)
}
