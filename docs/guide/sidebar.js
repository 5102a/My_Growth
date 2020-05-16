module.exports = [{
    title: '前端三剑客', // 必要的
    path: '/guide/sidebar1/', // 可选的, 标题的跳转链接，应为绝对路径且必须存在
    collapsable: true, // 可选的, 默认值是 true,
    sidebarDepth: 1, // 可选的, 默认值是 1
    children: [
      '/html/',
      '/css/',
      '/js/'
    ]
  },
  {
    title: '算法&数据结构', // 必要的
    path: '/guide/sidebar2/', // 可选的, 标题的跳转链接，应为绝对路径且必须存在
    collapsable: true, // 可选的, 默认值是 true,
    sidebarDepth: 1, // 可选的, 默认值是 1
    children: [
      '/algorithm/',
      '/data-structure/'
    ]
  },
  {
    title: '浏览器&操作系统', // 必要的
    path: '/guide/sidebar3/', // 可选的, 标题的跳转链接，应为绝对路径且必须存在
    collapsable: true, // 可选的, 默认值是 true,
    sidebarDepth: 1, // 可选的, 默认值是 1
    children: [
      '/browser/',
      '/operating-system/'
    ]
  },
  {
    title: '网络&安全', // 必要的
    path: '/guide/sidebar4/', // 可选的, 标题的跳转链接，应为绝对路径且必须存在
    collapsable: true, // 可选的, 默认值是 true,
    sidebarDepth: 1, // 可选的, 默认值是 1
    children: [
      '/network/',
      '/security/'
    ]
  },
  {
    title: '设计模式', // 必要的
    path: '/guide/sidebar5/', // 可选的, 标题的跳转链接，应为绝对路径且必须存在
    collapsable: true, // 可选的, 默认值是 true,
    sidebarDepth: 1, // 可选的, 默认值是 1
    children: [
      '/design-pattern/'
    ]
  },
  {
    title: '其他', // 必要的
    path: '/guide/sidebar6/', // 可选的, 标题的跳转链接，应为绝对路径且必须存在
    collapsable: true, // 可选的, 默认值是 true,
    sidebarDepth: 1, // 可选的, 默认值是 1
    children: [
      '/others/'
    ]
  }
]