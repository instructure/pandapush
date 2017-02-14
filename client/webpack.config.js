const path = require('path');

module.exports = {
  entry: path.join(__dirname, './index.js'),
  output: {
    filename: './client/dist/client.js',
    library: 'Pandapush',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  }
};
