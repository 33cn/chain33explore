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
  }
}