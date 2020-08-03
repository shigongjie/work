const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const isProduction = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  assetsDir: "static",
  devServer: {
    port: 8100,
    open: true,
    proxy: 'http://10.0.0.52:9051'
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('pages', resolve('src/pages'))
      .set('components', resolve('src/components'))
  },

  configureWebpack: config => {
    if (isProduction) {
      config.plugins.push(new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      )
    }
  },
  productionSourceMap:false
}
