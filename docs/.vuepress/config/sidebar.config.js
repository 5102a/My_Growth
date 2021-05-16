const guide = require('../../guide/sidebar.js')
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
  '/js/': [
    '',
    'JavaScript',
    'writing',
    'JS-Array',
    'JS-Object',
    'JS-String',
    'JS-Depth',
  ],
  '/algorithm/': [
    '',
    'top10sort',
    'dichotomy',
    'dp',
    'greedy',
    'ba',
    'dac',
    'string',
    'recursion',
    'LeetCode-BO',
    'LeetCode-Sort',
  ],
  '/browser/': ['', 'Browser', 'Process', 'BrowersPlus1', 'BrowersPlus2'],
  '/data-structure/': [
    '',
    'ds',
    'link',
    'tree',
    'graph',
    'hash',
    'skip',
    'LeetCode-Stack',
    'LeetCode-Tree',
  ],
  '/design-pattern/': ['', 'd-p'],
  '/network/': ['', 'net'],
  '/vue/': ['', 'response', 'live', 'VDOM', 'important', 'component','source-live','source-computed','source-watch'],
  '/react/': [''],
  '/gulp/': ['', 'gulp', 'plugins'],
  '/webpack/': ['', 'webpack', 'webpackOptimize'],
  '/jest/': ['', 'jest'],
  '/nodejs/': ['', 'nodejs', 'nodeEventLoop', 'express'],
  '/others/': ['', 'echart', 'mysql', 'PHP', 'git', 'certbot'],
  '/reading/': ['', 'advanced-programming/note'],
  '/security/': ['', 'secure'],
  '/operating-system/': ['', 'OS'],
}
