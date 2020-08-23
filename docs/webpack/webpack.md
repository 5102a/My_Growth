# Webpack配置

- 本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle
- webpack也是一个前端构建工具，把前端所有的资源文件作为模块处理，经过今天分析，打包生成静态资源bundle
- webpack配置文件webpack.config.js使用commonjs模块导出一个配置对象
- webpack基于node环境运行，node使用commonjs模块化

[webpack官网配置](https://www.webpackjs.com/configuration/)

[深入浅出webpack](https://webpack.wuhaolin.cn/)

## Entry入口

- entry设置webpack打包入口文件，根据入口文件分析依赖关系图，从entry设置的文件开始打包
- entry配置

```js
// string 单入口，一个chunk一个bundle文件，chunk名称main
entry: './index.js',
// array  多入口，引入所有文件最终只会生成1个chunk，一个bundle，名称main，用于HMR功能生效
entry: ['./index.js','./main.js'],
//object 指定多入口，输出多个chunk，多个bundle，chunk的名称为属性名
entry: { index:'./index.js',main:'./main.js'},
// 使用对象类型可以用数组值，把多个库打包在一个chunk中
entry: { react:['react','react-dom'] },
```

## Output出口

- output设置webpack打包出口文件，指定bundle的输出位置，以及打包后的文件名
- output配置(对象)

```js
output: {
  // 输出文件名称(可以指定名称和目录)
  filename: 'js/index.js',
  // 输出文件目录，作为之后所有输出资源的公共目录
  path: resolve(__dirname, 'dist'),
  // 作为所有引入资源的前缀路径拼接
  publicPath: '/',
  // 非入口文件打包生成chunk的名称(动态引入)
  chunkFilename: '[name]_chunk.js',
  // 暴露给外部的变量名(一般用于dll)
  library: [name],
  // 把暴露的变量名添加到window(browser)、global(node)、commonjs(模块对象)对象中
  libraryTarget: 'window'
  // 引入时使用 import $ from 'expose-loader?$!jquery' 这样可以注册$为全局变量window.$
}
```

## module配置、Loader转换器

- loader让webpack可以处理一些非js的文件，由于webpack只能处理js(json)文件，loader能够使非js文件转变为webpack可以处理的内容，loader功能单一
- module配置

```js
module: {
  noParse:/jquery/, // 不需要解析模块中的依赖关系
  // loader配置
  rules: [
    // loader规则配置
    {
      // 使用正则方式匹配css的文件
      test:/\.css$/,
      // 用于多个loader时的配置每个loader又可以使用对象形式配置
      use: [
        'style-loader',
        'css-loader',
      ],
      // 只使用一个loader时可以通过直接使用loader属性来指明
      loader:'style-loader',
      // 排除正则匹配的文件/目录
      exclude:/node_modules/,
      // 只匹配的目录
      include:resolve(__dirname,'src'),
      // enforce配置匹配优先级，'pre'为优先执行，'post'为延后执行，不配置默认为'normal'
      enforce:'pre',
      // loader的单独配置项，由loader决定
      options:{}
    }
  ]
}
```

## resolve配置

- resolve用于配置webpack模块的解析规则
- resolve配置

```js
resolve:{
  alias:{  // 路径别名(对象),`$css`键为路径的别名，`resolve(__dirname,'src/css')`值为实际的路径，这样可以在其他文件中直接使用路径别名
    $css:resolve(__dirname,'src/css')
  },
  // 配置可省略的文件后缀名，优先级为从左到右，即先匹配是否有js对应的文件名，再匹配json对应的文件名
  extensions:['.js','.json'],
  // 配置webpack解析模块的路径，配置之后可以快速定位node_modules位置，而不需要寻找，可配置多个路径，从左到右优先查找
  modules:[resolve(__dirname,'../node_modules'),'node_modules']
}
```

## devServer开发服务器

- devServer只能用于开发时启动的服务器配置
- devServer对象配置

```js
devServer: {
  // 服务器的文件目录
  contentBase: resolve(__dirname, 'dist'),
  // 监视contentBase下的所有文件，一旦变化将会重载
  watchContentBase: true,
  // 监视更新配置，ignored忽略目录
  watchOptions: { ignored: /node_modules/ },
  // 服务器域名
  host: 'localhost',
  // 开启HMR功能
  hot: true,
  // 不在浏览器中显示启动服务器的日志信息
  clientLogLevel: 'none',
  // 除了一些基本信息以外，其他内容都不要显示在log中
  quiet: true,
  // 关闭错误时的全屏显示提示
  overlay: false,
  progress:true, // 显示进度条
  port: 8888, //服务器端口
  compress: true, // 使用gzip压缩
  open: true, // 自动打开浏览器
  // 服务器代理，解决开发环境跨域问题,'/api'为拦截的请求，target为代理到的服务器以及端口，pathRewrite为重写请求路径
  proxy: {  // 默认发送到8080，进行代理
    '/api': {
      target: 'http://loaclhost:3000',
      pathRewrite: {
        '^/api': '' // 路径重写
      }
    }
  },
  // 用于开发时模拟后端返回的数据，express
  setup(app){
    // 中间键
    app.get('/some/path', function(req, res) {
      res.json({ custom: 'response' })
    })
  },
  before(app){ } // 钩子
}
```

服务端启动webpack

```js
const app = require('express')()
const webpack = require('webpack')
// 中间件插件
const middle = require('webpack-dev-middleware')
// 配置对象
const config = require('./webpack.config.js')
// 解析
const compiler = webpack(config)

app.use(middle(compiler)) // 使用中间键处理
app.get('/api',(req,res)=>{
  res.json({info:'ok'})
})
app.listen(3000)
```

启动服务器代码之后，顺带启动了webpack，这样就能直接前后端结合起来了

## optimization优化配置

- 只在生产环境下有效的配置
- optimization对象配置

```js
// 优化配置
optimization: {
  splitChunks: {
    chunks: 'all', //默认写法
    /* 以下配置为默认值 */
    // minSize: 30 * 1024, //最小分割大小
    // maxSize: 0, //,不限制最大分割大小
    // minChunks: 1, //要提取的chunk最少被引用的次数
    // maxAsyncRequests: 5, //按需加载时并行加载的最大数目
    // maxInitialRequests: 3, //入口文件最大并行请求数目
    // automaticNameDelimiter: '~', //分块名称连接符
    // name: true, //使用命名规则
    // cacheGroups: {
    //   // 分割chunk缓存组配置
    //   vendors: { // 抽离第三方模块组
    //     // node_modules的文件会被打包到vendors组的chunk中
    //     test: /[\\/]node_modules[\\/]/,
    //     priority: -10, // 优先级
    //   },
    //   default: {
    //     minChunks: 2, // 要提取的chunk最少被引用2次
    //     priority: -20, // 优先级
    //     reuseExistingChunk: true, // 如果当前打包的和之前已经打包的是同一个模块则不打包，直接复用
    //   },
    // },
  },
  // 将当前模块记录的其他模块hash单独打包生成一个文件，这样当被包含的文件改动时，此文件不需要重新打包，缓存依旧有效
  // 否则，当前模块记录的其他模块hash值改变，此模块也需要重新打包，则缓存失效
  runtimeChunk: {
    name: (entrypoint) => `runtime-${entrypoint.name}`,
  },
  // 生产环境压缩配置
  minimizer: [
    // 针对webpack 4.2.6以上版本默认使用terser压缩js和css
    // 更改terser默认配置，需先安装 terser-webpack-plugin 插件
    new TerserWebpackPlugin({
      cache: true, // 开启缓存
      parallel: true, // 开启多线程打包
      sourceMap: true, // 开启source-map
    }),
  ],
}
```

## Plugins插件

- plugins插件，可以执行更广范围的任务，比loader的功能更加强大，使webpack更加可扩展，插件可以处理更加复杂的任务，比如压缩、处理环境变量、优化打包等

## Mode模式

- mode设置webpack打包构建的模式，有开发模式development主要是在开发时使用，更适合开发调试以及快速构建。生产模式production，主要是在上线发布时打包构建，更加注重代码的优化，执行稳定性
- 开发环境：`webpack 入口目录 -o 出口目录 --mode=development`
- 生产环境：`webpack 入口目录 -o 出口目录 --mode=production`
  - 生产环境压缩js代码

## 样式资源处理

- 由于webpack是从入口文件开始打包，所以需要在入口文件中导入样式资源
- webpack扩展了import，使其可以导入样式文件

入口文件

```js
// index.js入口文件
// 引入样式文件
import '../css/index.css'

function add(a, b) {
  return a + b
}
console.log(add(1, 3))

```

webpack配置文件

```js
// webpack配置文件 webpack.config.js
// 使用node路径处理模块
const { resolve } = require('path')
// 导出配置
module.exports = {
  // 入口配置
  entry: './src/js/index.js',
  // 打包后bundle出口配置
  output: {
    // 打包出口文件名
    filename: 'js/index.js',
    // 输出目录，使用node的path模块中的resolve方法拼接绝对路径
    // __dirname是node变量，表示当前文件的绝对路径，参数二表示额外目录
    path: resolve(__dirname, 'dist'),
  },
  // 配置loader
  module:{
    // loader规则
    rules:[
      // 详细loader配置
      { // test 使用正则匹配此loader处理的文件，此处匹配的是以.css结尾的文件
        test:/\.css$/,
        // use 使用多个loader处理，loader处理顺序是从右到左，从下到上，适用use与rules数组中
        // 使用css-loader与style-loader处理css文件
        use:[
          // style-loader作用：创建style标签，把js中的样式字符串作为内容，插入到html的head中
          {
            loader:'style-loader',
            options:{
              insertAt:'top' // 插入到head中的顶部
            }
          },
          // css-loader作用：把导入的css文件转换成webpack可处理的js代码(样式字符串)
          'css-loader'
        ]
      }
    ]
  },
  // 配置插件
  plugins:[],
  // 开发模式
  mode:'development'
}
```

1. webpack不能识别css文件，只能通过css-loader把css文件处理成commonjs模块，其内容为样式字符串即css文件内容
2. 经过css-loader处理成js代码之后，使用style-loader通过DOM创建style标签，把css-loader处理后的样式字符串作为其html内容，最后插入到index.html的head中
3. 通过在index.html中引入打包后的index.js即可看到样式效果和js执行结果
4. 这里注意，由于css样式是通过js代码生成style标签插入到head中，所以css样式字符串在打包之后会在index.js中，而不会分离成index.css文件
5. 需要手动引入index.js到index.html中(可以通过插件完成)

**处理less、sass文件**

- less、sass也需要使用loader处理成css，再经过之前的转换过程
- 只比css文件多了一步编译解析过程，注意也要导入相应的文件

```js
// index.js入口文件
// 引入样式文件
// import '../css/index.sass'
import '../css/index.less'

function add(a, b) {
  return a + b
}
console.log(add(1, 3))

// webpack配置,省略其他相同配置
module:{
  rules:[
    { // 匹配less文件
      // test:/\.s[ac]ss$/, // 匹配sass
      test:/\.less$/,
      use:[
        // 最后通过style-loader创建style标签，设置内容为样式字符串，插入到html的head中
        'style-loader',
        // 再使用css-loader处理成js样式字符串模块
        'css-loader',
        // 先使用less-loader处理成css文件
        'less-loader'
        // 'sass-loader'
      ]
    }
  ]
}
```

## html资源处理

- html文件的处理，包括自动导入script、style、img资源替换等
- 一般情况webpack入口文件为js文件，而且不会导入html文件，那么就要使用插件来完成引入到html中
- 安装`html-webpack-plugin`,在webpack配置中使用即可

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/index.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [],
  },
  plugins: [
    // 使用插件,导入的插件都是构造函数，使用new来创建实例
    new HtmlWebpackPlugin({
      // template 复制指定html文件，并引入所有打包的js、css文件
      template: './src/index.html',
      filename:'index.html',  // 输出文件命名
      chunks:['main'] // 指定引入的入口文件，如果不写默认全部导入，用于多入口多页面时按需引入到不同的html中，从右到左引入
    }),
  ],
  mode: 'development'
}
```

- `html-webpack-plugin`插件可以指定html引入webpack打包后的文件，也可以自动生成新的html文件再引入，这样我们就可以不需要手动引入到html中

## 图片资源处理

- 图片资源存在于html中、css中，webpack也不能直接识别图片资源，只能通过loader处理之后才会被webpack处理

**处理图片资源**

- 需安装`url-loader file-loader`，url-loader是基于file-loader扩展的

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/index.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test:/\.css$/,
        use:[
          'style-loader',
          'css-loader'
        ]
      },
      { // 匹配图片格式
        test:/\.(jpe?g|png|gif)$/,
        // 只使用一个loader时，可以直接使用loader属性设置loader名
        loader:'url-loader',
        // loader 的配置项
        options:{
          // 设置处理图片的大小，当图片小于等于8kb时使用base64编码形式，大于时直接输出
          // base64图片优势：减少请求次数，劣势：图片略大1/3
          limit:8 * 1024,
          outputPath:'/img/', // 给输出的图片增加额外目录
          publicPath:'http://localhost:8888' // 给所有图片资源增加公共目录前缀，用于形参绝对路径
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
  ],
  mode: 'development'
}
```

1. 当处理到图片资源时，url-loader会根据图片大小处理，如果处理成base64格式，那么将会以base64字符串形式保留在js文件中，反之将会单独生成一个以hash值命名的图片资源(默认方式)
2. 如果引用相同图片多次也只会被处理一次
3. url-loader无法处理html中img的图片资源，所以需要其他loader处理

**处理html中的图片资源**

- 由于`url-loader`只能处理css中的图片资源，那么如果直接嵌入到html中的图片将不会被处理，而且当使用相对路径时也不能被正确导入这时就需要对html中的图片资源单独处理成require模块的形式导入

```js
// html 中使用图片资源
<img src="./imgs/2.jpg"></img>

// webpack配置
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/index.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test:/\.css$/,
        use:[
          'style-loader',
          'css-loader'
        ]
      },
      { // 匹配图片格式
        test:/\.(jpe?g|png|gif)$/,
        // 只使用一个loader时，可以直接使用loader属性设置loader名
        loader:'url-loader',
        // loader 的配置项
        options:{
          // 设置处理图片的大小，当图片小于等于8kb时使用base64编码形式，大于时直接输出
          // base64图片优势：减少请求次数，劣势：图片略大1/3
          limit:8 * 1024,
          // 禁用es6模块化，使用commonjs，需与html使用相同的模块化方式
          esModule:false,
          name:'[name]_[hash:8].[ext]',
          outputPath:'imgs'
        }
      },
      { // 匹配html文件
        test:/\.html$/,
        // 使用html-loader处理图片引入，使其能够被url-loader处理
        // 此loader默认使用commonjs模块化导入图片
        loader:'html-loader'
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  mode: 'development'
}
```

1. html-loader可以把html文件中img标签导入的图片，转换成commonjs模块化使用url导入的方式，使得url-loader可以处理html中得图片资源
2. 其中url-loader默认使用es6模块化方式导入图片资源，而html使用的是commonjs模块化方式导入图片，所以需要把url-loader配置为commonjs模块化方式才能匹配使用

## 其他资源处理

- 其他资源指的是一些不需要进一步处理的资源，直接原封输出即可，那么就需要用到`file-loader`对这些文件处理

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/index.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {  // exclude需要排除的文件，即不被此loader处理的文件
        exclude:/\.[js|css|html|less]$/,
        loader:'file-loader',
        options:{
          // 重命名
          name:'./assets/[name]_[hash:10].[ext]'
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  mode: 'development'
}
```

```js
// js 中引入资源
import logo from './images/logo.jpg'
const img = new Image()
img.src = logo  // logo为创建后引入的新路径，不能直接设置字符串路径，需要使用模块引入才能被webpack处理
```

当匹配到不被特定loader处理的资源时，file-loader将会处理这些资源，并原封不动的输出到指定位置下，比如打包字体文件

## 模块注入

- 在每个模块中都注入一个对象，比如在每个模块中可以直接使用$对象来表示使用jquery
- 使用`webpack.ProvidePlugin`插件来实现

```js
plugins:[
  new webpack.ProvidePlugin({
    $:'jquery' // 在每个模块中注入$
  })
]
```

## devServer自动化

- 当我们每次修改完代码时，都需要经过打包之后再进行测试，每次都要手动输入打包指令对于开发来说是低效率的，webpack中提供了devServer服务器，使我们可以在开发时，自动编译，自动打开浏览器，实时打包刷新，提高生产力
- devServer就像一个自动化的微服务，自动运行和更新构建后的代码，方便我们开发
- 使用前需要先安装`webpack-dev-server`插件，并且使用`npx webpack-dev-server`启动服务器

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/index.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  // 只会在内存中编译打包，不会有任何额外输出
  devServer: {
    // 服务器目录，打包后的目录
    contentBase: resolve(__dirname, 'dist'),
    // 服务器端口
    port: 8888,
    // 开启gzip压缩
    compress: true,
    // 自动打开浏览器
    open: true,
  },
  mode: 'development',
}
```

也可使用watch模式监听文件变动，修改后会重新编译

```js
// webpack配置
watch:true,
watchOptions:{
  poll:1000,  // 每次轮询间隔1000ms
  aggregateTimeout:500, // 防抖，500ms内还有变动则重置时间
  ignored:/node_modules/ // 忽略检测目录
}
```

当启动服务之后，改动源文件时，将会自动打包构建新的文件，并且实时展示，这样可以提高我们的开发效率，而且只会在内存中编译打包，没有其他输出

## 开发环境配置

- 这里列出webpack开发环境下的基本配置，总结前面的内容

```js
// 导入node的path模块，resolve用于兼容不同系统 拼接绝对路径
const { resolve } = require('path')
// 导入html插件
const HtmlWebpackPlugin = require('html-webpack-plugin')

// webpack配置对象
module.exports = {
  entry: './src/js/index.js', // 打包入口文件配置
  output: {
    // 输出文件配置
    filename: 'js/index.js', // 输出文件名(可增加目录)
    path: resolve(__dirname, 'dist'), // 输出文件放置的绝对目录
  },
  module: {
    // loader配置
    rules: [
      // loader规则配置
      {
        // 匹配css样式文件
        test: /\.css$/,
        use: [
          // 多loader处理使用use数组，loader处理顺序从右到左，从上到下
          'style-loader', // 创建style标签，把样式字符串作为内容，插入到head中
          'css-loader', // 转换css文件内容为js的样式字符串，以便webpack可以处理
        ],
      },
      {
        // 匹配less样式文件
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'], // 比css文件多使用less编译器处理转换less为css文件
      },
      {
        // 匹配图片资源(无法转换html中的图片)
        test: /\.(jpe?g|png|gif)$/,
        // 基于file-loader扩展的
        loader: 'url-loader', // 根据图片资源转为base64，或把url导入改为js模块化方式导入
        options: {
          // loader额外配置选项
          name: '[name]_[hash:10].[ext]', // 处理后的图片名，[name]为应用原文件名，[hash:10]为保留文件hash值的前10位，[ext]为原后缀名
          limit: 8 * 1024, // 限制大小，当图片大小大于8kb时，不做base64编码转换，反之转换成base64格式字符串
          outputPath: 'imgs', // 图片处理后的输出目录
          esModule: false, // 关闭es6模块化处理（默认使用es6模块化）,使用commonjs模块化处理，为了与html-loader兼容处理
        },
      },
      {
        // 匹配html文件
        test: /\.html$/,
        loader: 'html-loader', // 使用html-loader，把html中img标签导入的图片处理成commonjs模块化导入，以便webpack处理
      },
      {
        // 匹配其他文件
        exclude: /\.(js|css|html|less|jpe?g|png|gif)$/,
        loader: 'file-loader', // 专门处理文件的loader
        options: {
          outputPath: 'assets', // 文件输出目录
        },
      },
    ],
  },
  plugins: [
    // 插件设置，无顺序影响
    new HtmlWebpackPlugin({
      // 把webpack打包出来的文件导入到html中
      template: './src/index.html', // 应用的html文件(未导入其他文件)
    }),
  ],
  mode: 'development', // 开发环境模式
  devServer: {
    // 自动化开发服务器，在内存中自动编译，自动打开浏览器，自动实时刷新代码
    contentBase: resolve(__dirname, 'dist'), // 服务器运行根目录，设置为打包后的根目录
    port: 8888, //服务器端口
    compress: true, // 使用gzip压缩
    open: true, // 自动打开浏览器
  },
}
```

1. 打包构建指令`webpack`
2. 启动自动化指令`npx webpack-dev-server`(需先安装插件)

## css样式独立打包

- 之前所讲的css样式只能通过js插入到html中，这就使得js中包含css样式内容，导致js文件过大，页面样式渲染缓慢
- 这里使用另一个插件把css文件独立打包成css文件出来
- 使用`mini-css-extract-plugin`插件，使用前需要安装，而且此插件还自带loader用于替换之前js方式插入的style-loader

```js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 导入插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/index.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 使用插件自带的loader，输出为独立的css文件，并且在head中使用link标签引入
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    // 使用插件
    new MiniCssExtractPlugin({
      // 将css文件输出为独立的css文件
      // 重命名输出文件目录
      filename: 'css/index.css',
    }),
  ],
  mode: 'development',
}
```

这样的好处就是，css独立成一个文件，不会因为加载js而不能及时渲染样式，通过link标签引入，而不是内联式，不会出现短暂的白屏现象

## css兼容性处理

- 在开发环境下我们也许不会特定的去兼容浏览器的css写法，因为那样效率太低了，如今已经有loader实现css的兼容性补充，可以帮助我们快速的补充所配置的浏览器兼容写法
- `postcss-loader`能够帮助我们补充样式中存在兼容性问题的样式，通过配置兼容的浏览器范围，可以智能的补充兼容写法，非常方便了我们的开发

```js
// package.json配置
  // 需要增加浏览器兼容配置选项
  "browserslist": {
    "development": [  // 开发时的浏览器兼容设置
      // 只兼容chrome最近一个版本
      "last 1 chrome version",  
      "last 1 firebox version",
      "last 1 safari version"
    ],
    "production": [ // 生产环境浏览器兼容
      // 市场份额大于0.2%的浏览器厂家
      ">0.2%",
      // 非弃用的浏览器
      "not dead",
      // 非欧鹏mini浏览器
      "not op_mini all"
    ]
  }



// webpack配置
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 强制设置当前运行环境
process.env.NODE_ENV = 'production'
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/index.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            // 使用此loader处理css兼容性问题
            loader: 'postcss-loader',
            options: {
              ident: 'postcss', // webpack中的标识符
              plugins: () => [require('postcss-preset-env')()], // 预设插件，处理兼容性需要用到
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/index.css',
    }),
  ],
  mode: 'development',
}
```

1. 使用`postcss-loader`来完成css兼容性处理，此外，此loader还需借助`postcss-preset-env`插件来完成兼容
2. 在`package.json`中配置此项目在开发和生产环境下需要兼容到的浏览器，以便loader可以根据此配置来补充兼容样式
3. `postcss-loader`默认使用生产环境兼容处理，使用`process.env.NODE_ENV='development'`可强制设置webpack打包时的node环境

## 压缩css样式

- js代码在生产环境下webpack会自动压缩，而css文件则需要我们手动使用插件来进行压缩
- 使用`optimize-css-assets-webpack-plugin`插件来实现css样式文件的压缩(导出的是css文件)

```js
// 压缩css插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 省略其他
plugins: [
  // 使用插件
  new OptimizeCssAssetsWebpackPlugin(),
]
```

压缩之后明显减少体积，这是生产环境必须要走的流程

## eslint代码规范检测

- eslint可以帮助我们检查编写代码时的规范问题，以便于在团队开发中，能够统一代码编写规范，避免个体差异性
- eslint可以基于一种规范来检查代码，这里推荐认同度高的airbnb代码规范，作为eslint检查的规则
- 在webpack只需要检查自己编写的js文件规范，而不需要检查node_modules中的规范，因为那些库早已检查过了，也许他们和你设置的规范不同，导致eslint不可通过
- 下载`npm i eslint eslint-loader eslint-plugin-import eslint-config-airbnb-base -D`

```js
// package.json配置
"eslintConfig": {
  "extends": "airbnb-base"  // 继承airbnb-base规范
}

// loader配置
{
  test: /\.js$/,
  exclude: /node_modules/, // 检查 排除第三方库
  loader: 'eslint-loader',  
  options: {
    fix: true,  // 自动修复代码规范问题
  }
}

// 如果要让eslint不对console.log报警告，请写以下注释，让eslint忽略对下一行的代码规范检查

// eslint-disable-next-line
console.log(add(1, 3));
```

eslint可以规范编写代码的规范，以及自定义代码检查和修复配置，可以让我们在团队开发中更加统一，当然前提是你懂得配置，否则可能摸不着头脑

## js兼容性处理

- js也需要做低版本浏览器的兼容性处理,使用babel插件把es6的代码转换为es5兼容代码,这样可以让我们的js代码运行在更低版本的浏览器中
- 这里使用babel来转换,所以需要下载`@babel/core`和`@babel/preset-env`以及`babel-loader`

```js
// 省略其他
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/, // 检查 排除第三方库
      loader: 'babel-loader',
      options: {
        presets:['@babel/preset-env'] // 预设,指babel如何做兼容性处理
      }
    }
  ]
}
```

- `@babel/preset-env`只能转换一些基础的语法,对于高级语法则不支持,比如promise,此时我们就需要使用更强大更完善的`@babel/polyfill`来兼容所有语法,当然这也意味着构建之后的代码也更大

```js
// index.js入口文件
// 直接引入即可
import '@babel/polyfill'
const res = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(5)
  }, 1000)
})
res.then((data) => {
  console.log(data)
})
```

这里直接引入`@babel/polyfill`即可使用

由于`@babel/polyfill`构造之后的体积过大不适应,这使用core-js来按需加载用到的兼容语法,下载`core-js`

```js
// 忽略其他配置
{
  test: /\.js$/,
  exclude: /node_modules/, // 检查 排除第三方库
  loader: 'babel-loader',
  options: {
    // 预设,指babel如何做兼容性处理
    presets: [
      [
        '@babel/preset-env',
        {
          // 按需加载
          useBuiltIns: 'usage',
          // 指定core-js版本
          corejs: {
            version: 3,
          },
          targets: {
            // 指定浏览器要兼容到的版本
            chrome: '60',
            firefox: '60',
            ie: '9',
            safari: '10',
            edge: '17',
          }
        }
      ]
    ]
  }
}
```

corejs是一种较好的js兼容性处理方案

## html压缩

- js在生产模式下webpack自动压缩，css可以使用`optimize-css-assets-webpack-plugin`压缩，而html可以使用`html-webpack-plugin`配置压缩项

```js
// html压缩配置，省略其他配置
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    minify:{  // 压缩
      // 移除空格
      collapseWhitespace:true,
      // 移除注释
      removeComments:true
    }
  })
]
```

html只能去除一些没用的字符，而不能进一步压缩,生产环境下默认启用压缩

## 生产环境配置

- 生产环境相对于开发环境而已，需要更高的要去，比如压缩代码，性能更好，源码安全，稳定性等问题
- 整合以上配置，生产环境基本配置如下

package.json生产环境配置

```js
// package.json配置
{
  "name": "webpack",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "keywords": [],
  "description": "",
  "devDependencies": {
    "@babel/core": "^7.10.4",
    "@babel/polyfill": "^7.10.4",
    "@babel/preset-env": "^7.10.4",
    "babel-loader": "^8.1.0",
    "core-js": "^3.6.5",
    "css-loader": "^3.6.0",
    "eslint": "^7.4.0",
    "eslint-config-airbnb-base": "^14.2.0",
    "eslint-loader": "^4.0.2",
    "eslint-plugin-import": "^2.22.0",
    "file-loader": "^6.0.0",
    "html-loader": "^1.1.0",
    "html-webpack-plugin": "^4.3.0",
    "less": "^3.11.3",
    "less-loader": "^6.2.0",
    "mini-css-extract-plugin": "^0.9.0",
    "optimize-css-assets-webpack-plugin": "^5.0.3",
    "postcss-loader": "^3.0.0",
    "postcss-preset-env": "^6.7.0",
    "sass": "^1.26.10",
    "sass-loader": "^9.0.2",
    "style-loader": "^1.2.1",
    "url-loader": "^4.1.0",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.12",
    "webpack-dev-server": "^3.11.0"
  },
  "browserslist": {
    "development": [
      "last 1 chrome version",
      "last 1 firebox version",
      "last 1 safari version"
    ],
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ]
  },
  "eslintConfig": {
    "extends": "airbnb-base"
  },
  "dependencies": {}
}
```

webpack生产环境配置

```js
// node模块
const { resolve } = require('path')
// 把webpack打包后的文件引入到html中
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 独立生成css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩css文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

// 公共cssLoader代码块
const CommonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [require('postcss-preset-env')()],
    },
  },
]

// webpack配置
module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/index.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        // 匹配css
        test: /\.css$/,
        use: [...CommonCssLoader],
      },
      {
        // 匹配less
        test: /\.less$/,
        use: [...CommonCssLoader, 'less-loader'],
      },
      {
        // 匹配js做代码规范检查
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        // enforce: 'post'  // 滞后执行
        enforce: 'pre', // 提前执行
        options: {
          fix: true, // 自动修复规范问题
        },
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
                  version: 3, // 版本号
                },
                targets: {
                  // 指定兼容到的浏览器版本
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                },
              },
            ],
          ],
        },
      },
      {
        // 匹配图片
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024, // 大于8kb不转base64，反之转base64
          esModule: false, // 不使用es6模块化
          name: '[name]_[hash:10].[ext]', // 输出文件命名
          outputPath: 'imgs', // 输出文件目录
        },
      },
      {
        // 匹配html
        test: /\.html$/,
        loader: 'html-loader', // 转换html中img标签引入的图片
      },
      {
        // 匹配其他文件
        exclude: /\.(js|css|html|less|jpe?g|png|gif)/,
        loader: 'file-loader', // 原样输出文件
        options: {
          outputPath: 'assets', // 输出目录
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 使用css单独打包成css的插件
      filename: 'css/index.css', // 独立css文件输出路径
    }),
    new OptimizeCssAssetsPlugin(), // 压缩css
    new HtmlWebpackPlugin({
      // 打包文件导入到html中，并且压缩html
      template: './src/index.html', // 对照的html文件
      minify:{  // 压缩
        // 移除空格
        collapseWhitespace:true,
        // 移除注释
        removeComments:true
      },
      hash:true // 使用哈希命名
    }),
  ],
  mode: 'production', // 生产环境
}
```

## webpack其他插件

### CleanWebpackPlugin

- `npm i clean-webpack-plugin -D`使用此插件，可以在每次打包时自动清除指定文件/目录

```js
const CleanWebpackPlugin = require('clean-webpack-plugin')
/* 省略 */
plugins:[
  new CleanWebpackPlugin(['./dist'])  // 参数可以是数组、字符串，内容为需要清除的文件/目录
]
```

### CopyWebpackPlugin

- `npm i copy-webpack-plugin -D`使用此插件，可以在每次打包时拷贝指定文件到指定位置

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')
/* 省略 */
plugins:[
  // 参数为数组，每拷贝一个，使用对象来表示，from相对于当前文件目录，to相对于打包后的目录
  new CopyWebpackPlugin([
    {from:'img',to:'./'}
  ])
]
```

### webpack.BannerPlugin

- webpack内置插件，打包时可以在每个js文件头部插入版权声明注释

```js
const webpack = require('webpack')
/* 省略 */
plugins:[
  // 参数为数组，每拷贝一个，使用对象来表示，from相对于当前文件目录，to相对于打包后的目录
  new webpack.BannerPlugin('make 2020 by 5102')
]
```

### webpack.DefinePlugin

- webpack内置插件，可以设置全局环境变量

```js
const webpack = require('webpack')
/* 省略 */
plugins:[
  // 参数为数组，每拷贝一个，使用对象来表示，from相对于当前文件目录，to相对于打包后的目录
  new webpack.DefinePlugin({
    DEV:"'dev'", // 定义环境变量DEV的值为 'dev'
    FLAG:JSON.stringify('dev') // 值也为 'dev'
  })
]
// index.js中使用
if(DEV=='dev'){...}
```

### WebpackMerge

- `webpack-merge`插件，可以合并多个配置文件，用于分别配置开发和生产环境下的配置文件

```js
const { smart } = require('webpack-merge')
const base = require('./webpack.base.js') //导入公共配置文件

// 合并配置文件
module.exports = smart(base, {
  mode:'development',
  ...
})
```

这样就能分3个文件(webpack.base.js、webpack.dev.js、webpack.prod.js)进行分别配置

### Happypack

- `happy-pack`插件，可以实现多线程打包，根据不同的文件分别配置

```js
const Happypack = require('happypack')

module.exports = {
  entry: './src/js/index.js', // 打包入口文件配置
  output: {
    // 输出文件配置
    filename: 'js/index.js', // 输出文件名(可增加目录)
    path: resolve(__dirname, 'dist'), // 输出文件放置的绝对目录
  },
  module: {
    // loader配置
    rules: [
      // loader规则配置
      {
        // 匹配js文件
        test: /\.js$/,
        use: 'happypack/loader?id=js',  // 使用happypack打包
      },
    ],
  },
  plugins: [
    new Happypack({
      id：'js',
      use:[ // 使用的loader
        {
          loader:'babel-loader',
          options:{
            presets:['@babel/preset-env']
          }
        }
      ]
    }),
  ],
  mode: 'development', // 开发环境模式
}
```

<Vssue title="Webpack issue" />