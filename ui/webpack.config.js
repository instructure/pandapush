const path = require("path");

module.exports = {
  entry: ["whatwg-fetch", path.join(__dirname, "./main.js")],
  output: {
    path: path.resolve(__dirname, "public/admin"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        }
      }
    ]
  }
};
