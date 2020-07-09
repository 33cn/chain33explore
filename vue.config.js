module.exports = {
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        data: `@import "@/assets/css/common.scss";`
      }
    }
  }
}