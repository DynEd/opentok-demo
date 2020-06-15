var path = require('path')
var webpack = require('webpack')
// var JavaScriptObfuscator = require('webpack-obfuscator')

module.exports = {
  mode: 'production',
  entry: {
    'openvcall.client': './src/openvcall.client.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  plugins: [
      // new JavaScriptObfuscator({
      //     rotateUnicodeArray: true
      // })
  ],
  resolve: {
    alias: {},
    extensions: ['*', ".tsx", ".ts", '.js', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: 'warning'
  },
  node: {
    fs: 'empty',
    tls: 'empty',
    net: 'empty'
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  }
}