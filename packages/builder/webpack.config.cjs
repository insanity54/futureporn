const path = require("path");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const glob = require('glob')


const isDev = process.env.NODE_ENV === "development";

const baseFilename = isDev ? "index" : "index.[contenthash]";

module.exports = {
  mode: isDev ? "development" : "production",
  entry: {
    'base': path.resolve(__dirname, "website", "js", "base.js"),
    'player': path.resolve(__dirname, "website", "js", "player.js")
  },
  output: {
    path: path.resolve(__dirname, "_site", "assets"),
    filename: '[name].js',
  },
  module: {
    rules: [
          {
        test: /\.(ttf|eot|svg|woff|woff2)$/,
        type: 'asset'
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
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
  devtool: isDev ? "eval" : "source-map",
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.resolve(__dirname, 'website')}/**/*`, { nodir: true }),
      safelist: {
        deep: [/^plyr/]
      },
      
    }),
    new WebpackManifestPlugin({ publicPath: "/assets/" })
  ],
};