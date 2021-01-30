const path = require('path')

module.exports = {
  mode: 'development',
  entry: { domToImage: './src/js/domToImage.js', editDomToImage: './src/js/editDomToImage.js' },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].bundle.js',
  }
}
