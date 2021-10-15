module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '跑团演出模板'
        return args
      })
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader').loader('worker-loader')
      .options({
        inline: true,
        fallback: false
      }).end()
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#3ba0e9', // 全局主色
            'font-size-base': '14px', // 主字号
            'heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
            'text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
            'text-color-secondary': 'rgba(0, 0, 0, 0.45)' // 次文本色
          },
          javascriptEnabled: true
        }
      }
    }
  }
}
