// var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: './src/js/app.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.min.js'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        // loader: ExtractTextPlugin.extract("style-loader", "css-loader", "sass-loader", "file-loader", 'url-loader')
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.css$/,
        // loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        loaders: ["style-loader", "css-loader"]

      },
      {
        test: /\.(svg|gif|png)$/,
        loaders: [
          'url-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?presets[]=es2015'
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':custom-src']
          }
        }
      }
    ]
  },
  // plugins: [
  //     new ExtractTextPlugin("[name].css"),
  // ]
};
