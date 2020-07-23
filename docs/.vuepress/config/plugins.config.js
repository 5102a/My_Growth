const mySecret = require('./my.secret.js')

module.exports = {
  'vuepress-plugin-dehydrate': {
    // 禁用 SSR
    noSSR: '404.html',
    noEmptyLine:true
  },
  '@vssue/vuepress-plugin-vssue': {
    // 设置 `platform` 而不是 `api`
    platform: 'github-v4',
    locale: 'zh',
    // 其他的 Vssue 配置
    owner: '1015355299',
    repo: 'My_Growth',
    clientId: mySecret.clientId,
    clientSecret: mySecret.clientSecret,
    autoCreateIssue: true,
  },
  // 网站分析
  '@vuepress/google-analytics': {
    ga: mySecret.ga,
  },
  '@vuepress/nprogress': {}, // 进度条
  '@vuepress/medium-zoom': {}, // 图片放大
  '@vuepress/plugin-back-to-top': {},
  '@vuepress/pwa': {
    serviceWorker: true,
    updatePopup: {
      message: '有内容更新！',
      buttonText: '刷新',
    },
  },
}
