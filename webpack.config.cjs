const path = require("path");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV === "development";

const baseFilename = isDev ? "index" : "index.[contenthash]";

module.exports = {
  mode: isDev ? "development" : "production",
  entry: [
    path.resolve(__dirname, "website", "js", "index.js")
  ],
  output: {
    path: path.resolve(__dirname, "_site", "assets"),
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
    new MiniCssExtractPlugin({ filename: `${baseFilename}.css` }),
    new WebpackManifestPlugin({ publicPath: "/assets/" }),
  ],
};