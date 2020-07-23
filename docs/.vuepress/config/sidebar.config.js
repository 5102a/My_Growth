
const guide=require('../../guide/sidebar.js')
module.exports = {
  // 侧边栏，路由
  '/guide/': guide, // 目录，导航栏
  '/html/': ['', 'HTML', 'HTML5', 'meta', 'special', 'Canvas'], // 具体md文件名
  '/css/': [
    '',
    'CSS',
    'BFC',
    'horizontal-vertical',
    'Layout',
    'Unit',
    'Bootstrap',
    'Sass',
  ],
  '/js/': ['', 'JavaScript', 'JS-Array', 'JS-Object', 'JS-String', 'JS-Depth'],
  '/algorithm/': ['', 'top10sort', 'dichotomy', 'dp', 'greedy'],
  '/browser/': ['', 'Browser', 'Process'],
  '/data-structure/': ['', 'ds', 'link', 'tree'],
  '/design-pattern/': ['', 'd-p'],
  '/network/': ['', 'net'],
  '/vue/': ['', 'response', 'live', 'VDOM', 'important'],
  '/react/': [''],
  '/gulp/': ['', 'gulp', 'plugins'],
  '/webpack/': ['', 'webpack', 'webpackOptimize'],
  '/nodejs/': ['', 'nodejs', 'nodeEventLoop', 'express'],
  '/others/': ['', 'echart', 'mysql', 'PHP', 'git', 'certbot'],
  '/reading/': ['', 'advanced-programming/note'],
  '/security/': ['', 'secure'],
  '/operating-system/': ['', 'OS'],
}