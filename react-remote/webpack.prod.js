const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const moduleFederationConf = require("./module-federation.config.js");
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new ModuleFederationPlugin(
      moduleFederationConf.config
    ),
    new WebpackShellPluginNext({
      onAfterDone:{
        scripts: ['node postbuild.js'],
        blocking: true,
        parallel: false
      }
    })
  ],
};
