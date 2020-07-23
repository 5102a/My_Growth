# Gulp常用插件使用

- gulp的强大之处不仅限于自身，其庞大的插件库，让gulp的自动化构建拥有无数可能，只要你能找到合适的插件，gulp就能帮你实现你想要的功能
- 可取npm搜索gulp前缀的插件

## gulp-sass

[gulp-sass](https://www.npmjs.com/package/gulp-sass)

`npm install node-sass gulp-sass --save-dev`

- gulp-sass是用来编译sass为css文件
- 使用`sass()`时，给定`outputStyle`的值为编译模式
  - 默认Nested，嵌套层次输出
  - expanded，类似手写输出
  - compact，每条规则只占一行的输出
  - compressed，压缩输出，只有一行
- 可以监听sass事件

```js
const {src,dest} = require('gulp')
const sass = require('gulp-sass') //导入sass插件

function Task(){
  // 读取scss文件夹下所有的scss文件
  return src('scss/**/*.scss')
  .pipe(sass({outputStyle:'expanded'}).on('error',sass.logError)) // 编译成css
  .pipe(dest('css/')) // 输出到css文件夹下
}

exports.default = Task
```

## gulp-clean-css

[gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)

`npm install gulp-clean-css --save-dev`

- gulp-clean-css是用来压缩css文件
- 使用`cleanCSS([options], [callback])`，options选项compatibility字段为最低兼容浏览器，回调函数参数为压缩文件详情

```js
const {src,dest} = require('gulp')

const cleanCss = require('gulp-clean-css')

function Task(){
  // 读取scss文件夹下所有的scss文件
  return src('css/**/*.css')
  .pipe(cleanCss({compatibility:'ie8'})) // 编译成css，兼容ie8
  .pipe(dest('css/')) // 输出到css文件夹下
}

exports.default = Task
```

还有`gulp-minify-css`也可以压缩css

## gulp-uglify

[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)

`npm install --save-dev gulp-uglify`

- gulp-uglify是用来压缩js文件
- 使用`uglify()`压缩js文件，如需自定义压缩配置可以查阅链接

```js
const {src,dest} = require('gulp')

const uglify = require('gulp-uglify')

function Task(){
  // 读取index.js、main.js文件
  return src(['index.js','main.js'])
  .pipe(uglify()) // 压缩js文件
  .pipe(dest('js/')) // 输出到js文件夹下
}

exports.default = Task
```

## gulp-rename

[gulp-rename](https://www.npmjs.com/package/gulp-rename)

`npm i gulp-rename`

- gulp-rename是用来修改文件名包括路径
- 支持多种方式修改文件名

```js

const {src,dest} = require('gulp')

const rename = require('gulp-rename')

function Task(){
  return src('index.js')
//   .pipe(rename({
//     dirname:'index/',
//     basename:'main',
//     extname:'.js'
//   }))
  .pipe(rename('index/main.js'))
  .pipe(dest('js/'))  // 输出目录：js/index/main.js
}

exports.default = Task
```

支持多种方式修改目录文件名，包括函数、对象、字符串形式，如果包含目录也会根据目录创建路径，最后追加在dest的路径之后

## gulp-concat

[gulp-concat](https://www.npmjs.com/package/gulp-concat)

`npm i gulp-concat`

- gulp-concat是用来合并js文件
- 使用`concat()`合并js文件，并且可以生成新文件导出

```js
const {src,dest,series,parallel,watch} = require('gulp')

const concat = require('gulp-concat')

function Task(){
  return src(['index.js','main.js'])
  .pipe(concat('all.js',{newLine: ';'}))  // 用 ‘;’分割合并，合并后为all.js
  .pipe(dest('js/'))  // 合并输出为 js/all.js 文件
}

exports.default = Task
```

## gulp-livereload

[gulp-livereload](https://www.npmjs.com/package/gulp-livereload)

`npm i gulp-livereload`

- gulp-livereload监听文件变化
- 3.x之后需要手动调用`livereload()`才能触发监听回调

```js
const { src, dest, watch } = require('gulp')
const livereload = require('gulp-livereload')

// 构建dist文件
function Html() {
  return src('index.html')
  .pipe(dest('dist/'))
  .pipe(livereload()) // 每次改动通知刷新
}
// 监听index.html
function Watch() {
  livereload.listen() // 启动监听
  watch('index.html', Html)
}
exports.default = Watch
```

## gulp-connect

[gulp-connect](https://www.npmjs.com/package/gulp-connect)

`npm i gulp-connect`

- gulp-connect是用来启动一个服务
- 使用`connect.server({})`配置服务器

```js
const { src, dest, watch, parallel } = require('gulp')
const connect = require('gulp-connect')

// 构建dist文件
function Html() {
  return src('index.html').pipe(dest('dist/')).pipe(connect.reload()) // 刷新服务
}
// 监听index.html
function Watch() {
  watch('index.html', Html)
}
// 启动服务
function Server() {
  connect.server({
    port: 8880,
    livereload: true,
    root: 'dist/',
  })
}
exports.default = parallel(Server, Watch)
```

## gulp-load-plugins

[gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins)

`npm i gulp-load-plugins`

- gulp-load-plugins是一个快速导入全部依赖插件的工具

```js
const { src, dest, watch, parallel } = require('gulp')
// 把所有package.json中安装的插件导入成一个对象输出
const $ = require('gulp-load-plugins')()  // 注意需要调用后，返回包含所有插件的对象

// 构建dist文件
function Html() {
  return src('index.html')
  .pipe(dest('dist/'))
  .pipe($.livereload()) // 直接用对象.插件名使用
}
function Watch() {
  $.livereload.listen() // 其中插件名为'gulp-'之后的名称，如有'-'用驼峰代替
  watch('index.html', Html)
}
exports.default = Watch
```

## gulp-babel

[gulp-babel](https://www.npmjs.com/package/gulp-babel)

`npm i gulp-babel`

- gulp-babel可以把es6代码编译成es5

```js
const { src, dest, watch, parallel } = require('gulp')
// 把所有package.json中安装的插件导入成一个对象输出
const $ = require('gulp-load-plugins')()  // 注意需要调用后，返回包含所有插件的对象

// 构建dist文件
const { src, dest } = require('gulp')
const babel = require('gulp-babel')

// 构建dist文件
function Task() {
  return src('index.js')
  .pipe(babel({
    presets:['@babel/env']
  }))
  .pipe(dest('dist/')) // es5输出
}

exports.default = Task
```

## gulp-base64

[gulp-base64](https://www.npmjs.com/package/gulp-base64)

`npm i gulp-base64`

- gulp-base64可以把css中的图片转为base64格式

```js
const { src, dest } = require('gulp')
const base64 = require('gulp-base64')

// 构建dist文件
function Task() {
  return src('index.css')
    .pipe(
      base64({
        baseDir: 'img', // css中的绝对基本路径
        extensions: ['svg', 'png', 'jpeg', 'jpg'], // 处理的扩展名，可支持url正则匹配
        exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'], // 跳过匹配的url文件
        maxImageSize: 8 * 1024, // 最大转base64文件大小
        debug: true, // 日志
      })
    )
    .pipe(dest('dist/'))
}

exports.default = Task
```

## gulp-if

[gulp-if](https://www.npmjs.com/package/gulp-if)

`npm i gulp-if`

- gulp-if可以对gulp进行流程控制

```js
const { src, dest } = require('gulp')
const gulpIf = require('gulp-if')
const sass = require('gulp-sass')
const cleanCss = require('gulp-clean-css')

// 构建dist文件
function Task() {
  const isSass=false
  return src('index.css')
    .pipe(gulpIf(isSass,sass({outputStyle:'expanded'}),cleanCss())) // isSass为真执行sass，为假执行cleanCss
    .pipe(dest('dist/'))
}

exports.default = Task
```

## gulp-autoprefixer

[gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)

`npm i gulp-autoprefixer`

- gulp-autoprefixer可以给css样式加上浏览器前缀

```js
const { src, dest } = require('gulp')
const autoprefixer = require('gulp-autoprefixer')

// 构建dist文件
function Task() {
  const isSass = false
  return src('index.css')
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'], // 浏览器版本
        cascade:true,     // 美化属性，默认true
        add:true,        // 是否添加前缀，默认true
        remove:true,    // 删除过时前缀，默认true
        flexbox:true   // 为flexbox属性添加前缀，默认true
    })
    )
    .pipe(dest('dist/'))
}

exports.default = Task
```

## gulp-sourcemaps

[gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)

`npm i gulp-sourcemaps`

- gulp-sourcemaps可以记录源文件和输出文件之间的位置信息映射关系

```js
const { src, dest } = require('gulp')
const cleanCss = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')

// 构建dist文件
function Task() {
  return (
    src('index.css')
      .pipe(sourcemaps.init()) // 初始化sourcemaps
      .pipe(cleanCss())
      // 把映射关系的maps文件输出到dist目录下,addComment是否在源输出文件下添加sourcemaps注释
      .pipe(sourcemaps.write('dist/', { addComment: false }))
      .pipe(dest('dist/'))
  )
}

exports.default = Task
```

<Vssue title="Gulp issue" />