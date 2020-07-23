const navConfig = require('./nav.config.js')
const sidebarConfig = require('./sidebar.config.js')

module.exports = {
  // 导航栏
  nav: navConfig,
  // 导航栏logo
  logo: '/images/logo.jpg',
  // 侧边栏
  sidebar: sidebarConfig,
  // 最后更新时间
  lastUpdated: '上次更新',
  // // 多语言模式
  // locales: {
  //   '/': {
  //     lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
  //     title: '5102的技术文档',
  //     description: '5102构建前端知识体系',
  //   },
  // },
  // 深度
  sidebarDepth: 3,
}
