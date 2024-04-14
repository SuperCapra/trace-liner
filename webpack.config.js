const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/App.js',
  output: {
    filename: 'App.min.js',
    path: path.resolve(__dirname, 'build'),
  },
};