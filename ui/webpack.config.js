const path = require('path');

module.exports = {
  entry: [ "whatwg-fetch", path.join(__dirname, './main.js') ],
  output: {
    filename: "./ui/public/admin/bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};
