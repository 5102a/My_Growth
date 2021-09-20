module.exports = {
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
  externalLinks: {
    target: '_blank',
    rel: 'https://docs.5102it.cn/CanvasBoard.html',
  },
  // Object，markdown-it-table-of-contents 的选项
  // toc: {
  //   includeLevel: [2, 3]
  // },
  // Object|Array，配置 markdown-it插件
  // plugins:[],
  // Function，一个用于修改当前的 markdown-it 实例的默认配置，或者应用额外的插件的函数
  extendMarkdown: (md) => {
    md.use(require('markdown-it-disable-url-encode'))
  },
  // Array，提取到this.$page.headers中的元素
  // extractHeaders: ['h2', 'h3']
}
