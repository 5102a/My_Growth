# Jest

- 前端自动化测试

[JEST官网](https://jestjs.io/docs/zh-Hans/getting-started)

## 使用Jest

- 安装jest,`yarn add --dev jest`
- 在node环境下运行，需要安装node
- 如果直接在命令行上使用jest，需要全局安装jest

创建自己编写的代码模块，以及对应的测试模块

```js
// demo.js
function add(a, b) {
  return a + b
}

module.exports = {
  add
}

// demo.test.js
const math = require('./demo')
const { add } = math

test('加法测试 2+3', () => {
  expect(add(2, 3)).toBe(5)
})
```

运行之后将会打印出

```js
 PASS  ./demo.test.js
  √ 加法测试 2+3 (8ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.364s, estimated 4s
Ran all test suites.
Done in 5.57s.
```

这些就是测试报告

测试模块文件名需要以xxx.test.js命名，这样jest才会知道哪些才是测试模块

## 编写一个测试

- 创建一个`demo.test.js`的测试文件，在这个文件里测试`demo.js`模块的功能

```js
// demo.test.js
// 导入要测试的模块
const math = require('./demo')
// 提取方法
const { add } = math

// 编写一个测试，参数1为此测试的描述，参数2为测试时将会执行的回调
test('加法测试 2+3', () => {
  // expect 期望执行的方法调用并且返回结果
  // toBe 匹配器，用于匹配期望中的结果是否与测试相同
  expect(add(2, 3)).toBe(5)
})
```

- 其中test方法为添加一个测试用例，参数1、2分别是此测试的描述，以及执行测试时的回调函数
- expect方法传入的参数为需要测试的并且返回的结果
- toBe作为匹配器，用来匹配实际结果与设定的测试值是否相等，从而来判断此测试是否通过
- 我们可以把形如`expect(1).toBe(1)`这种表达式定义为一句断言语句
- 在`package.json`中配置脚本命令

```json
{
  ...
  "scripts": {
  "test": "jest", // 直接启动jest，只执行一次
  "test-w": "jest --watch", // 启动监视变更的测试文件，需要配合git版本管理
  "test-wa": "jest --watchAll" // 启动监视所有测试的文件
  }
  ...
}
```

之后会讲jest中的各个模式的作用

这里需要注意一点，jest运行在node环境下，使用的是commonjs模块化语法导入模块，如果需要使用es6的import语法导入，则需要安装babel来转换

### 使用babel转换代码

- 安装babel相关转换包`yarn add @babel/core @babel/preset-env -D`
- 创建`.babelrc`文件，用于配置babel

```js
// .babelrc
{
  // 预设
  "presets": [
    [
      // 使用此预设环境转换代码
      "@babel/preset-env",
      {
        // 转换目标
        "targets": {
          "node": "current" // 根据当前node环境情况来转换代码
        }
      }
    ]
  ]
}
```

注意如果是json文件不能加注释，这里是用于演示

- 配置了此babel文件之后，jest的内置插件`babel-jest`会在执行测试时会先检查babel配置如果有，则进行babel转换代码，之后jest再执行转换后的代码
- 现在我们就可以使用es6的模块化语法了

### 初始化jest配置文件

- jest也有相应的配置文件供我们自定义配置
- 全局安装完jest之后使用`jest --init`将会进行配置文件的初始化，根据需求进行选择配置即可
- 在生成的配置文件中有多条选项可以参考[官方介绍](https://jestjs.io/docs/zh-Hans/configuration)

## 匹配

- 在编写测试时，通常需要检查值是否符合某些条件。expect使您可以访问许多“匹配器”，以使您可以验证不同的内容
- jest中的匹配器简单来说就是用于匹配实际测试的结果与测试预设的结果是否匹配
- 其中匹配的关系就是由使用的匹配器来决定

### expect

- 每次测试一个值就需要用到expect函数，使用expect及“匹配”函数来断言某个值
- expect传入的是测试时将会返回的值，也就是测试值
- 匹配器传入的是需要确切需要获得的值，再通过匹配器来判断这2者的值是否满足匹配器的匹配关系，如果满足者此测试用例通过，反之不通过

```js
// demo.js
function add(a, b) {
  return a + b
}
export { add }

// demo.test.js
import { add } from './demo'

test('加法测试 2+3', () => {
  // 实际测试值为 add(2, 3) 的返回值
  // 与设定的结果 5 作 toBe 匹配，其中toBe匹配使用===模式匹配
  expect(add(2, 3)).toBe(5) // 测试通过
})
```

expect将会返回一个期望对象,里边包含了非常多的匹配方法，用于对测试值做不同的匹配判断

### 匹配器

- toBe 匹配器——检查引用，使用Object.is比较

```js
test('toBe 匹配器', () => {
  expect(4 + 5).toBe("9") // 测试错误
})
// Expected: "9" // 期望得到 "9"
// Received: 9  // 实际得到 9
// 二者不能严格相等

test('toBe 匹配器 使用 === 对比数据', () => {
  expect({ a : 1 }).toBe({ a : 1 }) // 测试错误
})
// 引用不同
```

- toEqual 匹配器——递归比较对象实例的所有属性，不会比对引用，使用Object.is比较

```js
test('toEqual 匹配器', () => {
  expect({ a : 1 }).toEqual({ a : 1 }) // 测试通过，数据内容一致
})

test('toEqual 匹配器', () => {
  expect(4 + 5).toEqual("9") // 测试不通过，数据类型不同
})
```

- toBeNull 匹配器——toBeNull()与toBe(null)相同，匹配null

```js
test('toBeNull 匹配器', () => {
  // expect(null).toBe(null) // 测试通过
  expect(null).toBeNull() // 测试通过
})
```

- toBeUndefined 匹配器——匹配undefined

```js
test('toBeUndefined 匹配器', () => {
  expect(undefined).toBeUndefined() // 测试通过
})
```

- toBeTruthy 匹配器——匹配真(true)

```js
test('toBeTruthy 匹配器', () => {
  // expect(0).toBeTruthy() // 测试不通过
  expect(1).toBeTruthy() // 测试通过
})
```

- toBeFalsy 匹配器——匹配假(false)

```js
test('toBeFalsy 匹配器', () => {
  // expect(1).toBeFalsy() // 测试不通过
  expect(0).toBeFalsy() // 测试通过
})
```

- not 匹配器——匹配取反结果

```js
test('not 匹配器', () => {
  expect(1).not.toBeFalsy() // 测试通过
  // expect(0).not.toBeFalsy() // 测试不通过
})
```

- toBeGreaterThan 匹配器——大于判断

```js
test('toBeGreaterThan 匹配器', () => {
  // expect(1).toBeGreaterThan(0) // 测试通过
  expect(0).toBeGreaterThan(0) // 测试不通过
})
```

- toBeLessThan 匹配器——小于判断

```js
test('toBeLessThan 匹配器', () => {
  // expect(1).toBeLessThan(2) // 测试通过
  expect(0).toBeLessThan(0) // 测试不通过
})
```

- toBeLessThanOrEqual 匹配器——小于等于判断

```js
test('toBeLessThanOrEqual 匹配器', () => {
  // expect(1).toBeLessThanOrEqual(0) // 测试不通过
  expect(0).toBeLessThanOrEqual(0) // 测试通过
})
```

- toBeCloseTo 匹配器——用于解决js浮动数精度计算问题

```js
test('toBeCloseTo 匹配器', () => {
  // Expected: 0.3
  // Received: 0.30000000000000004
  // expect(0.2 + 0.1).toEqual(0.3) // 测试不通过，js浮动计算问题

  expect(0.2 + 0.1).toBeCloseTo(0.3) // 测试通过
})
```

- toMatch 匹配器——匹配字符串以及子串

```js
test('toMatch 匹配器', () => {
  // expect('abc').toMatch('ac') // 测试不通过
  // expect('abc').toMatch('ab') // 测试通过
  expect('abc').toMatch(/abc/) // 测试通过,支持正则
})
```

- toContain 匹配器——匹配数组子项

```js
test('toContain 匹配器', () => {
  // expect(['a','b','c']).toContain('d') // 测试不通过
  // expect(new Set(['a','b','c'])).toContain('c') // 测试通过，支持Set
  expect(['a','b','c']).toContain('a') // 测试通过
})
```

- toMatchObject 匹配器——匹配对象子属性

```js
test('toMatchObject 匹配器', () => {
  const obj = {
    name: 'tom',
    age: 18,
  }
  // expect(obj).toMatchObject({ name: 'tom' }) // 测试通过
  expect(obj).toMatchObject({ partner: 'jerry' }) // 测试不通过
})
```

- toThrow 匹配器——匹配抛出异常

```js
test('toThrow 匹配器', () => {
  const err = () => {
    throw new Error('error')
  }
  expect(err).toThrow() // 抛出异常，测试通过
})

test('toThrow 匹配器', () => {
  const err = () => {
    throw new Error('error')
  }
  expect(err).toThrow('err') // 测试不通过，异常信息不匹配
})
```

更多匹配器，请参考[官方匹配器文档](https://jestjs.io/docs/zh-Hans/expect)

## 模式

- 使用`jest --watchAll`命令来监视所有测试文件时，jest提供给我们一些模式来更好的测试代码

```js
// 使用 jest --watchAll 来监视文件时，每次测试完成后,命令行都会出现下列描述
Watch Usage: Press w to show more. // 按w键查看更多模式
// 将会列出以下模式
› Press f to run only failed tests.
› Press o to only run tests related to changed files.
› Press p to filter by a filename regex pattern.
› Press t to filter by a test name regex pattern.
› Press q to quit watch mode.
› Press Enter to trigger a test run.
// 还有一个a模式，在非jest --watchAll下将会列出来
› Press a to run all tests.
```

- f 模式：接下来只对之前没通过测试的用例进行测试(重新测试失败的用例)
- o 模式：接下来只对当前修改过的测试文件进行测试(需要有git支持初始化仓库并且提交，`jest --watch`将会自动进入o模式)
- p 模式：接下来只对指定测试文件进行测试(输入匹配的文件名字符串，将会使用正则匹配对应的文件)
- t 模式：接下来只对指定测试用例进行测试(需输入用例描述，将会使用正则匹配对应的用例描述)
- q 模式：退出监视模式
- a 模式：测试所有用例
- Enter ：继续测试

## 异步测试

- jest测试时只会执行同步代码，而不会去等待异步的回调测试，如果把测试结果写在异步回调内，则需要使用done来等待异步测试得结果

```js
// fetch.js
import axios from 'axios'

export function fetch(cb) {
  axios.get('https://baidu.com/').then((res) => {
    cb(res.status)
  })
}

// fetch.test.js
import { fetch } from './fetch'

test('fetch 异步测试', () => {
  fetch((status) => {
    // 不管结果是否正确都会通过测试
    // 这是由于这个异步回调在测试得时候没有被调用，测试用例默认通过了测试
    expect(status).toBe(300)
  })
})
```

上面这个测试用例，把测试代码写在了请求回调中，由于执行测试得时候是没有等待异步回调得结果，而是执行了fetch之后就返回了，默认通过测试

- 如果需要等待异步回调就需要在异步中调用done，这样测试用例才会知道什么时候测试才算结束

```js
// fetch.test.js
import { fetch } from './fetch'

test('fetch 异步测试', (done) => {
  fetch((status) => {
    expect(status).toBe(300)
    // 当异步执行回调时才会执行done，这样jest才会知道什么时候这个测试才算结束
    done()  // 如果一直没执行done，则测试将会超时，并且不会通过测试
  })
})
```

使用jest提供的done函数，在调用done之后jest才确定测试结束，这样就能测试异步代码了

- 如果expect测试的时候报错了，那么后面的done将不会执行，为了解决这个问题，我们需要使用try... catch来捕获expect中的错误，而在catch中调用done

```js
test('fetch 异步测试', (done) => {
  fetch((status) => {
    try {
      expect(status).toBe(300)
      done()
    } catch (error) {
      done(error)
    }
  })
})
```

- 如果不使用回调函数，而是返回一个Promise，那么将需要把Promise返回出去

```js
// fetch.js
import axios from 'axios'

export function fetch() {
  return axios.get('https://baidu.com/')
}

// fetch.test.js
import { fetch } from './fetch'

test('fetch 异步测试', () => {
  fetch().then((res) => {
    expect(res.status).toBe(300)
  })
})
```

- 如果不把fetch的结果return出去，那么在执行then之前测试就已经结束了，就是默认通过，这时就需要使用return来返回fetch在执行then之后的结果

```js

test('fetch 异步测试', () => {
  return fetch().then((res) => {
    expect(res.status).toBe(300)
  })
})
```

- 如果请求返回的是一个错误，那么我们将使用catch来测试错误结果，但是如果返回的是一个正确的结果那么将不会测试错误，这时我们就需要使用断言来确保测试语句必须执行一次，否则也是不通过

```js
test('fetch 异步测试', () => {
  expect.assertions(1) // 1次断言，确保下面的测试语句expect至少执行一次，否则不通过
  return fetch().catch((err) => {
    // 如果请求错误将会执行此测试语句，如果没有错误那么将不会执行，test也就默认通过测试
    expect(err).toMatch('404')
  })
})
```

使用`expect.assertions(1)`来设定断言次数测试，确保之后的测试语句至少需要执行指定次数，否则也算不通过测试

- 也可以使用`.resolve`匹配器来等待Promise的完成，使用`.reject`来等待Promise的错误

```js
test('fetch 异步测试', () => {
  return expect(fetch()).resolve.toBe(300)
})

test('fetch 异步测试', () => {
  return expect(fetch()).reject.toMatch('404')
})
```

- 同样我们还能使用async、await

```js
// 测试接收结果
test('fetch 异步测试', async () => {
  const { status } = await fetch()
  expect(status).toBe(300)
})

// 测试错误结果
test('fetch 异步测试', async () => {
  expect.assertions(1)
  try {
    await fetch()
  } catch (error) {
    expect(error).toBe('404')
  }
})
```

当然也可以使用`.resolve`与`.reject`匹配器

```js
test('fetch 异步测试', async () => {
  await expect(fetch()).resolve.toBe(300)
})

test('fetch 异步测试', async () => {
  await expect(fetch()).reject.toMatch('404)
})
```

jest中异步测试几个重点：

1. 使用异步回调测试
   1. 使用异步回调的测试，需要在回调中执行jest提供的done函数，这样jest才会知道什么时候结束测试，否则将不会执行异步回调中的测试
   2. 测试错误的异步回调需要写在try...catch并且调用done
2. 使用异步Promise测试
   1. 在then中对返回的数据进行测试，并且需要return整个Promise
   2. 在catch中测试错误请求，并且需要返回，以及使用`expect.assertions(1)`，来确保至少测试过1次
3. 使用async、await测试
   1. 使用async来装饰测试回调函数，并且使用await代替then来接收返回的结果，之后再进行测试，这里不需要return
   2. 测试错误时，也需要使用try...catch来捕获错误，并且再catch中测试错误，同样。如果也只测试错误那么也需要断言
4. Promise和async、await都能使用`.resolve`和`.reject`来代替then和catch处理

## 钩子函数

- jest提供4个钩子函数，对应测试的不同时机执行

1. beforeAll：在所有测试用例执行之前执行回调
2. afterAll：在所有测试用例执行之后执行回调
3. beforeEach：在每个测试用例执行之前执行回调
4. afterEach：在每个测试用例执行之后执行回调

beforeAll钩子

```js
let i
beforeAll(() => {
  console.log('所有用例执行前执行')
  i = 0 // 初始化数据
})

test('toEqual 匹配器', () => {
  expect(i).toEqual(0) // 测试通过
})

test('toEqual 匹配器', () => {
  expect(i).not.toEqual(1) // 测试通过
})
```

afterAll钩子

```js
let i= 0
afterAll(() => {
  console.log('所有用例执行后执行')
  i = 0 // 恢复数据
})

test('toEqual 匹配器', () => {
  i++
  expect(i).toEqual(1) // 测试通过
})

test('toEqual 匹配器', () => {
  expect(i).not.toEqual(0) // 测试通过
})
```

beforeEach钩子

```js
let i= 0
beforeEach(() => {
  console.log('每个用例执行前执行')
  i = 0 // 初始每个用例数据
})

test('toEqual 匹配器', () => {
  i++
  expect(i).toEqual(1) // 测试通过
})

test('toEqual 匹配器', () => {
  expect(i).toEqual(0) // 测试通过
})
```

afterEach钩子

```js
let i= 0
afterEach(() => {
  console.log('每个用例执行前执行')
  i = 0 // 恢复每个用例数据
})

test('toEqual 匹配器', () => {
  i++
  expect(i).toEqual(1) // 测试通过
})

test('toEqual 匹配器', () => {
  expect(i).toEqual(1) // 测试通过
})
```

四个钩子一起使用的情况

```js
let i
beforeAll(() => {
  console.log('所有用例执行前执行')
  i = 1
})
afterAll(() => {
  console.log('所有用例执行后执行')
  i = null
})
beforeEach(() => {
  console.log('每个用例执行前执行')
  i = 1
})
afterEach(() => {
  console.log('每个用例执行后执行')
  i = 0
})
test('toEqual 匹配器', () => {
  console.log('测试用例1')
  i = i * 5
  expect(i).toEqual(5) // 测试通过
})

test('toEqual 匹配器', () => {
  console.log('测试用例2')
  i = i * 3
  expect(i).toEqual(3) // 测试通过
})
// 所有用例执行前执行
// 每个用例执行前执行
// 测试用例1
// 每个用例执行后执行
// 每个用例执行前执行
// 测试用例2
// 每个用例执行后执行
// 所有用例执行后执行
```

这些钩子也都能使用done或者returnPromise来进行异步测试

All钩子是一次性执行的，Each钩子是每个测试用例都会执行

- 这些钩子也是有自己的测试作用域，父钩子优先子钩子执行，不同作用域下的钩子互不干扰执行
- 这里我们先介绍一个describe描述块，describe是一部分测试的块集合，可以把一系列相关的测试放在一个describe中
- 每个describe的钩子是互不干扰的，但是父describe中的钩子对子describe生效

describe测试块

```js
describe('这是一个测试块', () => {
  test('toEqual 匹配器', () => {
    expect(3).toEqual(3) // 测试通过
  })
})

describe('这是另一个测试块', () => {
  test('toEqual 匹配器', () => {
    expect(5).toEqual(5) // 测试通过
  })
})
```

每个describe都可以像test那样写自己的块描述，以及回调函数

每个describe中的钩子函数互不干扰执行
父子describe中的钩子函数，优先执行父级钩子

看个官方例子

```js
beforeAll(() => console.log('1 - beforeAll'))
afterAll(() => console.log('1 - afterAll'))
beforeEach(() => console.log('1 - beforeEach'))
afterEach(() => console.log('1 - afterEach'))
test('', () => console.log('1 - test'))
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'))
  afterAll(() => console.log('2 - afterAll'))
  beforeEach(() => console.log('2 - beforeEach'))
  afterEach(() => console.log('2 - afterEach'))
  test('', () => console.log('2 - test'))
})
// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```

从这里不难看出执行顺序：

钩子顺序：beforeAll、beforeEach、test、afterEach、afterAll

父子钩子顺序：

1. 测试任务test按代码先后顺序执行
2. 父级beforeAll优先于子级beforeAll
3. 父级beforeEach优先于子级beforeEach
4. 子级afterEach优先于父级afterEach
5. 子级afterAll优先于父级afterAll

这样看来jest的钩子函数执行顺序类似vue的生命周期钩子

- 对于describe和test的执行顺序

```js
describe('describe1', () => {
  console.log('describe1')
  test('', () => console.log('1 - test'))
  describe('describe2', () => {
    console.log('describe2')
    test('', () => console.log('2 - test'))
  })
})
// describe1
// describe2
// 1 - test
// 2 - test
```

jest在执行测试文件时，会优先去执行所有的describe的回调，之后再执行各个describe中的test任务

describe与test执行顺序：

1. 所有describe按照从上到下，从外到内执行
2. 所有describe中的test任务也是按照从上到下，从外到内执行(这跟其所处的describe执行顺序有关)

- 如果只想单独执行一个test，那么可以调用only方法来执行

```js
test.only('', () => console.log('1 - test'))
test('', () => console.log('2 - test'))
// 1 - test
```

这样就只会测试调用了only的用例，而其他用例将会被跳过

## mock函数

- 使用mock函数允许你测试代码之间的连接，可以去除实际函数的内部实现，只要对mock函数执行了调用，那么jest就会捕获这些调用信息，以便测试

```js
// demo.js
function foo(cb) {
  cb()
}

export { foo }

// demo.test.js
import { foo } from './demo'

test('mock', () => {
  const cb = jest.fn() // 创建mock函数
  foo(cb) // 把mock函数作为回调，传入需要测试的函数中
  expect(cb).toBeCalled() // 测试mock函数调用情况
})
```

使用`jest.fn()`来创建mock函数，如果mock函数被调用了，那么jest可以跟踪其调用的情况，这样就能追溯到需要测试的函数，而不需要改变测试函数内部实现，简单说就是用了个jest的mock跟踪函数来记录测试函数的调用情况

```js
test('mock', () => {
  const cb = jest.fn()
  foo(cb)
  console.log(cb.mock)
})
// 这是mock追踪的调用信息
// {
//   calls: [ [] ],
//   instances: [ undefined ],
//   invocationCallOrder: [ 1 ],
//   results: [ { type: 'return', value: undefined } ]
// }
```

mock函数都有一个`.mock`属性，其包含以下子属性：

- calls：调用次数、传参情况，包括调用次数和每次调用传入的参数
- instances：调用时，mock函数的this指向
- invocationCallOrder：书写顺序与调用顺序
- results：每次调用的返回值情况

calls 属性

```js
// demo.js
let i = 0
function foo(cb) {
  cb(i++)
}

// demo.test.js
test('mock', () => {
  const cb = jest.fn()
  foo(cb)
  foo(cb)
  console.log(cb.mock.calls) // [ [ 0 ], [ 1 ] ],2次调用传入的参数分别是0，1
  expect(cb.mock.calls.length).toBe(2)
  // expect(cb).toBeCalledWith(0) // 判断每次返回是否都是0
})
```

instances 属性

```js
// demo.js
function foo(Class) {
  new Class()
}

// demo.test.js
test('mock', () => {
  const cb = jest.fn()
  foo(cb)
  console.log(cb.mock.instances) // [ mockConstructor {} ],this指向cb构造函数
})
```

invocationCallOrder 属性

```js
// demo.test.js
test('mock', () => {
  const cb = jest.fn()
  foo(cb)
  foo(cb)
  foo(cb)
  // 传入cb的顺序与执行cb函数时的顺序，可以看出他们是顺序执行的
  console.log(cb.mock.invocationCallOrder) // [ 1, 2, 3 ]
})
```

results 属性

```js
// demo.test.js
test('mock', () => {
  const cb = jest.fn(() => {
    // 实现mock的内部逻辑，每次执行mock函数都返回111
    return 111
  })
  foo(cb)
  foo(cb)
  // 可以看到mock函数在执行时的返回值情况
  console.log(cb.mock.results) // [ { type: 'return', value: 111 }, { type: 'return', value: 111 } ]
})
```

- 创建mock时还可以实现mock内部逻辑，以便于我们测试

```js
const cb = jest.fn(() => {
  // 实现mock的内部逻辑
  return 111
})

// 等价于
const cb = jest.fn()
cb.mockImplementation(() => {
  // 实现mock的内部逻辑
  return 111
})

// 也可以使其只返回一次
const cb = jest.fn()
cb.mockImplementationOnce(() => {
  // 实现mock的内部逻辑
  return 111
})

// 返回this
myMock.mockReturnThis()
// 等价于
const cb = jest.fn()
cb.mockImplementation(() => {
  // 实现mock的内部逻辑
  return this
})
```

在创建mock函数的时候传入回调函数，那么mock将会执行这个函数，而这个函数jest会跟踪其调用信息

- mock函数也可以在测试期间将测试值注入代码，比如指定每个调用的返回值

```js
const myMock = jest.fn()

// 指定mock一次返回值1，指定mock一次返回值'hh'，指定mock回值false
// 可链式调用
myMock.mockReturnValueOnce(1).mockReturnValueOnce('hh').mockReturnValue(false)

console.log(myMock())
console.log(myMock())
console.log(myMock())


```

mock模拟模块

- 当我们测试网络请求模块时，也许会使用真实请求网络，但是也许诸多因素，导致我们无法真实请求接口，那么jest就提供了模拟axios网络请求模块，使我们可以不必发起真正的请求，却能够进行测试
- mock可以改变函数的内部实现，从而改写axios模块中的请求

```js
// demo.js
import axios from 'axios'
function foo() { // 测试的函数需要发起网络请求
  return axios.get('http://www.baidu.com')
}

export { foo }

// demo.test.js
import { foo } from './demo'
import axios from 'axios'
jest.mock('axios')  // 使用mock模拟axios内部实现

test('mock', () => {
  // 此时axios可以使用mock方法，模拟返回数据
  axios.get.mockReturnValue({ data: 'hi' })
  const res = await foo()
  expect(res.data).toEqual('hi')  // 测试数据
})
```

mock也可以自定义mock测试文件来模拟实际测试

- 创建`__mocks__`文件夹，并且创建与需要被测试的文件一样的文件
- 在`__mocks__`中的测试文件，模拟实际实现细节，之后通过`jest.mock(实际文件)`模拟文件，这样一来mock就会去`__mocks__`下找对应的模拟文件，如果没有才会再去找实际测试文件

```js
// __mocks__/demo.js   mock模拟被测试文件
function foo() {
  // 模拟返回数据
  return Promise.resolve({ data: '(function a(){ return 11 })()' })
}
export { foo }

// demo.test.js
jest.mock('./demo.js')  // 使用mock来模拟被测试的文件，这样就会去__mocks__中找模拟的测试文件
import { foo } from './demo'  // 导入测试文件时会先去找有无模拟的文件，如果有则使用模拟文件中的函数

test('mock', async () => {
  const { data } = await foo()  // 这里的foo是mock模拟文件中的foo，而不是真实被测试文件中的foo
  expect(eval(data)).toBe(11)
})
```

使用`jest.mock('./demo.js')`模拟被测试的文件，这样可以通过模拟实现请求返回，对其他需要请求数据的模块来说可以不用考虑实际网络请求的测试

- 使用`jest.unmock(文件)`不模拟文件
- 在`jest.config.js`配置文件中设置`automock: true`(修改配置需要重新启动jest)这样就会自动模拟`__mocks__`中的所有模拟测试文件，而不会去测试实际中的文件
- 也可直接使用`jest.mock('./demo',()=>{})`以回调形式传入具体实现，那么就可以不需要创建`__mocks__`，这种方式适合模拟实现代码量少的情况

当你编写的模拟文件中，并没有所有被测试文件的全部实现，那么，你可能只需要模拟部分测试代码，而其余代码还是使用真实文件来测试，那么需要使用`jest.requireActual(真实测试文件)`导入需要测试的内容

```js
jest.mock('./demo.js')  // 使用mock来模拟被测试的文件，这样就会去__mocks__中找模拟的测试文件
import { foo } from './demo'  // 导入测试文件时会先去找有无模拟的文件，如果有则使用模拟文件中的函数
const { bar } = jest.requireActual('./demo') // 需要真实测试文件中的bar

test('mock foo', async () => {
  const { data } = await foo()  // 这里的foo是mock模拟文件中的foo，而不是真实被测试文件中的foo
  expect(eval(data)).toBe(11)
})

test('mock bar', () => {
  expect(bar()).toBe('bar')
})
```

这样一来不仅可以针对性的使用模拟测试文件，还能使用真实测试文件，可以根据需求来编写模拟文件内容以替换真实测试文件中的部分功能

- jest还能模拟类，对实际文件中的类以及方法进行mock化，使其函数都成为`jest.fn()`，这样一来jest都能追踪到这些函数的调用信息

```js
// class.js
export default class Data {
  init() {
    // 复杂逻辑
  }
}

// demo.js
import Data from './class'
const foo = function () {
  const data = new Data()
  data.init()
}
export default foo

// demo.test.js
jest.mock('./class')  // 模拟class中的类，使其函数可被jest追踪，相当于把每个函数都mock化
import Data from './class'
import foo from './demo'

test('mock bar', () => {
  foo()
  console.log(Data.mock)
  expect(Data).toHaveBeenCalled() // 测试调用情况
})

// {
//   calls: [ [] ],
//   instances: [ Data { init: [Function] } ],
//   invocationCallOrder: [ 1 ],
//   results: [ { type: 'return', value: undefined } ]
// }
```

- 对单个模块进行的测试，称为单元测试
  
一般情况单元测试只针对一个模块进行测试，优点是测试速度快，可以忽略具体实现，使用mock方式来达到快速测试的目的，比如只对class模块进行mock测试，不涉及其他模块

- 对多个模块集中进行的测试，称为集成测试

集成测试，会涉及多个模块，测试中，需要依赖其他模块进行测试，可以测试模块与模块之间的协调关系

mock具有以下功能

1. 捕获函数的调用和返回结果，以及this和调用顺序
2. 它可以让我们自由的设置返回结果
3. 改函数的内部实现

## snapshot

- snapshot就是快照，可以记录测试文件当前的代码，当下次再测试时就会，把当前代码于之前产生的快照对比，如果相同则说明没有修改通过测试，反之将会提示改动情况
- snapshot一般用于测试配置文件，对于改动，我们可以很快的查出不同，进而确认修改，还可更新快照以便下次测试

```js
// .config.js
export default () => ({
  entry: './index.js'
  output: {
    filename: 'index.js'
    path: './dist'
  }
})

// .config.test.js
import config from './.config.js'

test('snapshot', () => {
  // 当没有快照时，将会生成__snapshots__文件夹，并且存放测试产生的xxx.js.snap快照文件，在下次快照测试时就通过对比新旧快照内容来判断文件的改动情况
  expect(config()).toMatchSnapshot()
})
```

当我修改了配置文件之后，再次测试

```js{7}
// .config.js
export default () => ({
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: './dist',
    publicPath: './',
  },
})
//   Object {
//     "entry": "./index.js",
//     "output": Object {
//       "filename": "index.js",
//       "path": "./dist",
// +     "publicPath": "./",
//     },
//   }
```

他将会提示增删情况，我们可以自行决定是否要更新快照，需要更新则在测试命令之后添加`-u`选项即可更新快照

如果使用的是watch监视模式则只需要按照提示`Press u to update failing snapshots.`输入u即可更新快照

- 当测试多个配置文件时，如果多个配置文件都更新了，但是我们只针对其中一个配置文件做新旧替换，而其他不变，那么就不能直接使用u来更新快照，因为那样会导致全部快照都更新
- 当我们只需要更新部分快照时可以在watch模式下按按照提示`Press i to update failing snapshots interactively.`进入i交换模式，这样我们就可以根据需求更新每个配置文件的快照了

```js
import config from './.config.js'
import config1 from './.config1.js'

test('config', () => {
  expect(config()).toMatchSnapshot()
})

test('config1', () => {
  expect(config1()).toMatchSnapshot()
})

// 进入i之后会重新测试，并且出现Press u to update failing snapshots for this test. 用于确认当前快照测试是否更新
```

如果多个快照都更新了，可以先进入i模式，再根据需求按u来更新当前快照，当然也可以按s跳过更新，直到所有改动的快照都经过交互处理，之后会提示此次更新情况`2 snapshots reviewed, 2 snapshots updated`（2个快照都更新了）

对于ui组件使用snapshot也是一种不错的选择

- 当快照内容在每次测试时候都是变的，那么用之前的方式肯定不会通过测试
- jest提供给我们一种方式来对快照中指定的内容做数据匹配，只要满足此类型的数据就能通过测试

```js
// .config.js
export default () => ({
  date: new Date() // 每次测试的数据都会改变
})

// .config.test.js
import config from './.config.js'

test('config', () => {
  expect(config()).toMatchSnapshot({
    // 使配置文件中的date属性满足任何date类型数据即可通过测试
    date: expect.any(Date)  // 传入指定类型匹配的数据
  })
})
```

`expect.any(Date)`匹配任意Date类型数据即可，还有匹配任意数据类型`expect.any(Number)`等等

- 使用Inline行内快照，将不会生成单独的快照文件
- 行内快照将会追加在`toMatchInlineSnapshot`参数中
- 使用行内快照的前提是安装`yarn add prettier`格式化工具，因为生成的行内快照是使用模板字符串保留空格回车的

```js
// config.js
export default () => ({
  date: new Date(),
  name: 'tom',
})

// config.test.js
test('config', () => {
  expect(config()).toMatchInlineSnapshot(
    {
      date: expect.any(Date),
    },
    // 行内快照
    `
    Object {
      "date": Any<Date>,
      "name": "tom",
    }
  `
  )
})
```

## 定时器模拟

- 由于测试代码中少不了定时器相关的测试，那么如果一个定时器需要等待很久，难道也要跟着等待吗？不，jest中提供模拟定时器的功能，可以使用定时器立即执行，而不影响实际测试结果

```js
// demo.js
export default function (cb) {
  setTimeout(() => cb(), 1000)
}

// demo.test.js
import timer from './demo'

test('timer', (done) => {
  // 由于定时器是异步执行的所以需要使用done函数来告诉jest什么时候算测试结束
  timer(() => { // 等待1s执行
    expect(1).toBe(2)
    done()  
  })
})
```

使用done可以在异步回调之后再结束测试，但是有个问题，如果定时时间很长，那我们是不是就得等待那么久呢？

这里我们就需要模拟定时器

```js
import timer from './demo'
jest.useFakeTimers() // 使用模拟的timer

test('timer', () => {
  // 启动定时器
  timer(() => {
    expect(1).toBe(2) // 可以进行测试
  })
  // 执行所有的定时器
  jest.runAllTimers()
})
```

使用`jest.useFakeTimers()`来模拟所有的定时器，定时器都会被jest改变内部实现

通过`jest.runAllTimers()`运行所有的定时器，这样我们就可以省去等待的时间，从而直接测试定时器功能

- 但是对于嵌套定时器来说，`jest.runAllTimers()`会把所有的定时器都一并执行，而我们的需求是只执行第一层的定时器，也就是同步注册的定时器，那么就需要使用`jest.runOnlyPendingTimers()`只执行当前队列中的定时器，而不会执行之后被创建的定时器

```js
// demo.js
export default function (cb) {
  setTimeout(() => {
    setTimeout(() => cb(), 1000)
  }, 1000)
}
// demo.test.js
import timer from './demo'
jest.useFakeTimers() // 使用模拟的timer

test('timer', () => {
  // 启动定时器
  timer(() => {
    expect(1).toBe(2) // 这个嵌套定时器中的测试将不会被执行
  })
  // 执行队列中的定时器
  jest.runOnlyPendingTimers()
})
```

- jest还提供了一个定时器快进功能`jest.advanceTimersByTime(1000)`可以让定时器快进指定毫秒数，这样可以让我们测试固定延迟后的定时器

```js
jest.useFakeTimers() // 使用模拟的timer

// 快进1000ms，执行第一层定时器
test('timer', () => {
  // 启动定时器
  timer(() => {
    expect(1).toBe(2) // 这个嵌套定时器中的测试将不会被执行
  })
  // 快进定时器
  jest.advanceTimersByTime(1000)
})

// 快进2000ms，执行一、二层定时器
test('timer', () => {
  // 启动定时器
  timer(() => {
    expect(1).toBe(2) // 测试执行
  })
  // 快进定时器
  jest.advanceTimersByTime(2000)
})

// 快进叠加2000ms，执行一、二层定时器
test('timer', () => {
  // 启动定时器
  timer(() => {
    expect(1).toBe(2) // 测试执行
  })
  // 快进定时器
  jest.advanceTimersByTime(1000)
  // 快进时间可叠加
  jest.advanceTimersByTime(1000)
})
```

- 使用定时器快进时，每个测试之间的定时器快进将会受到影响，那么如果需要在每个测试之前重置定时器快进时间，则可以在beforeEach中重置定时器

```js
beforeEach(()=>{
  // 每执行一个任务前重置定时器
  jest.useFakeTimers()
})

test('timer1', () => {
  // 启动定时器
  timer(() => {
    expect(1).toBe(2) // 测试不执行
  })
  // 快进定时器
  jest.advanceTimersByTime(1000)
})

test('timer2', () => {
  // 启动定时器
  timer(() => {
    expect(1).toBe(2) // 测试执行
  })
  // 快进定时器
  jest.advanceTimersByTime(1000)
  // 快进时间可叠加
  jest.advanceTimersByTime(1000)
})
```

## jest测试DOM

- jest运行在node环境中，而jest可以对DOM操作进行模拟，原因是jest模拟了一套DOM操作，使其在node环境中也能测试DOM
- Jest附带了一个jsdom可模拟DOM环境的工具(需要jest在jsDOM环境下)

```js
// demo.js
const createDiv = function () {
  // 直接使用DOM
  const div = document.createElement('div')
  document.body.appendChild(div)
}
export default createDiv

// demo.test.js
import createDiv from './demo'
test('mock bar', () => {
  createDiv()
  createDiv()
  expect(document.body.querySelectorAll('div').length).toBe(2)
})
```

## TDD

- TDD(Test Driven Development)测试驱动的开发
- 先编写测试用例，根据测试用例编写代码使代码满足测试用例条件
- TDD开发流程：
  1. 编写测试用例
  2. 运行测试，测试用例无法通过测试
  3. 编写代码，使测试用例通过测试
  4. 优化代码，完成开发
  5. 重复上述步骤
- TDD开发的优势：
  1. 长期减少回归bug
  2. 代码质量更好(组织，可维护性)
  3. 测试覆盖率高
  4. 错误次数代码不容易出现

## BDD

- BDD(Behavior Driven Development)行为驱动开发
- 根据给定功能验收标准，对用户的行为进行模拟测试，来验证代码