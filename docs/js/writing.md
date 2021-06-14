# 手写实现

## 手写apply

```js
/* 手写apply */
/* 语法 func.apply(thisArg, [argsArray]) */
Function.prototype.myApply = function (thisArg, args) {
  const fn = Symbol()
  const result
  thisArg = Object(thisArg) || window
  thisArg[fn] = this
  if (!args) {
    result = thisArg[fn]()
  } else {
    if (!args[Symbol.iterator])
      throw new Error('params must be array or iterator')
    result = thisArg[fn](...args)
  }
  delete thisArg[fn]
  return result
}

/* 改进 */
Function.prototype.myApply = function (thisArg, args) {
  if (thisArg === null || thisArg === undefined) {
    thisArg = window
  } else {
    thisArg = Object(thisArg)
  }
  args = args || []
  const fn = Symbol()
  thisArg[fn] = this
  const result = thisArg[fn](...args)
  delete thisArg[fn]
  return result
}
```

分析思路：

1. apply属于函数的原型方法，所以调用apply的一定是函数才会有，可见apply中的this就是指向调用者(函数)
2. 由于此调用函数需要使用apply来绑定其他this，则需要传入指定调用的thisArg，通过传入的thisArg来调用函数，这样一来，执行函数时的this指向就改变了
3. 把当前this即当前函数，设置为thisArg的方法进行调用，这样一来函数的this指向就是他的调用者
4. 最后保存调用后的返回值，再删除临时给thisArg添加的函数
5. apply本身只接受一个数组或者是类数组的函数参数，这里要对参数进行判断，如果参数不能迭代则不能使用，我这里也允许参数为迭代器，这样才能使用...语法
6. 包装传入的thisArg，以保证thisArg为对象，这样才能添加属性

## 手写call

```js
/* 手写call */
/* 语法 function.call(thisArg, arg1, arg2, ...) */
Function.prototype.myCall = function (thisArg, ...args) {
  const fn = Symbol()
  thisArg = Object(thisArg) || window
  thisArg[fn] = this
  var result = thisArg[fn](...args)
  delete thisArg[fn]
  return result
}

/* 改进 */
Function.prototype.myCall = function (thisArg, ...args) {
  const fn = Symbol()
  if (thisArg === null || thisArg === undefined) {
    thisArg = window
  } else {
    thisArg = Object(thisArg)
  }
  thisArg[fn] = this
  const result = thisArg[fn](...args)
  delete thisArg[fn]
  return result
}
```

分析思路(类似apply)：

1. call属于函数的原型方法，所以调用call的一定是函数才会有，可见call中的this就是指向调用者(函数)
2. 由于此调用函数需要使用call来绑定其他this，则需要传入指定调用的thisArg，通过传入的thisArg来调用函数，这样一来，执行函数时的this指向就改变了
3. 把当前this即当前函数，设置为thisArg的方法进行调用，这样一来函数的this指向就是他的调用者
4. 最后保存调用后的返回值，再删除临时给thisArg添加的函数
5. call本身可接受多个函数参数使用剩余、展开语法导入参数即可，这里不需要对空参数进行判断
6. 包装传入的thisArg，以保证thisArg为对象，这样才能添加属性

## 手写bind

```js
/* 手写bind */
/* 语法 function.bind(thisArg[, arg1[, arg2[, ...]]]) */
Function.prototype.myBind = function (thisArg, ...args) {
  var thatFn = this
  return function Fn() {
    var isInstance = this instanceof Fn
    return isInstance ? new thatFn(...args, ...arguments) : thatFn.call(thisArg, ...args, ...arguments)
  }
}

/* 改进 */
Function.prototype.myBind = function (thisArg, ...args) {
  const thatFn = this
  const bound = function bound() {
    if (this instanceof bound && new.target === bound) {
      const result = thatFn.call(this, ...args, ...arguments) // new 调用
      return Object(result) === result ? result : this
    } else {
      return thatFn.call(thisArg, ...args, ...arguments) // 正常调用
    }
  }

  // 原型继承
  if (thatFn.prototype) {
    const Empty = function () {}
    Empty.prototype = thatFn.prototype
    bound.prototype = new Empty()
    Empty.prototype = null
  }

  return bound
}
```

分析思路：

1. bind方法给调用函数绑定一个thisArg，并且可以使用柯里化方式传递参数，最终返回一个绑定thisArg以及部分预处理参数
2. 新函数可以作为构造函数使用，当使用new时还是能够返回原构造函数实例
3. 普通函数使用时，this就指向thisArg

现在不推荐创建空白原型方法，继承和实例化都会产生额外的内存开销，并且使原型链更加庞大

## 手写防抖debounce

```js
/* 手写debounce */
function debounce(func, interval = 0, immediately = false) {
  var timeID = null
  return function () {
    var thisArg = this
    if (timeID) clearTimeout(timeID)
    if (immediately) {
      immediately = false
      return new Promise((resolve, reject) => {
        timeID = setTimeout(() => resolve(func.call(thisArg, ...arguments)))
      })
    } else {
      return new Promise((resolve, reject) => {
        timeID = setTimeout(
          () => resolve(func.call(thisArg, ...arguments)),
          interval
        )
      })
    }
  }
}

/* 简化版 */
function debounce(func, wait = 0) {
  let timerID = null
  return function () {
    if (timerID) clearTimeout(timerID)
    const executer = (resolve) => {
      timerID = setTimeout(() => {
        timerID = null
        resolve(func.call(this, ...arguments))
      }, wait)
    }
    return new Promise(executer)
  }
}
```

分析思路：

1. 防抖：防止在一段时间内多次执行函数，当超过给定延迟时间后才触发执行，否则重置计时
2. 如果在延迟时间之内又触发函数，那么将清除之前的定时器，重新开一个定时器计时
3. 简单理解，一段时间内的最后一次的函数调用有效
4. 如果有需要可以绑定触发函数的this以及参数、返回值、首次立即调用等

## 手写节流throttle

```js
/* 手写throttle */
function throttle(func, interval = 0, immediately = true) {
  var timeID = null
  return function () {
    if (timeID) return Promise.resolve()
    var thisArg = this
    if (immediately) {
      immediately = false
      return new Promise((resolve, reject) => {
        timeID = setTimeout(() => {
          resolve(func.call(thisArg, ...arguments))
          timeID = null
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        timeID = setTimeout(() => {
          resolve(func.call(thisArg, ...arguments))
          timeID = null
        }, interval)
      })
    }
  }
}

/* 简化版 */
function throttle(func, wait = 0) {
  let timerID = null, pending = null
  return function () {
    if (timerID) return pending
    const executer = (resolve) => {
      timerID = setTimeout(() => {
        timerID = null
        resolve(func.call(this, ...arguments))
      }, wait)
    }
    pending = new Promise(executer)
    return pending
  }
}
```

分析思路：

1. 节流：一段时间内只会执行一次函数调用，如果连续触发函数，那么将会直接返回，不会执行，等上一次定时器执行完成后才会重新开启新的定时器
2. 与防抖的区别在于:防抖多次触发会清除旧的，开启新的定时器；节流多次触发只会保留已经存在的定时器，等到定时器触发之后才会清除，如果当前没有存在的定时器id那么才会开启新定时器
3. 简单理解，一段时间内只有一次函数调用有效
4. 如果有需要可以绑定触发函数的this以及参数、返回值、首次立即调用等

## 手写new

```js
/* 手写new */
/* 语法 new constructor[([arguments])] */
function myNew(Fn, ...args) {
  const instance = Object.create(Fn.prototype)
  var result = Fn.call(instance, ...args)
  return result instanceof Object ? result : instance
}
```

分析思路：

1. 创建一个以构造函数的prototype为原型的对象实例
2. 正常调用构造函数，传入实例作为this指向
3. 如果构造函数返回对象类型，则代替实例对象返回，反之返回创建的实例对象

创建实例步骤：

1. 创建一个空的简单JavaScript对象（即{}）
2. 链接该对象（即设置该对象的构造函数）到另一个对象
3. 将步骤1新创建的对象作为this的上下文
4. 如果该函数没有返回对象，则返回this

## 手写instanceof

```js
/* 手写instanceof */
/* 语法 object instanceof constructor */
// 非标准
function myInstanceof(leftObj, rightFunc){
  if(leftObj.__proto__ === null) return false
  if(leftObj.__proto__ === rightFunc.prototype) return true
  return myInstanceof(leftObj.__proto__,rightFunc)
}
// 标准
function myInstanceof(leftObj, rightFunc){
  var prototype = Object.getPrototypeOf(leftObj)
  if(prototype === null) return false
  if(prototype === rightFunc.prototype) return true
  return myInstanceof(prototype,rightFunc)
}
```

分析思路：

1. 递归匹配`构造函数的prototype`与`对象原型`是否相等
2. 如果最终原型为null说明不在其原型链上
3. 不建议使用非标准的`leftObj.__proto__`来获取原型，推荐使用`Object.getPrototypeOf(leftObj)`获取原型
4. 对于输入的参数可以自行判断处理

## 手写reduce

```js
/* 手写reduce */
/* 语法 arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue]) */
// 简单版
Array.prototype.myReduce = function myReduce(cb, initialValue, thisArg = this) {
  var start = 0
  if (initialValue === undefined) {
    start = 1
    initialValue =  this[0]
  }
  for (var i = start; i < this.length; i++) {
    initialValue = cb.call(thisArg, initialValue, this[i], i, this)
  }
  return initialValue
}
// 递归版
Array.prototype.myReduce = function myReduce(cb, initialValue, thisArg = this, index = 0) {
  if (index >= thisArg.length) return initialValue
  if (initialValue === undefined) {
    index = 1
    initialValue = this[0]
  }
  initialValue = cb.call(thisArg, initialValue, this[index], index, this)
  return thisArg.myReduce(cb, initialValue, thisArg, ++index)
}
// 左右通用版
Array.prototype.myReduce = function myReduce(cb, initialValue, right = false, thisArg = this) {
  var start = 0
  if (initialValue === undefined) {
    start = 1
    initialValue = right ? this[this.length - 1] : this[0]
  }
  if(right){
    for (var i = this.length - 1 - start; i >= 0; i--) {
      initialValue = cb.call(thisArg, initialValue, this[i], i, this)
    }
  }else{
    for (var i = start; i < this.length; i++) {
      initialValue = cb.call(thisArg, initialValue, this[i], i, this)
    }
  }
  return initialValue
}
```

分析思路：

1. 对有初始值和无初始值的调用进行初始循环判断，如果有初始值则从索引为0开始循环，否则初始值为索引0的值，再从索引1开始循环
2. 每次循环给回调函数传入需要的参数，其中initialValue第一次为初始值，之后为每次回调的返回值
3. 有些情况下cb需要绑定其他this指向，但是在递归中需要绑定的是原循环的数组
4. 回调中也需要可以访问原数组，如果想要最原始的数组，即原始数组不受cb影响，那么需要深拷贝原来数组并且传入每次cb回调

## 手写splice

```js
/* 手写splice */
/* 语法 array.splice(start[, deleteCount[, item1[, item2[, ...]]]]) */
Array.prototype.mySplice = function mySpice(start = 0, deleteCount = this.length, ...args) {
  var length = this.length
  var rest = [], del = [], count = 0
  if (start >= length) start = length
  if (start <= -1) start = Math.abs(start) > Math.abs(length) ? 0 : length + start
  if (deleteCount >= length - start || deleteCount < 0) deleteCount = deleteCount < 0 ? 0 : length - start
  for (var i = start + deleteCount; i < length; i++) rest.push(this[i])
  for (var i = start; i < start + deleteCount; i++) del.push(this[i])
  for (var i = start; i < length - deleteCount + args.length; i++) this[i] = args[count] !== undefined ? args[count++] : rest[count++ - args.length]
  while (this.length > length - deleteCount + args.length) this.pop()
  return del
}
```

分析思路：

1. 根据参数范围进行参数初始化
2. 此方法会修改原数组，根据增删元素情况调整原数组长度，注意不能直接对this(原数组引用)进行修改，可以修改索引值，this相当于使用const定义的变量
3. 最后返回删除元素组成的数组

## 手写flatMap

```js
/* 手写flatMap */
/* 语法 var new_array = arr.flatMap(function callback(currentValue[, index[, array]]) {
    // return element for new_array
}[, thisArg]) */
Array.prototype.myFlatMap = function myFlatMap(cb, depth = 1, thisArg = this, result = []) {
  for (var i = 0; i < this.length; i++) {
    if ((this[i] instanceof Array) && depth) {
      myFlatMap.call(this[i], cb, depth - 1, thisArg, result)
    } else {
      result.push(cb ? cb.call(thisArg, this[i], i, this) : this[i])
    }
  }
  return result
}
```

分析思路：

1. 使用递归对嵌套数组进行扁平化，递归层数就是depth值，每递归一层depth-1，直到depth为0，则不需要进一步扁平化
2. 根据递归遍历当前数组，并且使用一个新数组按照迭代顺序push，如果有处理函数cb，则在push之前使用cb处理，把cb的返回值作为最终值push进新数组
3. 最后返回新数组，如果需要指定cb的this指向则可以使用call或者apply来绑定

## 手写indexOf

```js
/* 手写indexOf */
/* 语法 str.indexOf(searchValue [, fromIndex]) */
/* Sunday算法 */
String.prototype.myIndexOf = function myIndexOf(str, fromIndex = 0) {
  if (str === '') return 0
  if (str === null || str === undefined) return -1
  var sIndex = 0, pos = fromIndex, flag = false
  for (var i = fromIndex; i < this.length; i++) {
    if (str[sIndex] !== this[i]) {
      flag = false
      sIndex = 0
      while (this[pos + str.length] !== str[sIndex] && sIndex < str.length) {
        sIndex++
      }
      var index = sIndex >= str.length ? -1 : sIndex
      pos += str.length + (index === -1 ? 1 : -index)
      sIndex = 0
      i = pos - 1
    } else {
      flag = true
      sIndex++
    }
    if (sIndex >= str.length && flag) return pos >= this.length ? -1 : pos
  }
  return -1
}
```

分析思路：

1. 子串查找，使用Sunday算法进行查找，效率更高
2. 可以试试实现从后往前查找的情况

## 手写trim

```js
/* 手写trim */
/* 语法 str.trim() */
/* mode: 0 去两边空格, 1 去左边空格， 2 去右边空格*/
String.prototype.myTrim = function myTrim(mode = 0) {
  var result = '', index = mode <= 1 ? 0 : this.length - 1
  if (mode <= 1) {
    while (this[index++] === ' ');
    var l = --index,
      r = this.length - 1
    if (mode === 1) {
      while (index < this.length) result += this[index++]
    } else {
      while (this[r--] === ' ');
      while (index <= r + 1) result += this[index++]
    }
    return result
  } else {
    while (this[index--] === ' ');index++
    while (index >= 0) result += this[index--]
    return [...result].reverse().join('')
  }
}
/* 正则 */
String.prototype.myTrim = function myTrim(mode = 0) {
  switch (mode) {
    case 0: return this.replace(/^\s*|\s*$/g,'')
    case 1: return this.replace(/^\s*/g,'')
    case 2: return this.replace(/\s*$/g,'')
  }
}
```

分析思路：

1. 前后连续空格即为我们需要去除的，必须是从头部开始或者是从尾部开始的连续空格，中间的不算
2. 使用正则可以轻松处理

## 手写Promise

```js
/* 手写Promise */
/* 语法 new Promise( function(resolve, reject) {...} // executor  ); */
function MyPromise(executor) {
  this.PromiseState = 'pending'
  this.PromiseResult = undefined
  try {
    if (executor) executor(MyPromise.resolve.bind(this), MyPromise.reject.bind(this))
  } catch (error) {
    MyPromise.reject.bind(this, error)
  }
}
MyPromise.resolve = function (data) {
  var that = (this instanceof MyPromise || this.then) ? this : new MyPromise()
  if (that.PromiseState === 'pending') {
    that.PromiseState = 'fulfilled'
    that.PromiseResult = data
  }
  return that
}
MyPromise.reject = function (err) {
  var that = (this instanceof MyPromise || this.then) ? this : new MyPromise()
  if (that.PromiseState === 'pending') {
    that.PromiseState = 'rejected'
    that.PromiseResult = err
  }
  return that
}
MyPromise.prototype.then = function (resolve, error) {
  var newPromise = new MyPromise((res, rej) => {
    setTimeout(() => {
      if (this.PromiseState === 'fulfilled') {
        if (this.PromiseResult instanceof MyPromise) {
          res(resolve(this.PromiseResult.PromiseResult))
        } else {
          res(resolve(this.PromiseResult))
        }
      } else if (this.PromiseState === 'rejected') {
        if (this.PromiseResult instanceof MyPromise) {
          rej(error ? error(this.PromiseResult.PromiseResult) : this.PromiseResult.PromiseResult)
        } else {
          rej(error ? error(this.PromiseResult) : this.PromiseResult)
        }
      } else {
        if (this.PromiseResult instanceof MyPromise) {
          newPromise.PromiseResult = this.PromiseResult.PromiseResult
          newPromise.PromiseState = this.PromiseResult.PromiseState
        } else {
          newPromise.PromiseResult = this.PromiseResult
          newPromise.PromiseState = this.PromiseState
        }
      }
    })
  })
  return newPromise
}
MyPromise.prototype.catch = function (err) {
  if (this.PromiseState == 'pending') return this
  var newPromise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      if (this.PromiseState == 'rejected') {
        err(this.PromiseResult)
      } else {
        newPromise.PromiseResult = this.PromiseResult
      }
      resolve()
    })
  })
  return newPromise
}
MyPromise.prototype.finally = function (cb) {
  if (this.PromiseState == 'pending') return this
  var newPromise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      if (this.PromiseState == 'fulfilled') {
        resolve(this.PromiseResult)
      } else if (this.PromiseState == 'rejected') {
        reject(this.PromiseResult)
      }
      cb()
    })
  })
  return newPromise
}
```

分析思路：

1. 这是本人自己摸索出来的可能不太对，但是大多数与原生Promise契合，主要是在链式捕获那块不知道怎么catch
2. 这里只要明白，resolve和reject是用来改变当前promise的状态以及获取传入的参数作为promise的数据结果，真正异步的地方是在then方法中
3. resolve和reject是静态方法，then、catch、finally是原型方法
4. 由于在resolve和reject中改变了当前promise的状态，况且promise状态不可逆，所以在then的链式调用中需要做到几点
5. then中处理fulfilled和rejected的promise，并且根据传入then的数据进行判断处理，有可能是数据有可能是新的promise都要处理，最终then返回的是一个新的promise，状态为处理之后的promise，这里的处理取决于你对then中传入的参数以及返回值
6. 能够形成链式调用的前提是要返回promise实例

## 手写Promise/A+

花了2天时间学习`promise-polyfill`源码和另一种常规的Promise实现，结合二者根据自己的理解实现Promise

基于ES6的Promise/A+规范实现

```js
// 三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function isObjOrFunc(result) {
  return result && (typeof result === 'object' || typeof result === 'function')
}

// 模拟微任务队列
function _immediateFn(fn) {
  if (typeof setImmediate === 'function') {
    // nodejs环境下 setImmediate 模拟性能更高 
    setImmediate(fn)
  } else {
    setTimeout(fn, 0)
  }
}

// 错误抛出形式
function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    // 测试的时候需改为 console.warn
    console.error('Possible Unhandled MyPromise Rejection:', err)
  }
}

// 分析onFulfilled处理回调和onRejected处理回调的结果
function _resolvePromise(result) {
  const { newResolve, newReject, newPromise } = this
  // 不能重复返回自身
  if (newPromise === result) {
    return newReject(new TypeError('A promise cannot be resolved with itself'))
  }

  try {
    if (isObjOrFunc(result)) {
      const then = result.then
      // 返回的是MyPromise实例，则递归处理其结果
      if (result instanceof MyPromise) {
        result.then((res) => {
          _resolvePromise.call(this, res)
        }, newReject)
        return
      } else if (typeof then === 'function') {
        // 如果传入的是Thenable的对象，即具有then方法的对象，则把它的结果做为下一个promise的结果
        let called = false
        try {
          const resolve = (value) => {
            if (called || ((called = true), false)) return
            _resolvePromise.call(this, value)
          }
          const reject = (reason) => {
            if (called || ((called = true), false)) return
            newReject(reason)
          }
          then.call(result, resolve, reject)
        } catch (error) {
          if (called) return
          newReject(error)
        }
        return
      }
    }
  } catch (error) {
    // 出现错误，则下一个promise变成rejected
    newReject(error)
  }
  // 普通结果直接做为下一个promise的结果
  newResolve(result)
}

// pending状态调用then，则添加handler到队列中
function _handlePending(handler) {
  this._handlers.push(handler)
}

// 处理fulfilled状态
function _handleFulfilled(handler) {
  const { onFulfilled, newResolve, newReject } = handler
  // 没有fulfilled回调则链式传递到下一个promise
  if (onFulfilled === null) {
    newResolve(this['[[PromiseResult]]'])
    return
  }
  // 存在fulfilled回调则传入结果，并将onFulfilled的结果进一步分析处理
  try {
    const res = onFulfilled(this['[[PromiseResult]]'])
    _resolvePromise.call(handler, res)
  } catch (error) {
    newReject(error)
  }
}

// 处理rejected状态
function _handleRejected(handler) {
  const { onRejected, newReject } = handler
  // 没有onRejected回调则链式传递到下一个promise
  if (onRejected === null) {
    newReject(this['[[PromiseResult]]'])
    return
  }
  // 存在onRejected回调则传入结果，并将onRejected的结果进一步分析处理
  try {
    const res = onRejected(this['[[PromiseResult]]'])
    _resolvePromise.call(handler, res)
  } catch (error) {
    newReject(error)
  }
}

// 根据当前状态进行结果处理
function _handle(handler) {
  if (this['[[PromiseState]]'] === FULFILLED) {
    _handleFulfilled.call(this, handler)
  } else if (this['[[PromiseState]]'] === REJECTED) {
    _handleRejected.call(this, handler)
  }
}

// 生成resolve和reject
function _createHandler(state, cb) {
  return (result) => {
    _immediateFn(() => {
      if (this['[[PromiseState]]'] === PENDING) {
        // 改变状态
        this['[[PromiseState]]'] = state
        this['[[PromiseResult]]'] = result
        cb && cb(result)
        // 遍历pending状态下添加的所有handler，并根据当前状态执行fulfilled或者rejected操作
        this._handlers.forEach((handler) => _handle.call(this, handler))
        delete this._handlers
      }
    })
  }
}

// Handler类用于保存当前promise的处理回调和下一个promise的resolve和reject
class Handler {
  constructor(onFulfilled, onRejected, resolve, reject, newPromise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
    this.onRejected = typeof onRejected === 'function' ? onRejected : null
    this.newResolve = resolve
    this.newReject = reject
    this.newPromise = newPromise
  }
}

class MyPromise {
  constructor(executer) {
    if (!(this instanceof MyPromise)) {
      throw new TypeError('Promises must be constructed via new')
    }

    if (typeof executer !== 'function') {
      throw new TypeError('not a function')
    }

    this['[[PromiseState]]'] = PENDING
    this['[[PromiseResult]]'] = undefined
    this._handlers = []

    const resolve = _createHandler.call(this, FULFILLED)
    const reject = _createHandler.call(this, REJECTED, (reason) => {
      if (this._handlers.length === 0) {
        _unhandledRejectionFn(reason)
      }
    })

    try {
      executer(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    let handler
    // 创建新的promise，保持handler并返回
    const newPromise = new MyPromise((resolve, reject) => {
      handler = new Handler(onFulfilled, onRejected, resolve, reject)
    })
    handler.newPromise = newPromise
    if (this['[[PromiseState]]'] === PENDING) {
      // 同步执行，添加handler到队列中，等待之后resolve或者reject中进行回调处理
      _handlePending.call(this, handler)
    } else if (this['[[PromiseState]]'] === FULFILLED) {
      // 异步fulfilled处理结果
      _immediateFn(_handleFulfilled.bind(this, handler))
    } else if (this['[[PromiseState]]'] === REJECTED) {
      // 异步rejected处理结果
      _immediateFn(_handleRejected.bind(this, handler))
    }
    return newPromise
  }
}
```

本实现已通过所有规范用例（只需实现then方法和构造函数即可测试）

Promise/A+规范不包括以下额外实现的接口，完整的Promise接口实现如下

```js
class MyPromise {
  constructor(executer) {
    if (!(this instanceof MyPromise)) {
      throw new TypeError('Promises must be constructed via new')
    }

    if (typeof executer !== 'function') {
      throw new TypeError('not a function')
    }

    this['[[PromiseState]]'] = PENDING
    this['[[PromiseResult]]'] = undefined
    this._handlers = []

    const resolve = _createHandler.call(this, FULFILLED)
    const reject = _createHandler.call(this, REJECTED, (reason) => {
      if (this._handlers.length === 0) {
        _unhandledRejectionFn(reason)
      }
    })

    try {
      executer(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    let handler
    const newPromise = new MyPromise((resolve, reject) => {
      handler = new Handler(onFulfilled, onRejected, resolve, reject)
    })
    handler.newPromise = newPromise
    if (this['[[PromiseState]]'] === PENDING) {
      _handlePending.call(this, handler)
    } else if (this['[[PromiseState]]'] === FULFILLED) {
      _immediateFn(_handleFulfilled.bind(this, handler))
    } else if (this['[[PromiseState]]'] === REJECTED) {
      _immediateFn(_handleRejected.bind(this, handler))
    }
    return newPromise
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(fn) {
    return this.then(
      function (value) {
        return MyPromise.resolve(fn()).then(function () {
          return value
        })
      },
      function (error) {
        return MyPromise.resolve(fn()).then(function () {
          return MyPromise.reject(error)
        })
      }
    )
  }

  static resolve(result) {
    if (result instanceof MyPromise) {
      return result
    }
    return new MyPromise(function (resolve) {
      resolve(result)
    })
  }

  static reject(reason) {
    return new MyPromise(function (resolve, reject) {
      reject(reason)
    })
  }

  static race(iterable) {
    return new MyPromise(function (resolve, reject) {
      if (typeof iterable[Symbol.iterator] !== 'function') {
        throw new TypeError('MyPromise.race accepts an iterable')
      }

      for (const value of iterable) {
        MyPromise.resolve(value).then(resolve, reject)
      }
    })
  }

  static all(iterable) {
    return new MyPromise(function (resolve, reject) {
      if (typeof iterable[Symbol.iterator] !== 'function') {
        throw new TypeError('MyPromise.all accepts an iterable')
      }

      const result = []
      let count = 0,
        iterator = iterable[Symbol.iterator]()
      for (let i = 0, res; (res = iterator.next()), res.done === false; i++) {
        count++
        MyPromise.resolve(res.value).then(function (value) {
          result[i] = value
          if (--count === 0) resolve(result)
        }, reject)
      }
    })
  }

  static allSettled(iterable) {
    return new MyPromise(function (resolve, reject) {
      if (typeof iterable[Symbol.iterator] !== 'function') {
        throw new TypeError('MyPromise.allSettled accepts an iterable')
      }

      const result = []
      let count = 0,
        iterator = iterable[Symbol.iterator]()
      for (let i = 0, res; (res = iterator.next()), res.done === false; i++) {
        count++
        MyPromise.resolve(res.value).then(
          function (value) {
            result[i] = { status: 'fulfilled', value: value }
            if (--count === 0) resolve(result)
          },
          function (reason) {
            result[i] = { status: 'rejected', reason: reason }
            if (--count === 0) resolve(result)
          }
        )
      }
    })
  }
}
```

官方测试工具`promises-aplus-tests`，下载安装后需要实现deferred静态方法

```js
/* ......省略其他代码 */

static deferred() {
  var result = {}
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

/* ......省略其他代码 */
/* 最后导出这个类 */
module.exports = MyPromise
```

测试指令`promises-aplus-tests 文件名`，目前有872个测试用例，全部通过则说明符合Promise/A+规范

[Promise参考文章](https://blog.csdn.net/dennis_jiang/article/details/105389519)

## 手写currying

```js
/* 手写currying */
/* 单参数柯里化 */
function currying(fn) {
  var args = []
  return function foo(arg) {
    args.push(arg)
    if (args.length >= fn.length) return fn.apply(this, args)
    return function (arg1) {
      args.push(arg1)
      return foo
    }
  }
/* 变种，可直接正常调用 */
function currying(fn) {
  return function foo(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      return function (...rest) {
        return foo.apply(this, [...args, ...rest])
      }
    }
  }
}
```

分析思路：

1. 普通柯里化，每次调用只传一个参数并且闭包保存已有参数个数，当参数个数与被柯里化的函数形参个数相等时调用原来函数并传参
2. 可传多个参数的柯里化，这里把单参数改成可变参数，这样一次可以传递多个参数，只要满足累计传入的参数达到原函数形参个数则执行原函数
3. 柯里化的函数必须是固定形参个数的，柯里化不改变函数调用，只是转化了函数传参的情况，把原本一次性传参改成多次传参，最终调用
4. 柯里化每次都返回一个函数，这个函数的实参个数逐渐接近原函数的形参个数，直到相等或者大于才调用原函数
5. 柯里化与偏函数还是有些区别的

## 手写partial

```js
/* 手写partial */
/* 偏函数 */
function partial(fn, ...args) {
  return function (...rest) {
    return fn.apply(this, [...args, ...rest])
  }
}
/* 例子 */
function isType(type, data) { // 通用类型判断
  return Object.prototype.toString.call(data) === `[object ${type}]`
}
var isArray = partial(isType, 'Array')  // 定制一个判断数组类型的函数
console.log(isArray([]))
```

分析思路：

1. 偏函数是提前固定原函数的部分参数，并且返回固定了部分参数值的偏函数，这样之后调用偏函数就无需再传那些固定的参数
2. 可以理解为把原函数包装成一个新函数，这个新函数的形参比原函数少，这是因为新函数设置了部分形参的默认值，以便之后直接调用
3. 当需要固定形参时可以使用偏函数，当需要改变传参形式时可以使用柯里化

## 手写Promise.all

```js
/* 手写Promise.all */
/* 语法 Promise.all(iterable) */
Promise.myAll = function (iterable) {
  let result = [], hasPromise = false, count = 0, index = 0
  return new Promise((resolve, reject) => {
    for (const value of iterable) {
      const pos = index++
      if (value instanceof Promise) {
        count++
        hasPromise = true
        value.then((data) => {
          result[pos] = data
          if(--count === 0) resolve(result)
        }, reject)
      } else {
        result[pos] = value
      }
    }
    if (!hasPromise) resolve(result)
  })
}
```

分析思路：

1. Promise.all是用来处理多个Promise返回的结果，如果有一个失败则返回这个失败，除非全部完成
2. 迭代迭代器参数时需要对每次迭代的值做判断，只有promise才需要调用then方法，其他值直接返回
3. 由于需要全部的promise完成才算完成，那么需要一个数组来记录已经完成的promise，当每个promise在执行完成回调时进行当前数组长度与最终长度做对比如果已经是最终长度，那么就resolve返回的promise，否则继续pending
4. 返回的数组存放的是按照迭代器迭代的顺序，所以这里需要一个局部变量来存放当前index，以便对号入座

## 手写Promise.race

```js
/* 手写Promise.race */
/* 语法 Promise.race(iterable) */
Promise.myRace = function (iterable) {
  return new Promise((resolve, reject) => {
    for (const value of iterable) {
      if (value instanceof Promise) {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    }
  })
}
```

分析思路：

1. Promise.race方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝
2. 当迭代到一个不是promise时，将会直接返回这个值，而不会继续迭代下去，毕竟是同步返回结果当然最快
3. 这里不需要像all那样统计完成的个数，每次调用then时，直接传入resolve和reject，这样一来只要第一个完成的promise都会直接改变返回的promise状态

## 手写WorkerPool

> 由于在红宝书中看到线程池调度的实现，写的很不错，记录下来理解原理

```js
/* 手写WorkerPool线程池 */
/* 线程池 */
class WorkerPool {
  constructor(poolSize, ...workerArgs) {
    this.taskQueue = []
    this.workers = []

    // 创建等量TaskWorker
    for (let i = 0; i < poolSize; ++i) {
      this.workers.push(
        new TaskWorker(() => this.dispatchIfAvailable(), ...workerArgs)
      )
    }
  }

  // 任务入队
  enqueue(...postMessageArgs) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ resolve, reject, postMessageArgs })

      this.dispatchIfAvailable()
    })
  }

  // 任务派发到空闲worker中
  dispatchIfAvailable() {
    // 无任务
    if (!this.taskQueue.length) {
      return
    }
    for (const worker of this.workers) {
      // 找到可用worker
      if (worker.available) {
        // 派发执行任务
        worker.dispatch(this.taskQueue.shift())
        break
      }
    }
  }

  // 关闭线程池
  close() {
    for (const worker of this.workers) {
      worker.terminate()
    }
  }
}

/* 任务线程 */
class TaskWorker extends Worker {
  constructor(notifyAvailable, ...workerArgs) {
    // 创建worker
    super(...workerArgs)

    // 初始化状态不可用
    this.available = false
    this.resolve = null
    this.reject = null

    // 派发下一个任务
    this.notifyAvailable = notifyAvailable

    // 监听TaskWorker准备完成，之后开始派发任务
    this.onmessage = () => this.setAvailable()
  }

  // 派发任务数据到worker
  dispatch({ resolve, reject, postMessageArgs }) {
    this.available = false

    // 重写接收
    this.onmessage = ({ data }) => {
      resolve(data)
      this.setAvailable()
    }

    // 设置error handler
    this.onerror = (e) => {
      reject(e)
      this.setAvailable()
    }

    // 发送数据体给TaskWorker，进行计算
    this.postMessage(...postMessageArgs)
  }

  // 释放，重置TaskWorker可用
  setAvailable() {
    this.available = true
    this.resolve = null
    this.reject = null

    // 派发下一个任务
    this.notifyAvailable()
  }
}
```

使用示例

`worker.js`

```js
// 接收计算数据
self.onmessage = ({ data }) => {
  let sum = 0
  let view = new Float32Array(data.arrayBuffer)
  for (let i = data.startIdx; i < data.endIdx; ++i) {
    sum += view[i]
  }

  // 计算完成
  self.postMessage(sum)
}

// 准备完成
self.postMessage('ready')
```

`index.js`计算浮点数累加和

```js
const totalFloats = 1e8
const numTasks = 20
const floatsPerTask = totalFloats / numTasks
const numWorkers = 4

const pool = new WorkerPool(numWorkers, './worker.js')

let arrayBuffer = new SharedArrayBuffer(4 * totalFloats)
let view = new Float32Array(arrayBuffer)

for (let i = 0; i < totalFloats; ++i) {
  view[i] = Math.random()
}

let partialSumPromises = []
for (let i = 0; i < totalFloats; i += floatsPerTask) {
  partialSumPromises.push(
    // 添加任务
    pool.enqueue({
      startIdx: i,
      endIdx: i + floatsPerTask,
      arrayBuffer: arrayBuffer,
    })
  )
}

// 等待任务全部执行完成
Promise.all(partialSumPromises)
  .then((partialSums) => partialSums.reduce((x, y) => x + y))
  .then((data) => {
    console.log(data)
    pool.close()
  })
```

分析思路：

1. WorkerPool用于创建线程池、管理计算任务入队、派发任务到下一个空闲worker、关闭线程池
2. TaskWorker用于创建任务线程实例、派发任务需要计算的数据到worker、释放worker并派发下一个任务
3. 通过pool.enqueue添加任务，等待所有worker并发执行并resolve后得到最终数据，最后将数据整合起来