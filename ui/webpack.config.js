module.exports = {
  entry: "./main.js",
  output: {
    filename: "./public/admin/bundle.js"
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader'},
    ]
  }
};
