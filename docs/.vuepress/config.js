const configureWebpackConfig = require('./config/configureWebpack.config.js')
const themeConfig = require('./config/theme.config.js')
const headConfig = require('./config/head.config.js')
const localesConfig = require('./config/locales.config.js')
const pluginsConfig = require('./config/plugins.config.js')
const markdownConfig = require('./config/markdown.config.js')

module.exports = {
  // 主配置文件
  /* ------------- base ------------ */
  // string，网页标题，它将显示在导航栏
  title: '5102的技术文档',
  // string，网站的描述，它将会以 <meta> 标签渲染到当前页面的 HTML 中
  description:
    '5102的技术文档 - 个人技术文档、前端技术文档、自学前端、前端知识体系',
  // string，站点基础路径
  base: '/',
  // Array，额外的需要被注入到当前页面的 HTML <head> 中的标签
  // [tagName, { attrName: attrValue }, innerHTML?]
  head: headConfig,
  // string，指定用于 dev server 的主机名
  host: '0.0.0.0',
  // number，指定 dev server 的端口di
  port: 8081,
  // string，指定客户端文件的临时目录
  // temp: '/path/to/@vuepress/core/.temp'
  // string，输出目录
  dest: '../../dist',
  // { [path: string]: Object }，提供多语言支持的语言配置
  locales: localesConfig,
  // Function，用来控制对于哪些文件，是需要生成 <link rel="prefetch"> 资源提示的
  shouldPrefetch: (file, type) => {
    // 基于文件扩展名的类型推断。
    // https://fetch.spec.whatwg.org/#concept-request-destination
    if (type === 'style' || type === 'html') {
      return true
    }
    if (type === 'image') {
      // 只预加载重要 images
      return (
        file === 'favicon.png' ||
        file === 'knowledge.png' ||
        file === 'logo.jpg'
      )
    }
  },

  // boolean|string，VuePress 默认使用了 cache-loader 来大大地加快 webpack 的编译速度
  // 指定 cache 的路径，设置为 false 来在每次构建之前删除 cache
  // cache: false,
  // Array，指定额外的需要被监听的文件，文件变动将会触发 vuepress 重新构建
  // extraWatchFiles: [],
  // Array，默认解析的文件
  patterns: ['**/*.md', '**/*.vue'],

  /* -------------- theme -----------*/
  // string，当你使用自定义主题的时候，需要指定它
  // theme: undefined,
  // Object，为当前的主题提供一些配置，这些选项依赖于你正在使用的主题
  themeConfig: themeConfig,

  /* -------------- Pluggable -----------*/
  // Object|Array，使用插件
  plugins: pluginsConfig,

  /* -------------- Markdown -----------*/
  markdown: markdownConfig,

  /* -------------- 构建流程 -----------*/
  // Object，配置postcss-loader，指定这个值，将会覆盖内置的 autoprefixer
  // postcss: {
  //   plugins: [require('autoprefixer')]
  // },
  // Object，配置stylus-loader
  // stylus: {
  //   preferPathResolver: 'webpack'
  // },
  // Object，配置scss-loader，加载*.scss文件
  // scss: {},
  // Object，配置sass-loader，加载*.sass文件
  // sass: {
  //   indentedSyntax: true
  // },
  // Object，less-loader配置
  // less: {},
  // Object | Function，用于修改内部的 Webpack 配置，会合并到主配置
  configureWebpack: configureWebpackConfig,
  // Function，通过web-pack-chain，链式配置config
  // chainWebpack: undefined,

  /* -------------- 浏览器兼容性 -----------*/
  // boolean | Function，是否不开启polyfills，即不兼容低版本浏览器
  // evergreen: false,
}
