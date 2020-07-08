module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es6.promise',
      ]
    }]
  ],
  plugins: [        // element官方教程
    [
      'component',
        {
          'libraryName': 'element-ui',
          'styleLibraryName': 'theme-chalk'
        },
    ],
    [
      "component", 
      {
        "libraryName": "mint-ui",
        "style": true
      },'mint'
    ]
  ]
}