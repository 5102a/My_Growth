
# JS设计模式

## 单例模式

- 单例模式的定义是：保证一个类仅有一个实例，并提供一个访问它的全局访问点。
- 单例模式的核心是确保**只有一个实例，并提供全局访问**。

静态方法获取单例

```js 通过静态方法获取单例
// 创建单例
const Singleton = function (name) {
  this.name = name
  this.instance = null
}
Singleton.prototype.getName = function () {
  return this.name
}
// 获取单例
Singleton.getInstance = function (name) {
  // 判断单例是否存在
  if (!this.instance) {
    this.instance = new Singleton(name)
  }
  return this.instance
}
console.log(Singleton.getInstance() === Singleton.getInstance()) // true
```

通过闭包创建单例模式

```js 闭包单例
//单例构造函数
const Singleton = function (name) {
  this.name = name
}
Singleton.prototype.getName = function () {
  return this.name
}
Singleton.getInstance = (function () {
  let instance = null
  return function (name) {
    if (!instance) {
      instance = new Singleton(name)
    }
    return instance
  }
})()
console.log(Singleton.getInstance('h') === Singleton.getInstance('hh'))
```

基于代理的单例模式

```js 代理单例
// 基于代理的单例模式
// 单例构造函数-只构造单例
function Singleton(element, html) {
  this.element = element
  this.html = html
  this.init()
}
Singleton.prototype.init = function () {
  const ele = document.createElement(this.element)
  ele.innerHTML = this.html
  document.body.appendChild(ele)
}
const proxySingletonCreateElement = (function () {
  let instance = null
  return function (element, html) {
    if (!instance) {
      instance = new Singleton(element, html)
    }
    return instance
  }
})()
const ele1 = new proxySingletonCreateElement('div', '5')
const ele2 = new proxySingletonCreateElement()
console.log(ele1 === ele2) //true
```

js终极单例模式

```js 单例模式
// js之单例模式
// 创建元素构造函数
const CreateElement = function (ele, fn) {
  const element = document.createElement(ele)
  element.name = ele // 用于识别单例标签
  element.style.display = 'none' // 默认隐藏
  fn(element)
  document.body.appendChild(element)
  return element
}
// 获取单例函数
const SingletonElement = function (create) {
  const instance = {} // 闭包保存每个标签单例
  return {
    createSingletonElement(ele = 'div', fn = function () {}) {
      // 如果同标签且创建过直接返回
      if (instance[ele] && instance[ele].name === ele)
        return instance[ele]
      // 不同标签或者没创建过，新建一个
      return (instance[ele] = new create(ele, fn))
    },
    getInstances() {
      return instance
    },
  }
}
// 创建构造单例模式函数
const SingletonCreate = SingletonElement(CreateElement)

/*
const div = SingletonCreate.createSingletonElement('div')
const div1 = SingletonCreate.createSingletonElement('div')
const span = SingletonCreate.createSingletonElement('span')
const span1 = SingletonCreate.createSingletonElement('span')
console.log(div === div1, span === span1, div === span) // true,true,false
console.log(SingletonCreate.getInstances())  
*/
document.querySelector('button').addEventListener('click', () => {
  const div = SingletonCreate.createSingletonElement('div', (e) => {
    console.log(e)
    e.innerHTML = '哈哈'
  })
  div.style.display = 'block'
})
```

个人理解

- 单例模式就是一个供全局访问的一个对象，且这个对象只有一个
- 通过实例化出来的这个对象要满足全局唯一且可以全局访问
- 比如整个项目只需要一个实例，弹窗不需要重复创建通过设置显示隐藏，缓存区不需要多个，一个就是包含全部的缓存数据

## 策略模式

- 策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

基于原型的策略模式，不变的算法实现与变化的输入数据分开

```js 基于原型的策略模式
//策略模式
// 定义不同等级算法
const Level1 = function () {}
Level1.prototype.compute = function (salary) {
  return salary * 2
}

const Level2 = function () {}
Level2.prototype.compute = function (salary) {
  return salary * 3
}

const Level3 = function () {}
Level3.prototype.compute = function (salary) {
  return salary * 4
}

const Level4 = function () {}
Level4.prototype.compute = function (salary) {
  return salary * 5
}

// 定义员工
const Staff = function () {
  this.salary = null
  this.level = null
}
// 设置每个员工的基础薪资
Staff.prototype.setSalary = function (salary) {
  this.salary = salary
}
// 设置每个员工的等级
Staff.prototype.setLevel = function (level) {
  this.level = level
}
// 获取员工的总工资
Staff.prototype.getTotalSalary = function () {
  return this.level.compute(this.salary)
}
const s1 = new Staff()
s1.setSalary(5000)
s1.setLevel(new Level1()) // 2
console.log(s1.getTotalSalary()) // 10000=5000*2

const s2 = new Staff()
s2.setSalary(6000)
s2.setLevel(new Level4()) // 5
console.log(s2.getTotalSalary()) // 30000=6000*5
```

js策略模式，输入的不同等级执行对应的算法，每个算法单独封装在一个集合里，通过输入执行对应算法

```js 策略模式
// 等级对应的薪资算法
const compute = {
  1(salary) {
    return salary * 2
  },
  2(salary) {
    return salary * 3
  },
  3(salary) {
    return salary * 4
  },
  4(salary) {
    return salary * 5
  },
}
// 计算总薪资
const totalSalary = function (salary, level) {
  return compute[level](salary)
}
console.log(totalSalary(5000, 1)) // 10000
console.log(totalSalary(6000, 4)) // 30000
```

基于js策略模式的表单验证

```js 表单验证
<form action="" method="POST" id="registerForm">
  <input type="text" name="username" />
  <input type="text" name="password" />
  <input type="text" name="phone" />
  <button type="submit">提交</button>
</form>
<script>
  // 'use strict'
  // 策略模式之表单验证
  // 实现专门用于验证的方法
  const test = {
    isNoEmpty(value, errMsg) { // 空
      if (value === '') return errMsg
    },
    isMobile(value, errMsg) { // 手机 
      if (!/^1[3|5|8][0-9]{9}$/g.test(value)) return errMsg
    },
    minLength(value, errMsg, length) { // 最小长度
      if (value.length < length) return errMsg
    }
  }
  // 实现一个验证类的函数,用于生成验证规则和验证
  const validateFunc = function (form) {
    // 实例化一个验证规则类
    const validator = new Validator()
    // 添加规则
    validator.add(form.username, [{
      rule: 'isNoEmpty',
      msg: '请输入用户名'
    }, {
      rule: 'minLength:6',
      msg: '用户名不得小于6位'
    }])
    validator.add(form.password, [{
      rule: 'minLength:6',
      msg: '密码不得小于6位'
    }])
    validator.add(form.phone, [{
      rule: 'isMobile',
      msg: '手机号无效'
    }])
    return validator.start() // 验证表单
  }

  // 实现验证规则Validator类
  function Validator() {
    this.rules = [] // 用于保存规则列表
  }
  // 添加规则
  /*
    *@args1 form字段标签
    *@args2 '调用的验证规则' 多个参数用','隔开,eg:'minLength:5,8'
    *@args3 '验证失败提示信息'
    */
  Validator.prototype.add = function (field, rules) {
    for (const ruleN of rules) {
      const args = ruleN.rule.split(':')
      // 压入具体验证方法
      this.rules.push(function () {
        // 具体用到的验证方法
        const ruleMethod = args.shift()
        let funcArgs = args.shift()
        // 拼接余参数
        if (funcArgs) {
          funcArgs = funcArgs.split(',')
          args.push(...funcArgs)
        }
        // 验证方法的参数1、2
        args.unshift(field.value, ruleN.msg)
        // 返回执行验证方法的结果
        return test[ruleMethod].apply(field, args)
      })
    }
  }
  // 表单验证
  Validator.prototype.start = function () {
    for (const ruleFunc of this.rules) {
      const msg = ruleFunc()
      if (msg) return msg
    }
  }
  // 表单事件
  const form = document.querySelector('#registerForm')
  form.onsubmit = function () {
    const msg = validateFunc(form)
    if (msg) {
      alert(msg)
      return false
    }
    alert('验证通过')
  }
</script>
```

个人理解

- 算法实现与应用分离，基于应用来选择算法，并非写死绑定
- 基于应用参数来自动选择对应实现，简单说具体实现的策略是由输入决定
- 策略类往往被函数所代替，这时策略模式就成为一种“隐形”的模式

## 代理模式

- 代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问
- 代理对象帮助本体对象过滤掉一些请求，这种代理叫作保护代理
- 一个开销大的请求，会在代理对象处理，代理对象会判断本体对象什么时候适合接受这个请求，就把请求给本体，这样效率就高了，这是代理模式的另一种形式，叫作虚拟代理
- 保护代理用于控制不同权限的对象对目标对象的访问，而虚拟代理是最常用的一种代理模式

代理模式之图片懒加载，分开写是为了遵循单一职责

```js 图片懒加载
// img标签
const loadImg = (function () {
  // 添加img标签到body，等需要加载src的时候调用方法设置src
  const img = document.createElement('img')
  document.body.appendChild(img)
  return {
    setSrc(src) { // 此方法为设置真正显示的图片
      img.src = src
    }
  }
})()
// 代理加载
const proxyLoadImg = (function () {
  // 实例化一个占位图片实例
  const img = new Image()
  // 加载完成时显示传入路径的图片
  img.onload = function () {
    // 这里的this指向img，刚开始的时候img.src为undefined
    // 不过由于是异步触发的事件，img.src = src都会先于这个事件触发
    // 所以this.src不会为空，除非不传入src
    loadImg.setSrc(this.src)
  }
  return {
    setSrc(src) {
      loadImg.setSrc('1.png') // 这是还未加载时候的占位图片
      img.src = src // 这里是加载完成后设置的图片路径
    }
  }
})()
proxyLoadImg.setSrc('2.png') // 设置加载完成后的图片
```

- 代理与本体对外接口应该保持一致，即代理的方法属性与本体一致，这样代理和本体可以互换，当哪天不需要代理就可以直接删除，本体上的接口与代理一样，直接兼容
- 如果代理对象和本体对象都为一个函数（函数也是对象），函数必然都能被执行，则可以认为它们也具有一致的“接口”

```js 定时发送文件列表
// 单次向服务器发送
const sendFile = function (id) {
  console.log('发送文件名：' + id)
}
// 代理发送
const proxySendFiles = (function () {
  // 存储发送id列表
  let ids = [],
    timer
  return function (id) {
    // 加入id列表
    ids.push(id)
    // 定时发送时间未到
    if (timer) return
    // 生成定时器
    timer = setTimeout(() => {
      // 2s向服务器发送一次文件列表ids
      sendFile(ids.join(','))
      clearTimeout(timer)
      // 清空定时器id，否则下次进不来
      timer = null
      // 清空列表ids
      ids.length = 0
    }, 2000)
  }
})()
// 点击一次进入一次代理发送
const btn = document.querySelector('button')
btn.onclick = function () {
  proxySendFiles(~~(Math.random() * 100))
}
```

缓存代理，通过代理实现判断缓存读取操作，挺实用，异步数据用回调

```js 缓存代理
const compute = function () {
  let sum = 1
  for (let i = 0; i < arguments.length; i++) {
    sum *= arguments[i]
  }
  return sum
}
const proxyCompute = (function () {
  const cache = {}
  return function () {
    const args = Array.from(arguments).join(',')
    for (const [key, value] of Object.entries(cache)) {
      if (key === args) {
        console.log('从缓存读取')
        return value
      }
    }
    cache[args] = compute(...arguments)
  }
})()
proxyCompute(1, 2, 3, 4)
proxyCompute(1, 2, 3, 6)
proxyCompute(1, 2, 3, 4) // 缓存读取
proxyCompute(1, 2, 3, 5)
proxyCompute(1, 2, 3, 6) // 缓存读取
```

缓存代理工厂，通过代理实现对不同函数的代理

```js 缓存代理工厂
// 缓存代理工厂函数
const compute1 = function () {
  let sum = 1
  for (let i = 0; i < arguments.length; i++) {
    sum *= arguments[i]
  }
  return sum
}
const compute2 = function () {
  let sum = 1
  for (let i = 0; i < arguments.length; i++) {
    sum += arguments[i]
  }
  return sum
}
const proxyComputeMethod = function (fn) {
  const cache = {}
  return function () {
    const args = Array.from(arguments).join()
    for (const [key, value] of Object.entries(cache)) {
      if (key === args) {
        console.log('读取缓存')
        return value
      }
    }
    cache[args] = fn(...arguments)
  }
}
const Mult = proxyComputeMethod(compute1)
Mult(2, 3, 5, 6)
Mult(2, 3, 5, 5)
Mult(2, 3, 5, 6) // 从缓存读取
Mult(2, 3, 5, 5) // 从缓存读取

const Plus = proxyComputeMethod(compute2)
Plus(2, 3, 5, 6)
Plus(2, 3, 5, 5)
Plus(2, 3, 5, 6) // 从缓存读取
Plus(2, 3, 5, 5) // 从缓存读取
```

个人理解

- 代理模式，可以通过代理对象/函数对外暴露本体接口，对本体的操作会先经过代理对象，通过代理对象对来访者进行处理之后在对本体操作
- 可以把代理对象当作一个保护公主的骑士，不让外人随便接触，都需要通过检验筛选最后才对本体操作

## 迭代器模式

- 迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示
- 内部迭代器：内部实现迭代元素，比如array的map，forEach等
- 外部迭代器，通过手动控制每次迭代，比较灵活，可以根据实际情况进行迭代操作，比如js中的迭代器对象，就可以通过next()进行一次迭代，比如generator生成器，每次调用生成器都会返回一个迭代对象，通过next()进行迭代操作

简单实现filter的内部迭代器

```js filter
// 内部迭代器
const filter = function (arr, fn, thisArg = arr) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const res = fn.call(thisArg, arr[i], i, arr)
    if (res) result.push(arr[i])
  }
  return result
}
const array = [5, 6, 8, 7, 9, 2]
const res = filter(array, (val) => {
  if (val > 5) return true
})
console.log(res) // [6,8,7,9]
```

外部迭代器

```js 外部迭代器
// 构造迭代器函数
const Iterator = function (obj) {
  const keys = Reflect.ownKeys(obj)
  const length = keys.length
  let current = 0
  // 一次迭代操作
  const next = function () {
    // 每次下移一个
    return obj[keys[current++]]
  }
  // 判断是否迭代完成
  const isDone = function () {
    if (current === length) return true
  }
  const getCurrent = function () {
    return obj[current]
  }
  return {
    next,
    isDone,
    getCurrent
  }
}
const obj = {
  name: 'jerry',
  age: 3
}
const iter1 = Iterator(obj)

console.log(iter1.next()) // jerry
console.log(iter1.next()) // 3
```

生成迭代器对象

```js 迭代器对象
// 实现对象的迭代
const createIterable = function (obj) {
  if (obj.hasOwnProperty(Symbol.iterator)) return obj[Symbol.iterator]
  obj[Symbol.iterator] = function () {
    const keys = Reflect.ownKeys(obj)
    const length = keys.length
    let current = 0
    return {
      [Symbol.iterator]() {
        return this
      },
      next() {
        return {
          value: keys[current],
          done: length === ++current
        }
      },
      value() {
        return keys[current]
      },
      isDone() {
        return length === current
      },
      current
    }
  }
  return obj
}

const obj = {
  name: 'tom',
  age: 5,
  like: 5
}
// 使对象可迭代
createIterable(obj)
// 对象本身无法迭代
for (const i of obj) {
  console.log(i)
}
// 手动迭代
// 生成迭代器
const iter = obj[Symbol.iterator]()
while (!iter.isDone()) {
  console.log(iter.value())
  console.log(iter.next())
}
```

迭代模式应用

```js 迭代模式应用
const func1 = function (arg) {
  if (typeof arg == 'string') {
    console.log('处理字符串 ' + arg)
    return true
  }
  return false
}
const func2 = function (arg) {
  if (typeof arg == 'number') {
    console.log('处理数字 ' + arg)
    return true
  }
  return false
}
const func3 = function (arg) {
  if (typeof arg == 'boolean') {
    console.log('处理布尔 ' + arg)
    return true
  }
  return false
}
const isFit = function () {
  const args = Array.from(arguments)
  const arg = args.shift()
  for (const func of args) {
    if (func(arg)) {
      console.log('找到处理程序')
      return true
    }
  }
  return false
}
console.log(isFit(5, func1, func2, func3))
```

个人理解

- 迭代器模式，就是通过迭代器来访问内部属性，不需要关心对象内部情况，只需要通过迭代器就能访问内部属性
- 大多数对象都具有内置迭代器，也可自定义迭代器，使其可被for..of迭代
- 迭代器的作用就是方便我们访问对象元素，不需要了解其内部构造，迭代器还可以控制其访问顺序

## 发布-订阅模式/观察者模式

- 发布—订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知
- 此模式就好比，一个主播，有很多关注的人，当主播发送开播通知的时候，每个关注的人都会收到通知
- DOM事件就是一个发布-订阅模式，我们手动添加的事件就是订阅，而当触发事件的时候就是发布。这样我们只需要注册事件，等到触发的时候执行回调即可
- 实现观察者模式：1 选好发布者， 2 给发布者添加一个缓存队列，用于存放订阅者的回调，3 发布者发布消息，遍历缓存队列执行每一个订阅者的回调函数，即通知订阅者

观察者模式之事件监听触发

```js 事件模式
// 定义发布者
const release = {}
// 订阅者队列
release.subscribeCache = []
// 注册监听
release.listen = function (eventName, callback) {
  // 添加对应事件的回调
  if (!this.subscribeCache[eventName]) {
    this.subscribeCache[eventName] = []
  }
  this.subscribeCache[eventName].push(callback)
}
release.trigger = function () {
  const key = Array.prototype.shift.call(arguments)
  // 取出对应事件的回调
  const fns = this.subscribeCache[key]
  if (!fns || !fns.length) return false
  for (const fn of fns) {
    // 通知
    fn.apply(this, arguments)
  }
}
release.listen('click', (e) => {
  console.log(e)
})
release.listen('move', (e) => {
  console.log(e)
})
release.trigger('click', '触发点击') // 触发点击
release.trigger('move', '触发移动') //触发移动
-------------------------------------------------
// 给对象添加事件工厂函数
const addEvent = function (obj) {
  for (const key in event) {
    // 添加事件属性，使其具有事件能力
    obj[key] = event[key]
  }
}
// 事件对象
const event = {
  subscribeCache: {},
  listen(eventName, callback) {
    // 添加对应事件的回调
    if (!this.subscribeCache[eventName]) {
      this.subscribeCache[eventName] = []
    }
    this.subscribeCache[eventName].push(callback)
  },
  trigger() {
    const key = Array.prototype.shift.call(arguments)
    // 取出对应事件的回调
    const fns = this.subscribeCache[key]
    if (!fns || !fns.length) return false
    for (const fn of fns) {
      fn.apply(this, arguments)
    }
  },
  remove(eventName, fn) {
    // 取对应事件的回调列表
    const fns = this.subscribeCache[eventName]
    // 回调列表为空直接返回
    if (!fns) return false
    // 没有回调说明取消此事件全部回调
    if (!fn) {
      fns.length = 0
    } else {
      if (fns.length === 1) {
        // 如果只有一个回调直接移除事件
        delete this.subscribeCache[eventName]
      } else {
        for (let i = 0; i < fns.length; i++) {
          // 删除对应的回调
          if (fn === fns[i]) {
            fns.splice(i, 1)
          }
        }
      }
    }
  }
}
const obj = {
  name: 'tom'
}
addEvent(obj)
obj.listen('click', (e) => {
  console.log(e)
})
obj.listen('move', (e) => {
  console.log(e)
})
obj.trigger('click', '触发点击') // 触发点击
obj.remove('click')
obj.trigger('click', '触发点击') // 不触发
obj.trigger('move', '触发移动') // 触发移动
obj.remove('move')
obj.trigger('move', '触发移动') // 不触发
-------------------------------------------------
// 构建一个全局事件对象，用来添加事件
const event = (function () {
  const subscribeCache = {}
  const listen = function (eventName, callback) {
    // 添加对应事件的回调
    if (!subscribeCache[eventName]) {
      subscribeCache[eventName] = []
    }
    subscribeCache[eventName].push(callback)
  }
  const trigger = function () {
    const key = Array.prototype.shift.call(arguments)
    // 取出对应事件的回调
    const fns = subscribeCache[key]
    if (!fns || !fns.length) return false
    for (const fn of fns) {
      fn.apply(this, arguments)
    }
  }
  const remove = function (eventName, fn) {
    // 取对应事件的回调列表
    const fns = subscribeCache[eventName]
    // 回调列表为空直接返回
    if (!fns) return false
    // 没有回调说明取消此事件全部回调
    if (!fn) {
      fns.length = 0
    } else {
      if (fns.length === 1) {
        // 如果只有一个回调直接移除事件
        delete subscribeCache[eventName]
      } else {
        for (let i = 0; i < fns.length; i++) {
          // 删除对应的回调
          if (fn === fns[i]) {
            fns.splice(i, 1)
          }
        }
      }
    }
  }
  // 对外暴露接口
  return {
    listen,
    remove,
    trigger
  }
})()
event.listen('click', (e) => {
  console.log(e)
})
event.listen('move', (e) => {
  console.log(e)
})
event.trigger('click', '触发点击') // 触发点击
event.remove('click')
event.trigger('click', '触发点击') // 不触发
event.trigger('move', '触发移动') // 触发移动
event.remove('move')
event.trigger('move', '触发移动') // 不触发
```

基于先发布后订阅以及使用命名空间来解决冲突和先发布后订阅

个人理解

- 发布订阅者模式，发布者通过订阅队列，当需要发布的时候通知订阅者，即调用订阅者之前注册的回调函数
- 先发布后订阅，也是类似代理模式的帮忙先缓存请求，等订阅来了一次性发布，这样就能解决异步问题

## 命令模式

- 命令模式中的命令（command）指的是一个执行某些特定事情的指令
- 命令模式最常见的应用场景是：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系

```js 命令模式
// 设置命令
const setCommand = function (ele, command) {
  // 给对应的元素添加点击事件
  ele.onclick = function () {
    // 事件内触发命令
    command.refresh()
  }
}
// 菜单对象
const menu = {
  refresh() {
    console.log('刷新菜单')
  }
}
// 封装命令
const RefreshCommand = function (menu) {
  // 返回命令对象，其中包含各种命令
  return {
    refresh() {
      // 执行刷新方法
      menu.refresh()
    }
  }
}
// 给button添加命令
const btn = document.querySelector('button')
// 关联命令
const btnCommand = RefreshCommand(menu)
// 标签关联命令
setCommand(btn, btnCommand)
// 点击按钮触发命令
```

通过命令执行动作

```js 动作命令
// 定义动作
const action = {
  attack() {
    console.log('攻击')
  },
  defense() {
    console.log('防御')
  },
  jump() {
    console.log('上跳')
  },
  crouch() {
    console.log('蹲下')
  }
}
// 按键对应的动作
const command = {
  115: 'jump',
  119: 'crouch',
  97: 'defense',
  100: 'attack'
}
// 创建命令
const makeCommand = function (action, method) {
  return function () {
    // 绑定动作
    action[method]()
  }
}
// 命令队列
const commandStack = []
document.onkeypress = function (e) {
  // 获取按键码
  const code = e.keyCode
  // 绑定动作
  const act = makeCommand(action, command[code])
  // 加入队列
  commandStack.push(act)
}
const btn = document.querySelector('button')
btn.addEventListener('click', () => {
  commandStack.forEach(act => act()) // w s a d=>执行上跳、下蹲、防御、攻击
  commandStack.length = 0
})
```

个人理解

- 通过命令队列这样可以营造出硬直等效果，命令模式可以通过宏命令来执行一批任务
- 通过命令执行需要的操作
- 在js中命令模式是一种隐形的模式，很多地方都使用到了命令模式，比如高阶函数

## 组合模式

- 事物是由相似的子事物构成
- 组合模式就是用小的子对象来构建更大的对象，而这些小的子对象本身也许是由更小的“孙对象”构成的
- 就类似套娃
- 组合模式将对象组合成树形结构，以表示“部分整体”的层次结构
- 组合模式最大的优点在于可以一致地对待组合对象和基本对象
- 比如扫描文件夹就类似一个组合模式，文件夹是一棵树型结构，文件是子节点，文件夹是非子节点，且文件只能添加在非子节点上，在文件夹上搜索文件，就会遍历整个文件夹包括子文件夹下的文件，直到找到文件
- 基本对象可以被组合成更复杂的组合对象，组合对象又可以被组合，这样不断递归下去，这棵树的结构可以支持任意多的复杂度，只需要调用最上层对象

扫描文件夹

```js 扫描文件夹
// 组合模式
// 实现文件夹类
const folder = function (name) {
  this.name = name
  this.files = []
}
folder.prototype.add = function (file) {
  // 给文件夹添加文件
  this.files.push(file)
}
folder.prototype.scan = function () {
  console.log(`扫描文件夹${this.name}`)
  this.files.forEach((file) => {
    file.scan()
  })
}
const file = function (name) {
  this.name = name
}
file.prototype.add = function () {
  throw new Error('不是文件夹')
}
file.prototype.scan = function () {
  console.log('扫描' + this.name + '文件');
}
const folder1 = new folder('文件夹1')
const folder2 = new folder('文件夹2')
const file1 = new file('文件1')
const file2 = new file('文件2')
folder1.add(file1)
folder1.add(folder2)
folder2.add(file2)
folder1.scan()
```

- 只需要扫描最顶层对象即可
- 组合对象把请求委托给它所包含的所有叶对象，它们能够合作的关键是拥有相同的接口
- 组合模式不是父子关系，每个下级对象都与上级对象接口相同，上级把任务委派给下级所有对象，对待下级对象的方式要一致

移除文件夹/文件

```js 文件移除操作
// 组合模式
// 实现文件夹类
const folder = function (name) {
  this.name = name
  this.files = []
  this.parent = null
}
folder.prototype.add = function (file) {
  // 给文件夹添加文件
  this.files.push(file)
  // 设置文件的上级
  file.parent = this
}
folder.prototype.remove = function () {
  // 顶级节点
  if (!this.parent) return
  // 父节点列表
  const files = this.parent.files
  for (let i = 0; i < files.length; i++) {
    // 移除
    if (files[i] === this) {
      files.splice(i, 1)
    }
  }
}
folder.prototype.scan = function () {
  console.log(`扫描文件夹${this.name}`)
  this.files.forEach((file) => {
    file.scan()
  })
}
const file = function (name) {
  this.parent = null
  this.name = name
}
file.prototype.add = function () {
  throw new Error('不是文件夹')
}
file.prototype.remove = function () {
  // 顶级文件
  if (!this.parent) return
  // 父节点列表
  const files = this.parent.files
  for (let i = 0; i < files.length; i++) {
    // 移除
    if (files[i] === this) {
      files.splice(i, 1)
    }
  }
}
file.prototype.scan = function () {
  console.log('扫描' + this.name + '文件');
}
const folder1 = new folder('文件夹1')
const folder2 = new folder('文件夹2')
const file1 = new file('文件1')
const file2 = new file('文件2')
const file3 = new file('文件3')
folder1.add(file1)
folder1.add(folder2)
folder2.add(file3)
folder2.add(file2)
folder2.remove()
file1.remove()
folder1.scan()
```

个人理解

- 组合模式可以用在对象是即使部分又表示整体，且顶级对象与子对象的接口相同，只需要操作顶级对象就可以统一对子对象操作
- 操作对象是不关心是叶子对象还是节点对象，只关心操作方式，只通过操作节点对象就能实现对叶子对象的操作，增加与删除也很方便
- 忽略组合对象与叶子对象的操作，因为他们是一致的

## 模板方法模式

- 模板方法模式是一种只需使用继承就可以实现的非常简单的模式
- 模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类
- 父类实现一些公共方法以及封装子类中所有方法的执行顺序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法
- 子类实现中的相同部分被上移到父类中，而将不同的部分留待子类来实现

模板方法模式

```js 模板方法模式
// 模板方法模式
// 定义一个抽象类
const Beverage = function () {}
// 公共方法
Beverage.prototype.boilWater = function () {
  console.log('煮水')
}
// 这些空方法由子类来实现
// 泡
Beverage.prototype.brew = function () {}
// 倒入杯子
Beverage.prototype.pourInCup = function () {}
// 加调料
Beverage.prototype.addCondiments = function () {}
// 初始化，规定顺序
// 该方法中封装了子类的算法框架，它作为一个算法的模板，指导子类以何种顺序去执行哪些方法
Beverage.prototype.init = function () {
  this.boilWater()
  this.brew()
  this.pourInCup()
  this.addCondiments()
}
const Coffee = function () {}
Coffee.prototype = new Beverage()
Coffee.prototype.brew = function () {
  console.log('泡')
}
Coffee.prototype.pourInCup = function () {
  console.log('倒入杯中')
}
Coffee.prototype.addCondiments = function () {
  console.log('添加调料')
}
const coffee = new Coffee()
coffee.init() // 煮水、泡、倒入杯中、添加调料
```

- 通过抽象类定义接口，公共方法可以直接实现即具体方法，非公共方法子类来实现，子类都要实现抽象类定义的方法
- 具体类可以实例化，抽象类不能，只能继承
- 通过鸭子类型来检测是否实现抽象类定义的方法，或者通过抽象类抛出异常来提示子类实现方法

增加钩子和判断是否实现子类方法

```js 模板方法模式
// 模板方法模式
// 定义一个抽象类
const Beverage = function () {}
// 公共方法
Beverage.prototype.boilWater = function () {
  console.log('煮水')
}
// 这些空方法由子类来实现
// 泡
Beverage.prototype.brew = function () {
  throw new Error('子类未实现此方法')
}
// 倒入杯子
Beverage.prototype.pourInCup = function () {
  throw new Error('子类未实现此方法')
}
// 加调料
Beverage.prototype.addCondiments = function () {
  throw new Error('子类未实现此方法')
}
// 添加钩子
Beverage.prototype.hook = function () {
  return true
}
// 初始化，规定顺序
// 该方法中封装了子类的算法框架，它作为一个算法的模板，指导子类以何种顺序去执行哪些方法
Beverage.prototype.init = function () {
  this.boilWater()
  this.brew()
  this.pourInCup()
  // 默认需要
  if (this.hook()) {
    this.addCondiments()
  }
}
const Coffee = function () {}
Coffee.prototype = new Beverage()
Coffee.prototype.brew = function () {
  console.log('泡')
}
Coffee.prototype.pourInCup = function () {
  console.log('倒入杯中')
}
Coffee.prototype.addCondiments = function () {
  console.log('添加调料')
}
Coffee.prototype.hook = function () {
  // 由用户决定
  return window.confirm( '请问需要调料吗？' );
}
const coffee = new Coffee()
coffee.init() // 煮水、泡、倒入杯中、添加调料
```

- 子类无需控制自己的方法执行，执行细节由父类来决定，即调用的是父类的init，子类只实现自己的方法即可，执行顺序等由父类来决定，这就是好莱坞原则
- 模板方法是基于继承实现的模式，其实也是基于js的对象委托来实现继承
- 模板方法模式是一种典型的通过封装变化提高系统扩展性的设计模式

个人理解

- 模板方法，通过抽象类定义一系列方法，如果方法的实现不涉及子类，那么可以在抽象类直接实现，如果需要子类自己来实现那么，就要子类自己实现
- 子类需要实现每个父类未实现的方法，子类具体的调用由父类来实现
- 通过增加子类来增加父类的功能，但是父类的对子类的方法执行没有改变

## 享元模式

- 享元flyweight模式是一种用于性能优化的模式
- 享元模式的核心是运用共享技术来有效支持大量细粒度的对象
- 享元模式的目标是尽量减少共享对象的数量，通过时间来换取空间

享元模式之模特拍照

```js 享元模式
// 享元模式
// 定义模特性别
const Model = function (sex) {
  this.sex = sex
}
// 照相
Model.prototype.takePhoto = function () {
  console.log('sex:' + this.sex + ' underwear=' + this.underwear)
}
const male = new Model('male'),
  female = new Model('female')
// 只需要2个模特，实现全部衣服的拍照
for (let i = 1; i <= 50; i++) {
  male.underwear = i
  female.underwear = i
  male.takePhoto()
  female.takePhoto()
}
```

- 享元模式要求将对象的属性划分为内部状态与外部状态（状态在这里通常指属性），
- 享元模式的目标是尽量减少共享对象的数量

- 内部状态存储于对象内部。
- 内部状态可以被一些对象共享。
- 内部状态独立于具体的场景，通常不会改变。
- 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。
- 我们便可以把所有内部状态相同的对象都指定为同一个共享的对象。而外部状态可以从对象身上剥离出来，并储存在外部

- 外部状态不由对象共享，由环境决定，内部状态相同的对象属于共享对象
- 在一个存在大量相似对象的系统中，享元模式可以很好地解决大量对象带来的性能问题

对象池，把每次不用的对象压入对象池，等要用的时候直接拿出来，不需要再创建

```js 对象池
// 创建对象池工厂函数
const objectPoolFactory = function (createObjFn) {
  // 保存的对象池
  const objPool = []
  return {
    create() {
      if (objPool.length) {
        console.log('对象池取对象' + (objPool.length))
      } else {
        console.log('创建对象')
      }
      // 如果对象池有对象就直接拿来使用，如果没有那么就创建一个对象
      return !objPool.length ? createObjFn.apply(this, arguments) : objPool.shift()
    },
    // 回收
    recover(obj) {
      objPool.push(obj)
      console.log('回收' + objPool.length)
    }
  }
}
const imgAct = objectPoolFactory(() => { // 构造对象方法
  const img = document.createElement('img')
  // 加载完回收
  img.onload = function () {
    img.onload = null
    // 回收
    imgAct.recover(./img)
  }
  document.body.appendChild(./img)
  return img
})
const img1 = imgAct.create()
img1.src = '1.png'
const img2 = imgAct.create()
img2.src = '2.png'
setTimeout(() => {
  const img3 = imgAct.create()
  img3.src = '3.png'
  const img4 = imgAct.create()
  img4.src = '4.png'
}, 1000)
```

如果在一个页面中需要创建1000个div，我们可以只创建10个div，当下拉的时候销毁被覆盖的div，然后加入到对象池，而新的div直接从对象池取出不需要重新创建

个人理解

- 在需要生成大量类似的对象时，会造成内存开销，且对象的内部属性相似度较高，外部状态可变，这样可以剥离对象的外部状态，只需要要用的时候创建对象，对象的内部状态是类似的，那么就可以借用之前的对象
- 比如需要创建几万个div时，我们不能真的创建那么多，可能就创建当前屏幕能显示的div或者多几个可以保证快速滑动的时候不至于白屏。那么其实只需要10来个div，每次显示的时候只需要改变内容即可，不需要重新创建div标签，这样可以提速不少性能，且与div数量无关

## 职责链模式

- 使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止
- 比如在公交车上，有很多人，如果一个从后门上车的人，只能把硬币传给前面的人帮忙传硬币，直到售票机为止，那么这个传递过程就是一个职责链，当这个链中有一个可以处理这个请求的的节点，那么就会被解决

职责链模式

```js 职责链模式
// 职责链模式
const order500 = function (orderType, pay, stock) {
  // 匹配类型
  if (orderType === 1 && pay === true) {
    console.log('500元定金，获得200元优惠券')
  } else {
    // 不匹配，交给下一个
    return 'next'
  }
}
const order200 = function (orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200元定金，获得50元优惠券')
  } else {
    return 'next'
  }
}
const orderNormal = function (orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买无优惠券')
  } else {
    console.log('库存不足')
  }
}
const Chain = function (fn) {
  // 创建定金实例
  this.fn = fn
  // 下一个交付
  this.successor = null
}
Chain.prototype.setSuccessor = function (order) {
  // 设置下一个
  return this.successor = order
}
Chain.prototype.request = function () {
  // 判断是否满足
  const res = this.fn.apply(this, arguments)
  // 不满足
  if (res === 'next') {
    return this.successor && this.successor.request.apply(this.successor, arguments)
  }
  // 满足
  return res
}
const od500 = new Chain(order500)
const od200 = new Chain(order200)
const odNormal = new Chain(orderNormal)
od500.setSuccessor(od200)
od200.setSuccessor(odNormal)
od500.request(2, true, 5)
od500.request(1, true, 2)
od500.request(1, false, 0)
```

个人理解

- 职责链模式，好比垃圾分类，垃圾到了传送带上，过好几个识别类型的机器，当垃圾对应机器识别的类型那么，垃圾就会被处理。
- 虽然可以很好的解耦，但是个人感觉效率还是低了，毕竟不是针对性处理，职责链类似一个过滤器，一个个筛选直到对的，这样浪费了不必要的传递过程，不过对于我们来说，只需要把请求抛给职责链就行了

## 中介者模式

- 面向对象设计鼓励将行为分布到各个对象中，把对象划分成更小的粒度，有助于增强对象的可复用性，但由于这些细粒度对象之间的联系激增，又有可能会反过来降低它们的可复用性
- 中介者模式的作用就是解除对象与对象之间的紧耦合关系
- 通过中介者对象来通信，就好比中控中心，在现实中类似翻译官的职位，中介模式也就是字面上的意思一样

中介模式之玩家分队玩法

```js 中介模式
// 中介模式
// 玩家
const player = function (name, color) {
  this.name = name
  this.state = 'live'
  this.teamColor = color
}
// 赢
player.prototype.win = function () {
  console.log(this.name + 'win')
}
// 输
player.prototype.lose = function () {
  console.log(this.name + 'lose')
}
// 死亡
player.prototype.die = function () {
  console.log(this.name + '死了！')
  this.state = 'die'
  // 通知中介者
  playerDirector.sendMessage('playerDead', this)
}
// 移除玩家
player.prototype.remove = function () {
  // 通知中介者
  playerDirector.sendMessage('removePlayer', this)
}
// 玩家换队
player.prototype.changeTeam = function (color) {
  // 通知中介者
  playerDirector.sendMessage('changeTeam', this, color)
}
// 玩家工厂函数
const PlayerFactory = function (name, color) {
  // 创建一个玩家
  const newPlayer = new player(name, color)
  // 通知中介者
  playerDirector.sendMessage('newPlayer', newPlayer)
  return newPlayer
}
// 中介对象
const playerDirector = (function () {
  // 玩家列表
  const players = {}
  // 中介操作
  const operations = {}
  // 中介者创建角色
  operations.newPlayer = function (player) {
    // 队伍
    const team = player.teamColor
    // 创建/取队伍
    players[team] = players[team] || []
    // 加入队伍
    players[team].push(player)
  }
  // 移除玩家
  operations.removePlayer = function (player) {
    const team = player.teamColor
    // 创建/取队伍
    players[team] = players[team] || []
    for (let i = 0; i < players[team].length; i++) {
      if (player === players[team][i]) {
        // 从队伍中移除
        players[team].splice(i, 1)
      }
    }
  }
  // 玩家换队
  operations.changeTeam = function (player, color) {
    // 移除原队伍
    operations.removePlayer(player)
    // 改变队伍
    player.teamColor = color
    // 加入队伍
    operations.newPlayer(player)
  }
  operations.playerDead = function (player) {
    // 取死亡玩家队伍颜色
    const team = player.teamColor
    // 取玩家所在队伍剩余玩家
    players[team] = players[team] || []
    let isLose = true
    for (let i = 0; i < players[team].length; i++) {
      if (players[team][i].state !== 'die') {
        // 未灭队
        isLose = false
        break
      }
    }
    // 灭队
    if (isLose) {
      for (let i = 0; i < players[team].length; i++) {
        players[team][i].lose()
      }
      for (const teams of Object.values(players)) {
        // 其他队伍赢
        if (teams !== players[team]) {
          teams.forEach((player) => player.win())
        }
      }
    }
  }
  // 接受通知，执行对应方法
  sendMessage = function () {
    // 取命令
    const args = Array.from(arguments)
    const command = args.shift()
    // 执行
    operations[command](...args)
  }
  // 暴露一个接口
  return {
    sendMessage
  }
})()
const player1 = new PlayerFactory('1号', 'red')
const player2 = new PlayerFactory('2号', 'red')
const player3 = new PlayerFactory('3号', 'red')
const player4 = new PlayerFactory('4号', 'blue')
const player5 = new PlayerFactory('5号', 'blue')
const player6 = new PlayerFactory('6号', 'blue')
player1.die()
player2.die()
player3.changeTeam('blue')
player3.die()
```

- 中介者模式是迎合迪米特法则的一种实现。迪米特法则也叫最少知识原则，是指一个对象应该尽可能少地了解另外的对象
- 也就是让对象间的关系尽量松弛，耦合度尽量小

个人理解

- 中介者模式，基于最少知识原则，保证对象与对象之间通过中介对象来传达消息，这样一来2个对象之间几乎没有耦合
- 通过中介者对象，可以保证一个对象改变后不会影响另一个对象，也就是解耦了，只通过通知中介对象来实现其他对象间的交互，当然这样一来中介对象可能会很庞大

## 装饰者模式

- 装饰者模式可以动态地给某个对象添加一些额外的职责，而不会影响从这个类中派生的其他对象
- 传统的给对象添加功能经常通过继承来实现，这样会导致父子对象耦合过高
- 给对象动态增加职责的方式称为装饰者模式，可以在不改动原对象的前提下增加职责，是一种即用即付方式

装饰者模式之飞机开火

```js 装饰者模式
// 装饰者模式
// 飞机
const Plane = function () {}
// 普通飞机开火
Plane.prototype.fire = function () {
  console.log('开火')
}
const MissileDecorator = function (plane) {
  // 装饰普通飞机
  this.plane = plane
}
MissileDecorator.prototype.fire = function () {
  // 普通子弹
  this.plane.fire()
  // 导弹
  console.log('导弹')
}
const AtomDecorator = function (plane) {
  // 装饰普通飞机
  this.plane = plane
}
AtomDecorator.prototype.fire = function () {
  // 普通子弹
  this.plane.fire()
  // 原子弹
  console.log('原子弹')
}
// 创建一个普通飞机
let plane = new Plane()
// 增加功能
plane = new MissileDecorator(plane)
plane = new AtomDecorator(plane)
plane.fire() // 开火、导弹、原子弹
```

- 装饰者也是包装器，通过嵌套对象，来实现增加额外功能，但是使用最外层功能的时候会依次传递对象链的所有对象，调用使用的功能，也就是每增加一层(包装)，就添加一些功能
- 装饰函数，在函数原有基础上增加功能，不改变原函数

通过保存函数的引用，覆盖原函数来达到给函数增加功能，如果保存的是有多级查询的引用会报错误，或者通过apply/call绑定this指向

装饰函数

```js 装饰函数
let a = function () {
  console.log(1)
}
const _a = a
a = function () {
  _a()
  console.log(2)
}
a()
```

基于AOP封装函数

```js 基于AOP封装函数
// 装饰调用前
Function.prototype.before = function (beforeFn) {
  // 这是原函数的引用,必须保存，只有第一次调用的时候是原函数
  const that = this
  return function () {
    // 原函数执行前
    beforeFn.apply(this, arguments)
    // 返回原函数执行结果，this由调用决定
    return that.apply(this, arguments)
  }
}
// 装饰调用后
Function.prototype.after = function (afterFn) {
  // 这是原函数的引用,必须保存，只有第一次调用的时候是原函数
  const that = this
  return function () {
    // 返回原函数执行结果，this由调用决定
    const res = that.apply(this, arguments)
    // 原韩执行后
    afterFn.apply(this, arguments)
    // 返回原函数结果
    return res
  }
}
const foo = function () {
  console.log('原函数')
}
const beforeFn = foo.before(() => {
  console.log('在函数foo执行前装饰的函数')
})
let afterFn = foo.after(() => {
  console.log('在函数foo执行后装饰的函数')
})
foo()
beforeFn()
afterFn()
```

- 还可在before中给原函数的参数添加属性等
- 也可以通过before提前校验表单，如果不通过就直接返回false不会进入原函数，这样可以省去原函数的处理，把验证和发送请求从原函数分离出来，before负责验证，原函数负责发送数据
- 装饰后的函数是新的函数，如果要覆盖原函数名，那么原来给函数增加的属性将会被覆盖
- 代理模式强调一种关系（Proxy 与它的实体之间的关系），这种关系可以静态的表达，也就是说，这种关系在一开始就可以被确定。而装饰者模式用于一开始不能确定对象的全部功能时
- 代理模式通常只有一层代理本体的引用，而装饰者模式经常会形成一条长长的装饰链
- 代理是一层关系，在一开始就确定行为，装饰是一条装饰链，在需要功能的时候装饰
- TS就很好的运用到了装饰者模式，我们可以按需添加功能，且原函数没有改变

个人理解

- 装饰者模式，有点类似组合模式，但是装饰模式可以选择覆盖原函数或者是生成新函数，可以在原函数的基础上增加功能，如果不覆盖那么既可以使用原函数，也能使用装饰过的函数，灵活性更强了
- 可以理解为，玩家添加装备，使自身的战斗力增强，也就意味着获得更多效果，不推荐覆盖原函数，使用新函数可以针对不同装饰级别来应用不同量级的装饰函数

## 状态模式

- 状态模式的关键是区分事物内部的状态，事物内部状态的改变往往会带来事物的行为改变
- 对象的内部属性改变时，引起外部事件变化
- 把对象的状态封装成一个类，每个类自己实现渲染，切换到这个状态就执行这个状态的方法

通过状态机改变灯的状态

```js 状态模式
// 状态模式
const Light = function () {
  this.state = 'off'
  // 控制灯的按钮
  this.button = null
}
// 初始化一个灯
Light.prototype.init = function () {
  const btn = document.createElement('button')
  const that = this
  btn.innerHTML = that.state
  // 添加事件
  btn.addEventListener('click', () => {
    // 改变状态
    that.changeState()
    btn.innerHTML = that.state
  })
  // 添加按钮
  document.body.appendChild(btn)
}
Light.prototype.changeState = function () {
  if (this.state === 'off') {
    this.state = 'on'
  } else {
    this.state = 'off'
  }
}
const light = new Light()
light.init()
```

通过封装状态类来切换状态，在状态类中已经定义好了规则

```js 状态模式
// 封装 3个状态类
// 关灯状态
const offLight = function (light) {
  this.light = light
}
offLight.prototype.init = function () {
  // 给最初的灯,设置状态
  console.log('关灯')
  this.light.setState(this.light.weakLight) //切换成弱光
}
const weakLight = function (light) {
  this.light = light
}
weakLight.prototype.init = function () {
  console.log('弱灯')
  // 给最初的灯,设置状态
  this.light.setState(this.light.StrongLight) //切换成强
}
const StrongLight = function (light) {
  this.light = light
}
StrongLight.prototype.init = function () {
  console.log('强灯')
  // 给最初的灯,设置状态
  this.light.setState(this.light.offLight) // 关灯
}
// 普通灯
const Light = function () {
  // 拥有多种状态
  // 实例化关灯状态
  this.offLight = new offLight(this)
  // 弱灯
  this.weakLight = new weakLight(this)
  // 强灯
  this.StrongLight = new StrongLight(this)
  this.button = null
}
Light.prototype.init = function () {
  const btn = document.createElement('button')
  const that = this
  // 初始状态
  that.currentState = this.offLight
  btn.innerHTML = that.state
  // 添加事件
  btn.addEventListener('click', () => {
    // 改变状态
    that.currentState.init()
  })
  // 添加按钮
  document.body.appendChild(btn)
}
Light.prototype.setState = function (state) {
  this.currentState = state
}
const light = new Light()
light.init()
```

- 状态模式：允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类
- 第一部分的意思是将状态封装成独立的类，并将请求委托给当前的状态对象，当对象的内部状态改变时，会带来不同的行为变化
- 第二部分是从客户的角度来看，我们使用的对象，在不同的状态下具有截然不同的行为，这个对象看起来是从不同的类中实例化而来的，实际上这是使用了委托的效果
- 如果对象的状态类没有实现，状态，那么应该继承一个抽象类，此类用于在没有实现状态的情况下将会报错警告
- 原始对象只拥有对象类，对象类拥有对象状态与行为，当原始对象切换状态时，状态类就执行行为改变原始对象的状态以及当前状态所要做的事情
- 策略模式和状态模式的相同点是，它们都有一个上下文、一些策略或者状态类，上下文把请求委托给这些类来执行
- 策略模式和状态模式的区别是策略模式中的各个策略类之间是平等又平行的，它们之间没有任何联系，所以客户必须熟知这些策略类的作用，以便客户可以随时主动切换算法
- 状态模式中，状态和状态对应的行为是早已被封装好的，状态之间的切换也早被规定完成，“改变行为”这件事情发生在状态模式内部

状态机

```js 状态机
const Light = function () {
  // 状态机
  this.currentState = FSM.off
  // 控制灯的按钮
  this.button = null
}
// 初始化一个灯
Light.prototype.init = function () {
  const btn = document.createElement('button')
  const that = this
  this.button = btn
  btn.innerHTML = '点我'
  // 添加事件
  btn.addEventListener('click', () => {
    // 通过状态类改变状态
    that.currentState.buttonWasPressed.call(that)
  })
  // 添加按钮
  document.body.appendChild(btn)
}
// 状态机
const FSM = {
  // 状态
  off: {
    //状态执行的行为
    buttonWasPressed: function () {
      console.log('关灯');
      this.button.innerHTML = '下一次按我是开灯';
      this.currentState = FSM.on;
    }
  },
  on: {
    buttonWasPressed: function () {
      console.log('开灯');
      this.button.innerHTML = '下一次按我是关灯';
      this.currentState = FSM.off;
    }
  }
}
const light = new Light()
light.init()
```

个人理解

- 给对象设置一个状态机，在状态机内设置多种状态，每个状态有自己的行为方式，当对象需要改变状态时直接调用状态对应的方法
- 通过状态机控制对应状态执行的行为，这样可以更有序的对不同状态执行方法

## 适配器模式

- 适配器模式的作用是解决两个软件实体间的接口不兼容的问题
- 适配器的别名是包装器
- 把不兼容的接口包装成兼容的接口，就是套个兼容的外套，在内部实现不兼容的代码，只需要接口兼容

适配器模式

```js 适配器模式
// 适配器模式
const googleMap = {
  show() {
    console.log('googleMap')
  }
}
const baiduMap = {
  show() {
    console.log('baiduMap')
  }
}
// 不兼容接口
const shouGouMap = {
  display() {
    console.log('shouGouMap')
  }
}
// 适配接口
const shouGouMapAdaptation = {
  show() {
    return shouGouMap.display()
  }
}
const renderMap = function (map) {
  if (map.show instanceof Function) {
    map.show()
  }
}
renderMap(googleMap)
renderMap(baiduMap)
renderMap(shouGouMapAdaptation) // 正常执行
```

- 如果接口不兼容，那么可以增加一个适配器，进行兼容实现，返回符合的接口

个人理解

- 通过包装不兼容的接口，把格式或者是调用方式，通过适配器转换成兼容的接口
- 比如polyfill也是使用这个原理，通过适配器向上兼容

## 设计原则

- 单一职责原则：SRP 原则体现为：一个对象（方法）只做一件事情，如果多个职责耦合在一起那么需要解耦，一个对象尽量只有一个引起变化，把对象颗粒化
- 最少知识原则：最少知识原则（LKP）说的是一个软件实体应当尽可能少地与其他实体发生相互作用。减少对象与对象间的关系，一个对象不影响另一个对象的操作
- 开放-封闭原则(OPC)：软件实体（类、模块、函数）等应该是可以扩展的，但是不可修改，一个接口尽量是可以扩展的，但不能是修改的，这样扩展性会更佳

## 总结

| 设计模式     | 描述                                                                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 单例模式     | 一个类仅一个实例，并提供一个访问它的全局访问点，通过判断是否已有实例                                                                                 |
| 策略模式     | 定义一系列方法，并且实现这些方法。实现与应用分离，通过应用来指定使用哪个实现                                                                         |
| 代理模式     | 一开始就定义了代理对象，与本体对象接口一致，通过代理对象，帮助本体处理一些请求，如果满足条件再给本体                                                 |
| 迭代器模式   | 通过迭代器，使外部能够访问对象内部元素，但是无法知道具体细节，通过迭代器来暴露内部的元素                                                             |
| 发布订阅模式 | 发布者定义订阅队列，把所有订阅者的回调加入队列，等到发布者发布通知的时候，会遍历所有的订阅回调队列一个个执行回调                                     |
| 命令模式     | 通过封装命令，可以不需要知道命令的执行细节，命令指的是执行某些特定事情的指令                                                                         |
| 组合模式     | 子叶对象与非子页对象的接口一致，通过嵌套关系，把请求发配给节点对象，那么它就会找到其对应的子叶对象执行方法，只有子叶可以执行方法                     |
| 模板方法模式 | 模板方法就类似抽象类，抽象类不能实例化，只能继承，子类必须实现抽象类定义的接口，抽象类可以实现子类相同的实现，但是执行顺序以及调用方式在抽象类中实现 |
| 享元模式     | 典型例子缓存对象池，可以把内部相同的属性当作共享对象，可以重复使用，不需要再创建，从而减少对象的创建，使用共享对象来节省开销                         |
| 职责链模式   | 请求从一个链节点进入，从一个个节点中判断是否为处理目标，如果是就处理，如果不是就往后传，直到最后处理到，或者结束                                     |
| 中介者模式   | 对象与对象之间没有关联，通过中介对象来实现多个对象之间的通信，从而实现对象与对象之间没有耦合度，但是会导致中介对象臃肿，中介者遵循最少知识原则       |
| 装饰者模式   | 通过包装对象或者函数，给原来函数增加功能，能够针对不同的需求增加函数或者对象的功能，更加灵活的使用装饰后的函数或者对象，即用即付                     |
| 状态模式     | 给对象增加一个状态机，状态机包含各种状态，每个状态实现不同的行为，通过切换不同的状态执行对应的方法，使得对象的行为由状态决定                         |
| 适配器模式   | 包装不兼容的接口返回兼容的接口，这样就能通过兼容接口内部使用不兼容的接口实现外部兼容                                                                 |

<Vssue title="设计模式 issue" />