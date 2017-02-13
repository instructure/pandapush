const path = require('path');

module.exports = {
  entry: path.join(__dirname, './index.js'),
  output: {
    filename: './client/dist/client.js',
    library: 'Pandapush',
    libraryTarget: 'umd'
  },
  module: {}
};
