module.exports = [{ // 目录导航
    title: '前端三剑客', // 必要的
    path: '/guide/sidebar1/', // 可选的, 标题的跳转链接，应为绝对路径且必须存在
    collapsable: true, // 可选的, 默认值是 true,折叠
    sidebarDepth: 3, // 可选的, 默认值是 1 ,显示层级
    children: [
      '/html/', // 文件夹，默认显示readme.md
      '/css/',
      '/js/'
    ]
  },
  {
    title: '算法&数据结构',
    path: '/guide/sidebar2/',
    collapsable: true,
    sidebarDepth: 3,
    children: [
      '/algorithm/',
      '/data-structure/'
    ]
  },
  {
    title: '浏览器&操作系统',
    path: '/guide/sidebar3/',
    collapsable: true,
    sidebarDepth: 3,
    children: [
      '/browser/',
      '/operating-system/'
    ]
  },
  {
    title: '网络&安全',
    path: '/guide/sidebar4/',
    collapsable: true,
    sidebarDepth: 3,
    children: [
      '/network/',
      '/security/'
    ]
  },
  {
    title: 'Vue&React',
    path: '/guide/sidebar7/',
    collapsable: true,
    sidebarDepth: 3,
    children: [
      '/vue/',
      '/react/'
    ]
  },
  {
    title: '设计模式&代码优化',
    path: '/guide/sidebar5/',
    collapsable: true,
    sidebarDepth: 3,
    children: [
      '/design-pattern/'
    ]
  },
  {
    title: '其他',
    path: '/guide/sidebar6/',
    collapsable: true,
    sidebarDepth: 3,
    children: [
      '/others/'
    ]
  }
]