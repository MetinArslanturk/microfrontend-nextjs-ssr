const path = require('path');

module.exports = {
  entry: './server/server.js',
  target: 'node',
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
    path: path.resolve(__dirname, 'server-dist'),
    clean: true,
  },
};
