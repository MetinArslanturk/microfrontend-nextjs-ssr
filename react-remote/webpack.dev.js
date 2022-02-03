const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const moduleFederationConf = require("./module-federation.config.js");
const path = require('path');

module.exports = {
  devServer: {
    port: 3002,
    static: { 
      directory: path.resolve(__dirname, './public'), 
      publicPath: '/'
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
  }
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: "development",
  plugins: [
    new ModuleFederationPlugin(moduleFederationConf.config),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
