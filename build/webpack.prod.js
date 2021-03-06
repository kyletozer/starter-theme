const path = require('path');
const merge = require('webpack-merge');
const glob = require('glob-all');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgeCssPlugin = require('purgecss-webpack-plugin');
const common = require('./webpack.common');
const paths = require('./parts/webpack.paths');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin()
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial', // statically imported modules; excludes other types of imported modules (e.g. async)
          name: 'vendor',
          enforce: true // overrides webpack default min size for splitting
        },
        common: {
          test: /[\\/]src[\\/]scripts[\\/]/,
          chunks: 'initial',
          name: 'common',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../styles/[name].css'
    }),
    new PurgeCssPlugin({
      paths: glob.sync(
        [
          path.join(paths.src, '*.js'),
          path.join(paths.src, '**/*.js'),
          path.join(paths.root, 'templates/**')
        ],
        { nodir: true }
      )
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        },
        safe: true
      },
      canPrint: false
    })
  ]
});