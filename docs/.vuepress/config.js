module.exports = { // 主配置文件
  /* ------------- base ------------ */
  // string，网页标题，它将显示在导航栏
  title: '5102的技术文档',
  // string，网站的描述，它将会以 <meta> 标签渲染到当前页面的 HTML 中
  description: '欧里给!!!',
  // string，站点基础路径
  base: '/',
  // Array，额外的需要被注入到当前页面的 HTML <head> 中的标签
  // [tagName, { attrName: attrValue }, innerHTML?]
  head: [],
  // string，指定用于 dev server 的主机名
  host: '0.0.0.0',
  // number，指定 dev server 的端口
  port: 8081,
  // string，指定客户端文件的临时目录
  // temp: '/path/to/@vuepress/core/.temp',
  // string，输出目录
  dest: './docs/.vuepress/dist',
  // { [path: string]: Object }，提供多语言支持的语言配置
  // locales: undefined,
  // Function，用来控制对于哪些文件，是需要生成 <link rel="prefetch"> 资源提示的
  // shouldPrefetch: () => true,
  // boolean|string，VuePress 默认使用了 cache-loader 来大大地加快 webpack 的编译速度
  // 指定 cache 的路径，设置为 false 来在每次构建之前删除 cache
  // cache: true,
  // Array，指定额外的需要被监听的文件，文件变动将会触发 vuepress 重新构建
  // extraWatchFiles: [],
  // Array，默认解析的文件
  patterns: ['**/*.md', '**/*.vue'],

  /* -------------- Styling -----------*/
  // 定义一些变量，外部样式变量
  // palette: {
  //   styl: '/'
  // },
  // 一种添加额外样式的简便方法，外部样式
  // index: {
  //   styl: '/'
  // },

  /* -------------- theme -----------*/
  // string，当你使用自定义主题的时候，需要指定它
  // theme: undefined,
  // Object，为当前的主题提供一些配置，这些选项依赖于你正在使用的主题
  themeConfig: {
    // 导航栏
    nav: require('./nav'),
    // 导航栏logo
    logo: '/logo.png',
    // 侧边栏
    sidebar: require('./sidebar'),
    // 最后更新时间
    lastUpdated: '上次更新',
    // // 多语言模式
    // locales:require('./languages')
    // 深度
    sidebarDepth: 3
  },

  /* -------------- Pluggable -----------*/
  // Object|Array，使用插件
  // plugins: undefined,

  /* -------------- Markdown -----------*/
  markdown: {
    // boolean=undefined是否在每个代码块的左侧显示行号
    lineNumbers: true,
    // Function，一个将标题文本转换为 slug 的函数
    // slugify:source
    // Object，markdown-it-anchor 的选项。
    // anchor: {
    //   permalink: true,
    //   permalinkBefore: true,
    //   permalinkSymbol: '#'
    // },
    // Object，这个键值对将会作为特性被增加到是外部链接的 <a> 标签上，默认的选项将会在新窗口中打开一个该外部链接
    // 打开a外部链接会额外打开的选项
    // externalLinks: {
    //   target: '_blank',
    //   rel: 'noopener noreferrer'
    // },
    // Object，markdown-it-table-of-contents 的选项
    // toc: {
    //   includeLevel: [2, 3]
    // },
    // Object|Array，配置 markdown-it插件
    // plugins:[]or{},
    // Function，一个用于修改当前的 markdown-it 实例的默认配置，或者应用额外的插件的函数
    // extendMarkdown: undefined,
    // Array，提取到this.$page.headers中的元素
    // extractHeaders: ['h2', 'h3']
  },

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
  configureWebpack: {
    resolve: {
      alias: {
        'docs': '../../docs/',
        'vue-press': './',
        'my-press': '../../',
        'my-growth': '../../../'
      }
    }
  },
  // Function，通过web-pack-chain，链式配置config
  // chainWebpack: undefined,

  /* -------------- 浏览器兼容性 -----------*/
  // boolean | Function，是否不开启polyfills，即不兼容低版本浏览器
  // evergreen: false,
}