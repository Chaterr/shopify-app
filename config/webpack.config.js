const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const isDevelopment = process.env.NODE_ENV !== 'production';

const sourceMap = isDevelopment;

const plugins = isDevelopment
  ? [
      // new BundleAnalyzerPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
        },
        minimize: true,
      }),
    ]
  : [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
        },
        minimize: true,
      }),
    ];

const extraEntryFiles = isDevelopment
  ? ['react-hot-loader/patch', 'webpack-hot-middleware/client']
  : [];

module.exports = {
  plugins,
  target: 'web',
  devtool: 'eval',
  entry: {
    main: [
      ...extraEntryFiles,
      // '@shopify/polaris/styles.css',
      path.resolve(__dirname, '../client/index.js'),
      path.resolve(__dirname, '../client/components/style/style.scss'),
    ],
  },
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, '../assets'),
    publicPath: '/assets/',
    libraryTarget: 'var',
  },
  module: {
    loaders: [
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
