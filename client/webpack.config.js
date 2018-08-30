const path = require("path");

module.exports = {
  entry: path.join(__dirname, "./index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "client.js",
    library: "Pandapush",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
