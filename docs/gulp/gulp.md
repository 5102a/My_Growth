# Gulp自动化构建工具

- gulp让工作变得简单，使用gulp自动化构建项目
- gulp运行在node环境下，基于node流的构建工具，使用流，直接在内存中处理文件，提高构建速度，简单的代码实现自动化构建，让工作更加轻松高效
- gulp强大之处不仅限于gulp本身，而且其庞大的插件库，所有支持gulp的插件都可以任你使用，4000+插件满足你的日常需求，通过gulp实现你想要的自动化操作不是问题

## 使用gulp

1. 由于gulp是在node环境下运行，那么就要先全局安装node
2. 安装gulp命令行工具`npm install --global gulp-cli`
3. 创建一个项目文件夹，在文件夹中`npm init`初始化项目
4. 安装gulp到此项目的开发依赖中`npm install --save-dev gulp`
5. 在项目根目录下创建`gulpfile.js`文件，此文件作为gulp执行的主文件
6. 在命令行中使用`gulp [任务名]`执行gulp，如果主文件中有默认导出则可省略任务名

## gulp用法

### 创建任务

- 回调函数形式，通过回调函数执行进一步操作

```js
function Task(cb) {
  cb()
}

exports.default = Task
```

- 通过return链式操作

```js
const { src, dest } = require('gulp')
function Task() {
  return src('*.css').pipe(dest('css/'))
}

exports.default = Task
```

### src()

- 创建一个流，用于从文件读取Vinyl对象

`src(globs, [options])`，其中[globs](https://www.gulpjs.com.cn/docs/getting-started/explaining-globs/)为用于匹配文件路径的字符串,可选[options](https://www.gulpjs.com.cn/docs/api/src/)为读取文件的选项，其返回值是一个流，可以在管道开始、中间使用，用于根据给定的globs添加文件

globs匹配规则

```js
gulp.src('./js/*.js')               // * 匹配js文件夹下所有.js格式的文件
gulp.src('./js/**/*.js')            // ** 匹配js文件夹的0个或多个子文件夹
gulp.src(['./js/*.js','!./js/index.js'])    // ! 匹配除了index.js之外的所有js文件
gulp.src('./js/**/{omui,common}.js')        // {} 匹配{}里的文件名
```

```js
const { src, dest } = require('gulp')
function Task() {
  // 此操作为，读取全部当前目录下以.css结尾的文件，复制到css文件夹下
  return src('*.css').pipe(dest('css/'))
}

exports.default = Task
```

调用src之后将会根据globs参数读取文件，并返回一个文件流，使用pipe方法可以在这个流中使用其他任务

### dest()

- 创建一个用于将Vinyl对象写入到文件系统的流

`dest(directory, [options])`，其中directory为用于写入文件的输出目录路径字符串，如果是个函数，该函数将与每个Vinyl对象调用，且函数需返回字符串路径,可选[options](https://www.gulpjs.com.cn/docs/api/dest/)为读取文件的选项，其返回值是一个流，可以在管道中间、结尾使用，用于在文件系统上创建文件

```js
const { src, dest } = require('gulp')
function Task() {
  // 此操作为，读取全部当前目录下以.css结尾的文件，复制到css文件夹下
  return src('*.css').pipe(dest('css/'))
}

exports.default = Task
```

调用dest之后将会写入文件，并返回一个可以在管道的中间或末尾使用的流，如果Vinyl对象具有symlink属性，将创建符号链接（symbolic link）而不是写入内容

### symlink()

- 创建一个流（stream），用于连接 Vinyl 对象到文件系统

`symlink(directory, [options])`类似dest，[options](https://www.gulpjs.com.cn/docs/api/symlink/)

```js
const { src, symlink } = require('gulp')
function Task() {
  // 此操作为，读取全部当前目录下以.css结尾的文件，复制到css文件夹下
  return src('*.css').pipe(symlink('css/'))
}

exports.default = Task
```

### lastRun()

- 检索当前进程中最后一次成功完成任务的时间。当监视程序正在运行时，对于后续的任务运行最有用，可缩短重构时间

`lastRun(task, [precision])`，task为已经注册的任务名字符串或函数，时间戳精度，0为ms级别，1000为s级别

```js
const { src, lastRun, dest, watch } = require('gulp')
function Task() {
  // 此操作为，读取全部当前目录下以.css结尾的文件，复制到css文件夹下
  return src('*.css', { since: lastRun(Task, 0) }).pipe(dest('css/'))
}
function Watch() {
  // 监听所有.css文件的变化，如果变化则执行Task任务
  watch('*.css', Task)
}
exports.default = Watch
```

当使用lastRun方法时，可以使多次重构时间大量缩短，只重构改变的文件，配合watch使用，提高效率

### series()

- 将任务函数或组合，组合成按照顺序执行的操作

`series(...tasks)`，task为已经注册的任务名字符串或函数，返回一个组合操作，它将注册为任务或嵌套在其他 series或parallel组合中，如果一个任务错误，则不会运行下去

```js
const { src, lastRun, dest, watch, series} = require('gulp')
function Task() {
  // 此操作为，读取全部当前目录下以.css结尾的文件，复制到css文件夹下
  return src('*.css', { since: lastRun(Task, 0) }).pipe(dest('css/'))
}
function Watch() {
  // 监听所有.css文件的变化，如果变化则执行Task任务
  watch('*.css', Task)
}
exports.default = series(Task,Watch) // 顺序执行传入的任务
```

使用series可以使多个任务顺序执行，可配合parallel并发执行任务

### parallel()

- 将任务函数或组合，组合成同时执行的较大操作

`parallel(...tasks)`，task为已经注册的任务名字符串或函数，返回一个组合操作，它将注册为任务或嵌套在其他 series或parallel组合中，如果一个任务错误，则其他任务有可能执行完，也有可能没完成

```js
const { src, lastRun, dest, watch, parallel } = require('gulp')
function Task() {
  // 此操作为，读取全部当前目录下以.css结尾的文件，复制到css文件夹下
  return src('*.css', { since: lastRun(Task, 0) }).pipe(dest('css/'))
}
function Watch() {
  // 监听所有.css文件的变化，如果变化则执行Task任务
  watch('*.css', Task)
}
exports.default = parallel(Task,Watch) // 并发执行传入的任务
```

使用parallel并发执行任务，可配合series使多个任务顺序执行

series使任务顺序执行(一个个执行)，parallel使任务并发执行(全部一起执行)

### watch()

- 当监听的globs发生更改时，运行任务

`watch(globs, [options], [task])`，globs为匹配文件，[options](https://www.gulpjs.com.cn/docs/api/watch/)为设置选项，task为已经注册的任务名字符串或函数，返回chokidar的一个实例，用于对监听设置进行细粒度控制，可设置监听、关闭、添加globs等

```js
const { src, dest, watch } = require('gulp')
function Task() {
  // 此操作为，读取全部当前目录下以.css结尾的文件，复制到css文件夹下
  return src('*.css')
  .pipe(dest('css/'))
}
function Watch() {
  // 监听所有.css文件的变化，如果变化则执行Task任务
  watch('*.css', Task)
}
exports.default = Watch
```

watch可以监听globs匹配的文件，当发生修改可及时调用任务，以便实时执行相应任务

### task()

- 定义任务，可以在其他方法中使用，不同与直接导出
- 此api现在不推荐使用，在4.0.0之前通过此api创建任务，4.0.0之后使用exports导出任务，然后在主任务文件中导入其他任务即可，这样可以让`gulpfile.js`更加清晰

`task([taskName], taskFunction)`,taskName任务名字符串，taskFunction任务所需要执行的函数

```js
const { src, dest, task } = require('gulp')

task('Task',function(){
  return src('*.css').pipe(dest('css/'))
})

exports.default = Task
```

gulp建议我们使用exports来创建和管理每个任务

### 不常用api

- `registry([registryInstance])`,允许将自定义的注册表插入到任务系统中，以期提供共享任务或增强功能
- `tree([options])`,获取当前任务依赖关系树
- `Vinyl.isVinyl(file)`,检测一个对象（object）是否是一个 Vinyl 实例
- `Vinyl.isCustomProp(property)`,确定一个属性是否由Vinyl在内部进行管理,如果属性不是内部管理的，则为True
- `Vinyl`,虚拟的文件格式,创建Vinyl对象`new Vinyl([options])`,当src()读取文件时，将生成一个Vinyl对象来表示文件——包括路径、内容和其他元数据,通过以下方式创建直接的Vinyl对象

```js
const Vinyl = require('vinyl');

const file = new Vinyl({
  cwd: '/',
  base: '/specs/',
  path: '/specs/file.js',
  contents: new Buffer('var x = 123')
});

file.relative === 'file.js';
file.dirname = '/specs';
file.path === '/specs/file.js';
file.basename === 'file.js';
file.stem === 'file';
file.extname = '.js';
file.path === '/specs/file.js';
```

### 示例

```js
/*
  gulp-css.js
*/
const { src, dest, series } = require('gulp')
const sass = require('gulp-sass') // sass插件
sass.compiler = require('node-sass')  //node编译模块
const cleanCss = require('gulp-clean-css')  //压缩css

// 处理scss
function handleScss() {
  return src('*.scss')  // 读取当前目录下所有scss文件
    .pipe(sass({ outputStyle: 'expended' }))  // 以expended格式编译sass文件为css
    .pipe(dest('./')) // 输出到当前目录下
}

// 处理css
function css() {
  return (
    src('index.css')  // 读取index文件，其中index文件import了scss编译后的文件
      .pipe(cleanCss({compatibility: 'ie8'})) // 压缩css，兼容ie8
      .pipe(dest('css/')) // 输出到css文件夹下
  )
}
// 使用series顺序执行handleScss, css任务，因为要先编译scss再进行css压缩
// 导出series任务
module.exports = series(handleScss, css)

/*
  gulpfile.js 主执行文件
 */
const cssTask = require('./gulp-css.js')
const { src, dest, watch, parallel } = require('gulp')

// 整理js文件
function js(){
  return src(['gulp-js.js']).pipe(dest('js/'))
}
// 监听js、scss、css文件变化，并且更新
function Watch() {
  // 监听所有.css文件的变化，如果变化则执行Task任务
  return watch(['gulp-js.js','*.scss','*.css','!main.css'],parallel(cssTask,js))
}
// 导出默认任务
exports.default = Watch
```

以上只是简单的使用gulp实现自动监听文件，文件改动时同时更新gulp构建之后的文件

<Vssue title="Gulp issue" />