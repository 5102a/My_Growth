const mySecret = require('./my.secret.js')

module.exports = {
  '@vssue/vuepress-plugin-vssue': {
    // 评论
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
  // google网站分析
  '@vuepress/google-analytics': {
    ga: mySecret.ga,
  },
  '@vuepress/nprogress': {}, // 进度条
  '@vuepress/medium-zoom': {}, // 图片放大
  '@vuepress/plugin-back-to-top': {}, // 回到顶部
  '@vuepress/pwa': {
    //pwa
    serviceWorker: true,
    updatePopup: {
      message: '有内容更新！',
      buttonText: '刷新',
    },
  },
  'vuepress-plugin-smooth-scroll': {}, // 顺滑
  // 'vuepress-plugin-baidu-autopush': {},
  'vuepress-plugin-code-copy': {},
  'img-lazy': {},
  // 'reading-progress': {
  //   readingDir: 'top',
  // },
  // 'vuepress-plugin-export': {}, //导出pdf ，指令vuepress export [path/to/your/docs]
  // graysite: {}, // 哀悼日变灰{startDate: '2020-04-03 00:00:00',endDate: '2020-04-04 23:59:59'}
  // seo: {
  //   type: () => 'article',
  // },
}
