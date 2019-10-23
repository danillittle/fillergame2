const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader',
      },
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      // {
      //   test: /\.s[ac]ss$/i,
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: ['css-loader', 'sass-loader'],
      //   }),
      // },
    ],
  },
  plugins: [
    new CleanTerminalPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new ExtractTextPlugin('style.[hash].css'),
  ],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'index.[hash].js',
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    compress: true,
    port: 9000,
  },
  stats: 'errors-warnings',
};
