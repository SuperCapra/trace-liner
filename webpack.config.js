const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: './src/App.js',
  output: {
    filename: 'App.min.js',
    path: path.resolve(__dirname, 'build'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
};