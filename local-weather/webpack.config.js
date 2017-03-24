const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  }
})

const htmlWebpack = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'src', 'index.html')
})

const extractSCSS = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === 'development'
})

const extractCSS = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === 'development'
})

module.exports = {
  entry: {
    main: path.join(__dirname, 'src/scripts', 'main.js')
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src'),
        use: 'html-loader'
      }, {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/scripts'),
        loader: 'babel-loader'
      }, {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src/stylesheets'),
        loader: extractSCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }, {
        test: /\.jpg$/,
        include: path.resolve(__dirname, 'src/images'),
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.scss']
  },
  plugins: [definePlugin, htmlWebpack, extractSCSS]
}
