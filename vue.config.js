const fullpages = {
  btyExplorer: {
    entry: 'src/main.js',
    template: 'public/index.html',
    filename: 'index.html'
  },
  btyCollege: {
    entry: 'src/btySinglePage/main.js',
    template: 'src/btySinglePage/views/Certificate/index.html',
    filename: 'certificate.html'
  },
  btySerialno: {
    entry: 'src/btySinglePage/main.js',
    template: 'src/btySinglePage/views/Serialno/index.html',
    filename: 'serialno.html'
  },
  btyGanme: {
    entry: 'src/btySinglePage/main.js',
    template: 'src/btySinglePage/views/Ganme/index.html',
    filename: 'ganma.html'
  },
  btyTwitter: {
    entry: 'src/btySinglePage/main.js',
    template: 'src/btySinglePage/views/Twitter/index.html',
    filename: 'twitter.html'
  },
}

module.exports = {
  outputDir: 'bty-explorer',
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        data: `@import "@/assets/css/common.scss";`
      }
    }
  },

  devServer: {
    proxy: {
      '/api': {
        target: 'https://jiedian1.bityuan.com:8801/',
        pathRewrite: {
          '^/api': ''
        }
      },
      '/map': {
        target: 'http://120.79.156.149:8333',
        pathRewrite: {
          '^/map': ''
        }
      },
      '/coin': {
        target: 'https://www.bitfeel.cn/',
        pathRewrite: {
          '^/coin': ''
        }
      },
    }
  },
}