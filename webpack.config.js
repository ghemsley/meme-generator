const path = require('path')

module.exports = {
  mode: 'development',
  entry: { domToImage: './src/js/domToImage.js' },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].bundle.js',
  }
}
