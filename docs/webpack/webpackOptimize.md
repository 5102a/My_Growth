# Webpack性能优化

- webpack优化主要分开发时优化和生产时优化
- 开发时优化又分为
  - 优化打包构建速度
    - HMR
  - 优化代码调试
    - source-map
- 生产时优化又分为
  - 优化打包构建速度
    - oneOf
    - babel缓存
    - 多线程打包
    - externals忽略打包(CDN引入)
    - dll动态链接库(先打包后直接用)
  - 优化代码运行性能
    - 缓存命名(hash-chunkhash-contenthash)
    - splitChunks代码分块
    - tree shaking树摇
    - 懒加载/预加载
    - PWA渐进式网页应用

## 开发环境优化

### 优化开发打包构建速度

- 由于开发环境下需要实时打包构建，启用devServer时根据修改的文件进行重新打包，而不是所有文件都需要重新打包，这时就需要用到webpack提供的HMR(hot module replacement)热模块替换功能
- 如果loader实现了HMR功能那么就支持处理的文件热模块替换
- 样式文件中style-loader实现了HMR功能，所以我们在开发时需要使用`style-loader`而不使用`MiniCssExtractPlugin.loader`
- js文件默认不支持HMR功能，但是我们可以添加js代码来实现支持HMR功能，当然如果是入口文件也就不支持HMR功能，因为只要非路口文件变动，理所当然的是入口文件也需要变动
- html文件默认也不支持HMR功能，由于html文件一般只有一个，如果将html文件添加为入口文件那么也可以实现HMR功能

```js
// js代码中使用HMR
if (module.hot) { // 判断启动HMR
  // 检测文件变动，触发时执行回调
  module.hot.accept('./log.js', () => {
    log() // log为另一个模块的接口
  })
}

// webpack配置
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 添加html文件为入口文件这样可以启动HMR功能
  entry: ['./src/js/index.js', './src/index.html'],
  output: {
    filename: 'js/index.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', // 使用style-loader(内部实现HMR)可以单独重新打包css文件
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url-loader',
        options: {
          name: '[name]_[hash:10].[ext]',
          limit: 8 * 1024,
          outputPath: 'imgs',
          esModule: false,
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        exclude: /\.(js|css|html|less|jpe?g|png|gif)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  mode: 'development',
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    port: 8888,
    compress: true,
    open: true,
    hot: true, // 开启HMR热模块替换功能
  },
}
```

使用HMR功能可以极快的提高开发时实时重新构建打包的速度

### 优化开发调试

- 使用source-map技术帮助我们在开发时方便调试，即使构建打包后也可以通过source-map技术，把错误映射到源码中的位置
- webpack中的source-map设置，通过设置`devtool:[inline-|hidden-eval-][nosources-][cheap-[module-]]source-map`来开启不同模式的source-map，大概分析如下
  - inline-source-map:内联(归总)，错误代码信息，精确源码位置
  - hidden-source-map:外部，不能追踪源码错误，只能提示到构建后代码的错误位置
  - eval-source-map:内联(每个)，错误代码信息，精确源码位置
  - nosources-source-map:外部，错误代码信息，没有源码信息
  - cheap-source-map:外部，错误代码信息，精确源码位置(只限行)
  - cheap-module-source-map:外部，错误代码信息，精确源码位置(只限行)
  - source-map:外部,错误代码信息，精确源码位置

cheap只精确到行，内联为source-map信息包含在打包后的文件中，外部为单独生产的source-map文件，module为第三方模块中的错误信息

- 总结
  - 开发环境：构建速度/调试友好
    - 速度快(eval>inline>cheap)
      1. eval-cheap-source-map
      2. eval-source-map
    - 调试友好
      1. source-map
      2. cheap-module-source-map
      3. cheap-source-map
    - 推荐使用：eval-source-map/eval-cheap-module-source-map
  - 生产环境：源码隐藏/调试友好/构建速度
    - 内联导致代码提交大，生产环境不适用
    - nosources-source-map全部隐藏源码
    - hidden-source-map只隐藏源码，会提示构建后的错误信息
    - 推荐使用：source-map/cheap-module-source-map
- 在webpack中设置`devtool:'source-map'`即可

[官网详细介绍](https://www.webpackjs.com/configuration/devtool/)

## 生产环境优化

### 优化loader选用

- 有可能一个文件需要经过多个loader匹配，如果只需要一个loader处理那么就可以使用oneOf来提高匹配效率
- 在oneOf中的loader只会被匹配一次，这样就可以提升构建速度

```js
rules: [
  { // 匹配js不受oneOf影响
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
    enforce: 'pre',
    options: {
      fix: true
    }
  },
  { // oneOf中只会被匹配一个
    oneOf:[
      {
        test: /\.css$/,
        use: [...CommonCssLoader]
      },
      {
        test: /\.less$/,
        use: [...CommonCssLoader, 'less-loader']
      },
      {
        // 匹配js
        test: /\.js$/,
        exclude: /node_modules/, // 忽略第三方node模块
        loader: 'babel-loader', // js代码兼容loader
        options: {
          presets: [
            // 预设
            [
              '@babel/preset-env', // babel预设
              {
                useBuiltIns: 'usage', // 按需加载
                corejs: {
                  // core-js配置
                  version: 3 // 版本号
                },
                targets: {
                  // 指定兼容到的浏览器版本
                  chrome: '60',
                  firefox: '60',
                  ie: '9'
                }
              }
            ]
          ]
        }
      }
    ]
  }
]
```

使用oneOf之后，在构建的时候一个文件不会一直匹配，而是只会在oneOf中选择匹配一个

### 打包构建缓存

- babel中开启缓存，这样可以不用每次都重新构建新代码

```js
{
  test: /\.js$/,
  exclude: /node_modules/, 
  loader: 'babel-loader', 
  options: {
    presets: [
      [
        '@babel/preset-env', 
        {
          useBuiltIns: 'usage', 
          corejs: {
            version: 3, 
          },
          targets: {
            chrome: '60',
            firefox: '60',
            ie: '9',
          },
        },
      ],
    ],
    cacheDirectory:true // 开启babel缓存
  },
},
```

- 由于生产环境下打包构建的文件需要在浏览器保存，如果服务器开启了强缓存，那么如果没有过期将不会再去服务器请求资源，如果遇到重大bug时，需要马上更新原来代码，而浏览器中保留的文件还未过期，则不会去请求服务器获取新资源，但是如果文件名改变了，那么浏览器会认为是新文件，重新请求服务器资源，这样就可以即使修复bug
- 这里先介绍几个webapck中的文件占位符
  - hash：每次webpack打包都会生成一个唯一的hash值
  - chunkhash：根据chunk生成hash，由于一个入口文件只会生成一个chunk，所以从入口文件中打包出来的chunkhash都是相同的，都属于一个chunk即代码块
  - contenthash：根据文件内容生成的hash值，只要文件内容不同，则生成的hash值就不同，这样可以很好的区分文件是否有改动
- 把hash值应用到文件名上，这样一来，只要文件没改动生成的文件名就一样，如果改动就不一样，这就可以很好的利用缓存来更新需要更新的文件

```js
output: {
  // 给输出文件名加上contenthash这样就能标识文件是否更新
  filename: 'js/index_[contenthash:10].js',
  path: resolve(__dirname, 'dist')
}
plugins: [
  new MiniCssExtractPlugin({
    // css文件也使用contenthash命名，这样就能根据内容来判断缓存是否生效
    filename: 'css/index_[contenthash:10].css',
  })
]
```

如果需要使用hash来命名文件，只需要在输出文件中使用hash占位符即可

### tree shaking

- tree shaking所谓树摇，可以去除代码中没有用到的无用代码，进而缩小生产环境下打包的代码体积
- webpack自带树摇功能，但前提是使用es6模块化，而且只在生产环境下才会启动
- webpack4.x.x只支持一层嵌套的树摇功能，webpack5支持多层嵌套的树摇功能，这样可以极大的缩小生产打包构建后的代码体积
- 树摇功能默认会去除那些没被使用的文件导入，比如css文件，但是可以通过配置package.json来去除对这些文件的tree shaking

```js
// package.json
// 配置如下设置，则说明所有文件都是没有副作用，那么树摇功能就不会打包那些不用的代码
"sideEffects":false
// 设置有副作用的文件，这样就不会对这些文件进行树摇
"sideEffects":["*.css"] // 不对css文件进行tree shaking
```

**Scope-Hosting作用域提升**

- 把一些由固定值组成的表达式，打包之后会直接用结果记录

```js
// 源码
let a = 1
let b = 2
let c = a + b

// 打包后
let c = 3
```

### splitChunks代码块分片

- 如果没有配置代码分块，那么webpack会把入口文件以及引用的模块都打包在一个文件中
- 设置代码分块之后就会分离自己写的代码和第三方库的代码，打包生成2份独立的文件，一份是打包自己写的代码，一份是引入node_modules中的模块
- webpack中，只要有一个入口文件，那么就会打包成独立的文件，如果一个模块已经打包了那么将不会重复打包

多入口

```js
// 设置多入口，这样就会打包成2个文件
entry: {
  index:'./src/js/index.js', 
  main:'./src/js/main.js'
},
output: {
  // 使用占位符分别命名,name分别指index和main
  filename: 'js/[name]_[contenthash:10].js',
  path: resolve(__dirname, 'dist'),
}
```

第三方模块使用分块

```js
// webpack配置
// 优化配置
optimization:{
  splitChunks:{ // 代码分块
    chunks:'all'  // 所有导入的node_modules模块都打包为一个块
  }
}
```

手动使用分块打包

```js
// 使用import动态导入的文件将会单独打包，/* webpackChunkName: 'main' */ 表示打包后的文件名为main
import(/* webpackChunkName: 'main' */'./main.js')
.then((data)=>{
  // 导入成功
  console.log(data) // 输出导入数据
})
```

1. 使用多入口打包，这种方式适用于多页面应用，会将每个入口文件单独打包
2. 使用optimization配置，分离自己代码和第三方库代码，单独打包
3. 使用import动态导入的文件将会默认使用分块打包，这样可以把各个模块单独生成文件

### 懒加载和预加载

- 懒加载就是所谓的用到时才加载，使用事件来触发动态加载模块
- 预加载，是在所有其他必要的文件加载完成之后，浏览器空闲之后才会加载的模块，而不是触发时才加载

懒加载

```js
const btn = document.getElementByClass('lazy')
btn.onclick = function(e){  // 事件触发加载模块
  import(/* webpackChunkName: 'main' */'./main.js').then((data)=>{
    console.log('加载main模块成功');
  })
}
```

预加载

```js
const btn = document.getElementByClass('lazy')
btn.onclick = function(e){ 
  // webpackPrefetch: true 设置为预加载模块
  import(/* webpackChunkName: 'main', webpackPrefetch: true */'./main.js').then((data)=>{
    console.log('加载main模块成功');
  })
}
```

懒加载用于，用到时加载
预加载用于，大概率会用到的模块，但不是首屏需要用的

### PWA渐进式网络开发应用程序(离线可访问)

- 使用PWA技术就能够使网站离线也能够正常访问，但是会受本地已下载的资源影响
- 需要使用`workbox-webpack-plugin`插件，并且在js代码中注册serviceWorker

```js
// webpack配置
// 配置使用serviceWorker插件
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

plugins: [
  // 打包后将会生成service-worker.js文件
  new WorkboxWebpackPlugin.GenerateSW({
    clientsClaim:true,  // 帮助serviceWorker快速启动
    skipWaiting:true  // 删除旧的serviceWorker
  })
]

// js代码使用serviceWorker
// 兼容性检测
if ('serviceWorker' in navigator) {
  // 页面加载完就注册sw，这样就能离线使用
  window.addEventListener('load',()=>{
    navigator.serviceWorker
    .register('./service-worker.js')  // webpack开启sw之后打包就会生成这个文件
    .then(()=>{
      console.log('sw注册成功');
    })
  })
}

// package.json配置eslint规范环境
"eslintConfig": {
  "extends": "airbnb-base",
  "env":{ // 配置eslint为浏览器环境，那么eslint就不会对浏览器对象(window,document)报错
    "browser":true
  }
}
```

由于在生产环境下，所以不能使用webpack-dev-server,需要安装serve插件，使用`serve -s dist`,dist为服务器打包的文件夹，这样就能在生产环境打开服务器

在离线状态下刷新浏览器，可以看到文件都是来自于`server-worker.js`提供的

### 多线程打包

- 对于需要构建很久的文件可以使用多线程打包，这样可以更加快速的打包，由于创建线程需要开销，所以对于小的文件则不适合使用多线程
- 使用`thread-loader`对上一个loader进行多线程打包

```js
{
  // 匹配js
  test: /\.js$/,
  exclude: /node_modules/,
  use:[
    { // 使用多线程打包
      loader:'thread-loader',
      options:{
        workers:2 // 线程数，根据你的计算机核数来设定最好
      }
    },
    { // 需要使用多线程打包，需要写在'thread-loader'下面，即更早加载
      loader: 'babel-loader', 
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',
              corejs: {
                version: 3, 
              },
              targets: {
                chrome: '60',
                firefox: '60',
                ie: '9',
              },
            },
          ],
        ],
        cacheDirectory:true
      }
    }
  ]
}
```

对于大项目可以尝试使用多线程打包，如果项目很小或者打包的文件不多，那么没必要使用多线程打包，可能还会起反作用

### externals忽略打包

- 如果使用外部的第三方模块，比如使用CDN引入，那么就可以通过配置externals来使webpack忽略打包

```js
// webpack配置
externals:{
  // jquery 库名，Jquery npm 包名
  jquery:'jQuery'
}
```

### DLL动态链接库

- 对代码单独打包生成dll，比如可以对`node_modules`中的某个库单独打包生成dll，到时候可以直接使用
- 单独编写一个webpack配置用于生成单独的库文件，然后在主webpack配置中使用`add-assets-html-webpack-plugin`把打包后的文件引入到html中,其中需要用到manifest.json文件提供库的映射关系

生成单独打包的文件

```js
const {resolve}=require('path')
const webpack=require('webpack')

module.exports={
  entry:{
    jquery:['jquery'] // 多个库打包，数组中可以填写多个模块名
  },
  output:{
    filename:'[name].js', // 输出的文件名
    path:resolve(__dirname,'dist/dll'),   // 输出的目录
    library:'[name]_[hash:10]'  // 生成的库名
  },
  plugins:[
    new webpack.DllPlugin({
      name:'[name]_[hash:10]',  // 此名需要与库名一致
      path:resolve(__dirname,'dist/dll/manifest.json') // 输出的映射文件位置
    })
  ],
  mode:'development'
}
```

这样就单独打包了jquery，以及生成一个manifest.json映射文件，这样就能通过此文件找到打包的库

之后在主配置中使用`webpack.DllReferencePlugin`插件来指明`manifest`文件位置以便webpack能够找到单独打包库的映射关系

```js
plugins:[
  new webpack.DllReferencePlugin({
    // 配置manifest映射关系文件位置
    manifest:resolve(__dirname,'dist/dll/manifest.json')
  })
]
```

这样就可以单独使用打包的模块了，如果此模块需要随项目打包那么建议使用此方式单独打包第三方模块，如果不需要随项目打包，那么可以使用cdn引入，之后再配置externals不打包cdn引入的模块