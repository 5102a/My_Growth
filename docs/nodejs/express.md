# Express Web框架

- express是基于Node.js平台，快速、开放、极简的 Web 开发框架
- express是一个保持最小规模的灵活的Node.js Web 应用程序开发框架，为Web和移动应用程序提供一组强大的功能
- 使用您所选择的各种HTTP实用工具和中间件，快速方便地创建强大的 API
- express提供精简的基本Web应用程序功能，而不会隐藏您了解和青睐的Node.js功能
- 许多流行的开发框架都基于Express构建

[Express中文官网](https://www.expressjs.com.cn/)

## 安装使用Express

- `npm install express --save`作为生产依赖
- `npm init`创建`package.json`文件
- 创建入口文件`app.js`，之后就可以在其中引入并使用express

```js
const express = require('express')
const app = express() // 创建express实例
// 请求中间件
app.get('/', (req, res) => {
  res.send('<h2>hello express<h2>')
})
// 监听端口
app.listen(8888, () => {
  console.log('express服务器启动！')
})
```

这是用express搭建的简单Web服务器，使用`node app.js`运行起来

- 也可以通过express-generator应用生成器，快速的生成一个Web项目结构
- 先安装`npm install -g express-generator`，再执行`express`生成项目具体命令参数可看[官网文档](https://www.expressjs.com.cn/starter/generator.html)
- nodejs在8.2.0及以上可以使用`npx express-generator`直接安装并生成项目
- 启动应用使用如下命令
  - Windows下：`set DEBUG=myapp:* & npm start`
  - 其他系统：`DEBUG=myapp:* npm start`

将会生成如下目录结构

```js
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug
```

Pug为模板引擎（view engine），可在生成命令中配置是否添加

## router路由

- express框架对nodejs响应客户端请求做了大量封装，极大的简化了方法
- 路由是指确定应用程序如何响应客户端对特定端点的请求，该特定端点是URI（或路径）和特定的HTTP请求方法（GET，POST等）
- 每个路由都可以使用多个中间件来依次处理同一个请求
- 也可以使用多个路由来响应不同的请求，包括内置路由、外置路由等
- 路由一般结构`app.METHOD(PATH, HANDLER)`
  - app是的实例express。
  - METHOD是小写的HTTP请求方法。
  - PATH 是服务器上的路径。
  - HANDLER 是匹配路线时执行的功能。
- express支持所有http请求方法
- 这些路由方法指定在应用程序收到对指定路由（端点）和HTTP方法的请求时调用的回调函数（有时称为“处理函数”）
- 换句话说，应用程序“侦听”与指定的路由和方法匹配的请求，并且当它检测到匹配项时，它将调用指定的回调函数
- 路由方法可以具有多个回调函数作为参数。对于多个回调函数，重要的是提供next回调函数的参数，然后next()在函数体内调用以将控制权移交给下一个回调

对所有http请求加载中间件方法

```js
// req请求对象，res响应对象，调用next函数才会将控制权移交给下一个回调函数
// 所有http请求都会经过这个中间件处理，再传给下面的路由中间件
// 对于所有'/index'的请求都执行以下回调
app.all('/index', (req, res, next) => {
  console.log('ok')
  next() // 转移控制器
})
// 进一步处理请求
app.get('/index', (req, res) => {
  res.send('<h2>hello express<h2>')
})
```

对于请求路径的匹配，可以使用正则语法来匹配，但是不支持模式匹配

```js
// 匹配 /abc、/ac
app.get('/ab?c', (req, res) => {
  res.send('/ab?c')
})
// 匹配 /abc、/abbc、/abbbc
app.get('/ab+c', (req, res) => {
  res.send('/ab+c')
})
// 匹配 /abc、/ab43c、/ab555ff55c
app.get('/ab*c', (req, res) => {
  res.send('/ab*c')
})
// 匹配 /abc.txt
app.get('/abc.txt', (req, res) => {
  res.send('/abc.txt')
})
// 匹配 url带有'index'的请求
app.get(/index/, (req, res) => {
  res.send('/index/')
})
```

### 路由参数

- 使用路由参数来捕获URL中在其位置处指定的值，捕获的值将填充到req.params对象中，并将路径中指定的route参数的名称作为其各自的键
- 要使用路由参数定义路由，只需在路由路径中指定路由参数，路径参数的名称必须由“文字字符”`（[A-Za-z0-9_]）`组成

```js
// localhost:8888/user/55/menu/main
app.get('/user/:id/menu/:item', (req, res) => {
  // req.params.id=55  req.params.item=main
  res.send(req.params.id + req.params.item)
})
```

url使用连字符（-）和点（.）是按字面意义解释的，他可以与路由参数一起使用，也能通过`req.params来获取值`

```js
// localhost:8888/user/1a-ff
app.get('/user/:start-:end', (req, res) => {
  const start = req.params.start // 1a
  const end = req.params.end // ff
  res.send(start + end) // 1aff
})
// localhost:8888/user/express.txt
app.get('/user/:name.:ext', (req, res) => {
  const name = req.params.name // express
  const ext = req.params.ext // txt
  res.send(name + '/' + ext) // express/txt
})
```

还能准确匹配参数的值

```js
// localhost:8888/user/55
app.get('/main/:id(\\d+)', (req, res) => {
  res.send(req.params.id) // 55
})
// localhost:8888/user/aak55
app.get('/main/:id(*\\d+)', (req, res) => {
  res.send(req.params.id) // aak55
})
```

### 路由处理程序

- 在路由匹配到请求之后可以通过多个回调函数来处理请求并且响应
- 可以使用传递多个函数作为参数，或者使用函数数组形式
- 可以使用next来让出请求处理控制权，或者跳转到指定路由再次处理

```js
const cb1 = function (req, res, next) {
  req.params.id += 'cb1'
  next()
}
const cb2 = function (req, res, next) {
  req.params.id += 'cb2'
  next()
}
// 请求 http://localhost:8888/main/11
app.get('/main/:id', [cb1, cb2], (req, res, next) => {
  req.params.id += 'cb3'
  console.log(req.params.id) // '11cb1cb2cb3'
  next('/menu') // 跳转到'/menu'路由处理
})
app.get('/menu', (req, res) => {
  // 此时处理的路由参数id变为当前匹配路由名
  console.log(req.params.id) // '/menu'
  res.send(req.params.id)
})
```

### 链式路由

- `app.route`为同一个路由路径创建可链接的路由处理程序，一次性创建所有的请求处理程序
- 针对同一个请求路由的不同请求方法使用单独的处理程序处理

```js
// 链式处理所有请求
app
  .route('/index')
  .get((req, res) => {
    res.send('get')
  })
  .post((req, res) => {
    res.send('post')
  })
  .put((req, res) => {
    res.send('post')
  })
```

当然如果需要对一个路径的所有请求，做同一个操作，那么跨域用`app.all()`

### 模块路由

- 使用单独的模块处理指定路由下的多种请求
- 使用`express.Router()`来创建一个模块路由实例，这个实例是一个完整的中间件和路由系统，也算是外置路由
- 在主程序中通过`app.use()`来使用这个模块路由

```js
/* app.js */
const express = require('express')
const route = require('./route.js')
const app = express()
// localhost:8888/main
app.use('/main', route)
app.listen(8888, () => {
  console.log('express服务器启动！')
})


/* route.js */
const express = require('express')
const router = express.Router()
// 此路由的中间件
router.use((req, res, next) => {
  console.log(req.method)
  next()
})
// localhost:8888/main/goods
router.get('/goods', (req, res) => {
  res.send('get goods')
})
// localhost:8888/main/pay
router.post('/pay', (req, res) => {
  res.send('post pay')
})
module.exports = router
```

相对于把一些特定的请求，使用模块路由的方式单独处理，最后在通过app来使用

### 响应

- res响应对象上的方法可以将响应发送到客户端，并终止请求-响应周期
- 如果在应该回调中调用以下方法将会直接返回到客户端，而不会进一步处理请求
- 如果服务器没有执行这些方法，客户端将会被挂起

res.download(),提示要下载的文件。
res.end(),结束响应过程。
res.json(),发送JSON响应。
res.jsonp(),发送带有JSONP支持的JSON响应。
res.redirect(),重定向请求。
res.render(),渲染视图模板。
res.send(),发送各种类型的响应。
res.sendFile(),将文件作为八位字节流发送。
res.sendStatus(),设置响应状态代码，并将其字符串表示形式发送为响应正文。

## 中间件

- 中间件功能是可以访问请求对象（req），响应对象（res）和next应用程序的请求-响应周期中的功能的功能
- 该next功能是Express路由器中的功能，当调用该功能时，将在当前中间件之后执行中间件
- 中间件功能可以执行以下任务：
  - 执行任何代码
  - 更改请求和响应对象
  - 结束请求-响应周期
  - 调用堆栈中的下一个中间件
- 如果中间件没有调用next，并且没有响应客户端将会被挂起，简单说要么调用next给下一个中间件处理，要么直接响应客户端，否则客户端将得不到响应而被挂起

![中间件](./img/9.png)

- express中书写中间件的先后顺序也很重要，写在前头的优先执行
- 如果把中间件写在了响应后面，那么将无法执行回调

```js
// 使用中间件功能
app.use((req, res, next) => {
  req.time = Date.now()
  next()
})
// 中间件回调先执行，调用next之后再处理响应请求
app.get('/index', (req, res) => {
  console.log(req.time) // 获取中间件中设置的数据
  res.send(JSON.stringify(req.time))
})
```

### 使用中间件

- express是一个路由和中间件Web框架，其自身的功能很少：Express应用程序本质上是一系列中间件函数调用
- Express应用程序可以使用以下类型的中间件：
  - 应用层中间件
  - 路由器级中间件
  - 错误处理中间件
  - 内置中间件
  - 第三方中间件

#### 应用层中间件

- 使用app实例上的方法设置处理程序，可以有使用路径，也可以没有

以下这些都是应用层中间件

```js
// 所有请求都处理
app.use((req, res, next) => {
  console.log('use');
  next()
})
// 处理包含'/'的请求
app.use('/',(req, res, next) => {
  console.log('/');
  next()
})
// 处理包含'/user/xx'的请求
app.use('/user/:id',(req, res, next) => {
  console.log('/user/:id',req.params.id);
  next()
})
// 只处理'/index'请求
app.get('/index', (req, res) => {
  console.log('/index');
  res.send()
})
```

以上这些与路由类似，使用use的中间件是可以匹配包含路径的请求

对于使用`app.METHOD()`或`router.METHOD()`的中间件来说，可以使用`next('route')`来直接跳过所有的中间件，直接进入下一个路由中间件函数中

```js
// 只处理'/user/xx'请求
app.get(
  '/user/:id',
  (req, res, next) => {
    console.log(1)
    next('route') // 跳过下一个中间件函数，直接进入下一个路由中间件
  },
  (req, res) => {
    console.log(2)
    res.send()
  }
)
// 只处理'/user/xx'请求
app.get('/user/:id', (req, res) => {
  console.log(3)
  res.send()
})
// 1 3
```

在`app.METHOD()`或`router.METHOD()`中使用`next('route)`将会直接进入下一个路由中间件函数，跳过其他中间件

这些中间件也可以使用传递函数数组的方式

#### 路由级中间件

- 路由中间件就如同模块路由一样，使用单独的模块路由来处理指定的请求
- 使用`var router = express.Router()`来创建路由实例，使用这个router实例来替代app使用中间件
- 同样也具备next跳转，不同的是：
  - app中使用`next('route')`跳转到下一个路由中间件
  - router中使用`next('router')`跳转到下一个路由中间件

```js
router.use((req, res, next) => {
  console.log(0)
  next()
})
router.get(
  '/user/:id',
  (req, res, next) => {
    console.log(1)
    // 控制权转回路由器实例 此时打印 0 1 4
    next('router')
    // 如果使用下列方法，将会打印 0 1 3
    // next('route')
    // 如果使用下列方法，将会打印 0 1 2
    // next()
  },
  (req, res) => {
    console.log(2)
    res.send()
  }
)
router.get('/user/:id', (req, res) => {
  console.log(3)
  res.send()
})
app.use(router)
// 在router让出控制权时才会处理请求
app.get('/user/:id', (req, res) => {
  console.log(4)
  res.send()
})
```

- 这里说下使用`next()`时参数带来的区别：
  - `next()`:跳转到下一个中间件处理函数
  - `next('route')`:跳转到下一个路由中间件处理函数
  - `next('router')`:router实例让出控制权，使用app中间件处理函数
- 路由中间件是指匹配请求路径的中间件

#### 错误处理中间件

- 错误处理中间件与其他中间件不同的是，其处理函数必须含义4个形参，不管有没有用到都需要设置，这是因为express是根据形参个数来判断错误处理中间件
- 处理函数的第一个参数是err对象

```js
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

#### 内置中间件

Express具有以下内置的中间件功能：

- express.static提供静态资产，例如HTML文件，图像等。
- express.json使用JSON解析传入的请求。注意：Express 4.16.0+中可用
- express.urlencoded使用URL编码的有效内容解析传入的请求。 注意：Express 4.16.0+中可用

#### 第三方中间件

- 第三方中间件都需要安装并且引入
- 一般情况下，直接调用引入，将会返回中间件处理函数，之后再将此函数传入中间件，即可使用

```js
// 先安装 npm install cookie-parser
const express = require('express')
const app = express()
// 导入第三方模块
const cookieParser = require('cookie-parser')
const handle = cookieParser() // 生成处理函数
// 加载第三方中间件处理函数
app.use(handle)
```

只要支持express中间件功能的插件都能通过这种方式使用

## 静态资源托管

- express为了提供一些静态资源的访问，如css、img、js等
- 使用内置中间件`express.static(root, [options])`对静态资源进行托管，使用中间件方法`app.use(express.static('public'))`，其中`'public'`为，对服务器下的public文件夹中的资源进行托管，但不会追加在URL中、也就是请求可以不带这个path，只要是请求这些静态的资源就会去这个path下查找
- 只有这个path不需要添加到url请求中，但是其中的其他文件夹路径则需要添加到url中

```js
const express = require('express')
const path = require('path')
const app = express()
// 使用静态资源托管
// 可以直接通过 localhost:8888/imgs/1.png 访问 assets/imgs/1.png
// assets相对于静态资源默认寻找的目录，请求url中可以不需要写
app.use(express.static('assets'))
app.get('/', (req, res) => {
  res.send('<h2>hello express<h2>')
})

app.listen(8888, () => {
  console.log('express服务器启动！')
})
```

多个静态资源目录可以多次使用`app.use(express.static('path'))`来设置中间件

当然，也可以给静态资源添加公共url前缀

```js
// 可以直接通过 localhost:8888/public/imgs/1.png 访问 assets/imgs/1.png
// '/public'是设置了请求url的公共目录
app.use('/public', express.static('assets'))
// 但是此时就不能使用localhost:8888/imgs/1.png来访问资源了
```

静态资源托管路径path是相对于启动express的目录，如果在其他目录中启动web服务器，那么建议使用nodejs的path模块来设置绝对路径，这样才不会导致路径错误

```js
// __dirname表示获得当前文件所在目录的完整目录名，这就与启动时目录无关了
app.use('/public', express.static(__dirname+'/assets'))
```

## Express使用模板引擎

- 一个模板引擎使您能够在您的应用程序中使用静态模板文件
- 在运行时，模板引擎用实际值替换模板文件中的变量，然后将模板转换为发送给客户端的HTML文件。这种方法使设计HTML页面更加容易
- 与Express一起使用的一些流行模板引擎是Pug， Mustache和EJS，不过express把Pug作为默认使用的模板引擎

### 使用模板引擎

- 默认views即模板文件所在的目录。例如：app.set('views', './views')。默认把views设置为应用程序根目录中的./views
- view engine，要使用的模板引擎。使用Pug模板引擎：app.set('view engine', 'pug')
- 安装`npm install pug --save`
- 设置视图引擎后，您无需指定引擎或在应用程序中加载模板引擎模块，Express在内部加载模块

pug模板文件内容如下

```pug
// index.pug
html
  head
    title= title
  body
    h1= message
```

之后使用`res.render()`渲染模板，并返回

```js
app.get('/', function (req, res) {
  // 指定使用的模板文件，以及传入的模板参数，渲染成html之后响应
  res.render('index.pug', { title: 'Hey', message: 'Hello there!' })
})
```

## 错误处理

- 错误处理是指Express如何捕获和处理同步和异步发生的错误。
- Express带有默认错误处理程序，因此您无需自己编写即可开始使用

### 捕获错误

- 确保Express能够捕获运行路由处理程序和中间件时发生的所有错误
- 如果是路由或者中间件中发生的同步错误，我们可以不需要捕获，express可以帮我们捕获并处理该错误
- 对于异步返回的错误，需要使用`next(err)`,这样express才能捕获并处理

```js
app.use((req, res, next) => {
  // 同步
  throw new Error('出错了') // express自动捕获错误
  next()
})
app.use((req, res, next) => {
  // 异步
  // fs.readFile('./index.html',next) // 直接传递next
  fs.readFile('./index.html', (err) => {
    next(err) // 把错误传递给err
  })
})
app.use((req, res, next) => {
  // 异步
  setTimeout(() => {
    try {
      // 异步中必须手动捕获错误，再传递给express
      throw new Error('BROKEN')
    } catch (error) {
      next(error) // 异步中处理错误
    }
  }, 0)
})
app.use((req, res, next) => {
  // 异步Promise
  Promise.reject().catch(next)
})
app.use(async (req, res, next) => {
  // 异步async
  try {
    await Promise.reject('出错了')
  } catch (error) {
    next(error)
  }
})
```

### 错误处理

- Express带有内置的错误处理程序，可处理应用程序中可能遇到的任何错误
- 默认的错误处理中间件功能已添加到中间件功能堆栈的末尾
- 如果你将错误传递给next而且没有自定义错误处理函数，那么错误将由内置错误处理程序进行处理，错误将与堆栈跟踪一起写入客户端
- 如果使用生产环境，将不会把堆栈跟踪写入到客户端

```js
app.get('/', (req, res, next) => {
  res.send('ok')
  next('err') // 传递的错误信息将会被打印出来
})

app.get(
  '/index',
  (req, res, next) => {
    res.send('ok') 
    throw new Error('出错了') // 响应后出错
  },
  (err, req, res, next) => {  // 带4个参数的就是错误处理程序
    console.log(err) // 捕获上面的错误，并打印
  }
)
```

自定义错误处理

```js
app.use((req, res, next) => {
  throw new Error('出错了')
  next()
})
// 处理所有中间件错误的处理函数
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send('error')
  } else {
    res.send('not find')
  }
})
```

错误处理程序写在最后，这样就能处理前面的错误

- 在错误处理函数中不调用next时，您负责编写（并结束）响应。否则，这些请求将“挂起”，并且不符合垃圾回收的条件

```js
app.get(
  '/index',
  (req, res, next) => {
    if (!req.query.id) {
      next('route') // 跳转到错误处理路由
    } else {
      next() // 正常处理
    }
  },
  (req, res) => {
    res.send('ok')
  }
)
// 错误处理
app.get('/index', (req, res, next) => {
  res.status(500).send('error')
})
```

## Debug

- Express在内部使用调试模块来记录有关路由匹配，正在使用的中间件功能，应用程序模式以及请求-响应周期流程的信息
- 默认情况下，日志记录是关闭的，可以使用DEBUG环境变量有条件地将其打开
- window上使用`set DEBUG=express:* & node index.js`命令运行debug
- 其他操作系统上使用`DEBUG=express:* node index.js`命令运行debug
- 查看Express中所有的内部日志，设置DEBUG为`express:*`
- 只查看路由器的日志，设置DEBUG为`express:router`
- 只查看应用程序的日志，设置DEBUG为`express:application`
- 需要从cmd中输入命令

使用express项目生成器，生成的默认应用程序上运行此命令将输出以下输出

```js
$ DEBUG=express:* node ./bin/www
  express:router:route new / +0ms
  express:router:layer new / +1ms
  express:router:route get / +1ms
  express:router:layer new / +0ms
  express:router:route new / +1ms
  express:router:layer new / +0ms
  express:router:route get / +0ms
  express:router:layer new / +0ms
  express:application compile etag weak +1ms
  express:application compile query parser extended +0ms
  express:application compile trust proxy false +0ms
  express:application booting in development mode +1ms
  express:router use / query +0ms
  express:router:layer new / +0ms
  express:router use / expressInit +0ms
  express:router:layer new / +0ms
  express:router use / favicon +1ms
  express:router:layer new / +0ms
  express:router use / logger +0ms
  express:router:layer new / +0ms
  express:router use / jsonParser +0ms
  express:router:layer new / +1ms
  express:router use / urlencodedParser +0ms
  express:router:layer new / +0ms
  express:router use / cookieParser +0ms
  express:router:layer new / +0ms
  express:router use / stylus +90ms
  express:router:layer new / +0ms
  express:router use / serveStatic +0ms
  express:router:layer new / +0ms
  express:router use / router +0ms
  express:router:layer new / +1ms
  express:router use /users router +0ms
  express:router:layer new /users +0ms
  express:router use / &lt;anonymous&gt; +0ms
  express:router:layer new / +0ms
  express:router use / &lt;anonymous&gt; +0ms
  express:router:layer new / +0ms
  express:router use / &lt;anonymous&gt; +0ms
  express:router:layer new / +0ms
```

向应用程序发出请求时，您将看到Express代码中指定的日志

```js
express:router dispatching GET / +4h
express:router query  : / +2ms
express:router expressInit  : / +0ms
express:router favicon  : / +0ms
express:router logger  : / +1ms
express:router jsonParser  : / +0ms
express:router urlencodedParser  : / +1ms
express:router cookieParser  : / +0ms
express:router stylus  : / +0ms
express:router serveStatic  : / +2ms
express:router router  : / +2ms
express:router dispatching GET / +1ms
express:view lookup "index.pug" +338ms
express:view stat "/projects/example/views/index.pug" +0ms
express:view render "/projects/example/views/index.pug" +1ms
```

- 如果是使用项目生成器命名生成的项目，在debug时可以使用`$ DEBUG=name:* node index.js`
- 如果同时调试多个项目生成器命名生成的项目，则使用`$ DEBUG=http,mail,express:* node index.js`进行调试
- 如果是在window上，则只需在命令前面加上set，以及在node之前加上&

[Express的Apis](https://www.expressjs.com.cn/en/4x/api.html#express)

<Vssue title="Node.js issue" />