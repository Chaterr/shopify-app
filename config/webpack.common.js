const path = require('path');
const isDevelopment = process.env.NODE_ENV !== 'production';

const sourceMap = isDevelopment;

module.exports = {
  target: 'web',
  devtool: 'eval',

  entry: ['babel-polyfill', path.resolve(__dirname, '../client/index.js')],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../assets'),
    publicPath: '/assets/',
    libraryTarget: 'var',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, '../client/components/style'),
        exclude: /node_modules/,
        loaders: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              plugins: () => autoprefixer(),
              sourceMap,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            query: {
              sourceMap,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]-[local]_[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => autoprefixer(),
              sourceMap,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true, // true outputs JSX tags
            },
          },
        ],
      },
    ],
  },
};
