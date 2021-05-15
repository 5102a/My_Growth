# 源码分析：Vue生命周期

此系列通过直接在vue源码中分析Vue的生命周期过程

> 以vue 2.6.11版本进行源码分析

## 调用new Vue()

- 源码中调用`new Vue()`时，内部直接调用原型上的`_init(options)`传入构造时的参数
- 对options进行合并后开始初始化实例

## beforeCreate

[源码位置](https://github.com/vuejs/vue/blob/dev/src/core/instance/init.js#L52-L55)

- **生命周期描述**：在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用

主要代码

```js
initLifecycle(vm) // 生命周期初始化
initEvents(vm)  // 事件初始化
initRender(vm)  // 渲染初始化
callHook(vm, 'beforeCreate')  // 调用beforeCreate
```

![beforeCreate](./img/35.png)

### initLifecycle

- 在这里主要初始化实例的几个内部属性如`$parent`、`$children`、`$root`、`$refs`以及其他内部使用的标志

```js
vm.$parent = parent
vm.$root = parent ? parent.$root : vm

vm.$children = []
vm.$refs = {}

vm._watcher = null
vm._inactive = null
vm._directInactive = false
vm._isMounted = false
vm._isDestroyed = false
vm._isBeingDestroyed = false
```

### initEvents

- 初始化实例的事件，将父组件中设置给子组件的事件，根据事件类型放入到子组件的`_events`对象中

```js
vm._events = Object.create(null)  // 创建字典对象作为实例事件存放对象
vm._hasHookEvent = false
// init parent attached events
const listeners = vm.$options._parentListeners
if (listeners) {
  updateComponentListeners(vm, listeners) // 更新实例的事件存放对象中的事件
}
```

### initRender

- 用于初始化内部`$slots`、`$scopedSlots`、`_c`、`$createElement`、`$attrs`、`$listeners`属性

```js
vm.$slots = resolveSlots(options._renderChildren, renderContext)
vm.$scopedSlots = emptyObject
// 内部用于创建元素
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
// 用于用户使用的render函数创建元素
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

...

// 对$attrs进行数据劫持
defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
// 对$listeners进行数据劫持
defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
```

## created

[源码位置](https://github.com/vuejs/vue/blob/dev/src/core/instance/init.js#L56-L59)

- **生命周期描述**：在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，`$el` property 目前尚不可用。

主要代码

```js
initInjections(vm) // 初始化Inject
initState(vm) // 初始化实例数据
initProvide(vm) // 初始化Provide
callHook(vm, 'created') // 调用created
```

![created](./img/36.png)

### initInjections

- 初始化inject属性

```js
// 处理inject相关数据
const result = resolveInject(vm.$options.inject, vm)
if (result) {
  toggleObserving(false)
  Object.keys(result).forEach(key => {
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      ...
    } else {
      defineReactive(vm, key, result[key])
    }
  })
  toggleObserving(true)
}
```

### initState

- 按顺序初始化实例`props`、`methods`、`data`、`computed`、`watch`属性，使其具有响应式

```js
if (opts.props) initProps(vm, opts.props)
if (opts.methods) initMethods(vm, opts.methods)
if (opts.data) {
  initData(vm)
} else {
  observe(vm._data = {}, true /* asRootData */)
}
if (opts.computed) initComputed(vm, opts.computed)
if (opts.watch && opts.watch !== nativeWatch) {
  initWatch(vm, opts.watch)
}
```

### initProvide

- 初始化实例`provide`属性，可以为函数

```js
const provide = vm.$options.provide
if (provide) {
  vm._provided = typeof provide === 'function'
    ? provide.call(vm)
    : provide
}
```

## beforeMount

[源码位置](https://github.com/vuejs/vue/blob/dev/src/core/instance/lifecycle.js#L146-L167)

- **生命周期描述**：在挂载开始之前被调用，之后相关的 `render` 函数首次被调用。

主要代码

```js
// 赋值到实例$el上
vm.$el = el
if (!vm.$options.render) {
  vm.$options.render = createEmptyVNode // 初始化render函数
  ...
}
callHook(vm, 'beforeMount') // 调用beforeMount
```

![beforeMount](./img/37.png)

### 如果存在el

- 如果已配置挂载的el元素，则直接调用`vm.$mount(vm.$options.el)`

```js
if (vm.$options.el) {
  vm.$mount(vm.$options.el)
}
```

### 如果不存在el

- 当未配置el时，将会在手动调用`vm.$mount(el)`时进行挂载

```js
new Vue({}).$mount('#app')
```

### 调用外部$mount

接着进入mount，判断是否有`options.render`参数如果有则获取el对应的真实dom，并赋值到`vm.$el`上，并未挂载数据。如果没有`options.render`则判断是否有`options.template`，如果有则解析，没有则使用`el.outerHTML`作为template，并解析成`render`和静态`staticRenderFns`渲染函数

```js
const options = this.$options
// resolve template/el and convert to render function
if (!options.render) {
  let template = options.template
  if (template) {
    // 字符串template
    if (typeof template === 'string') {
      ...
    } else if (template.nodeType) {
      // 真实dom
      template = template.innerHTML
    } else {
      ...
      return this
    }
  } else if (el) {
    template = getOuterHTML(el) // el外部HTML
  }
  if (template) {
    ...
    const { render, staticRenderFns } = compileToFunctions(template, {
      outputSourceRange: process.env.NODE_ENV !== 'production',
      shouldDecodeNewlines,
      shouldDecodeNewlinesForHref,
      delimiters: options.delimiters,
      comments: options.comments
    }, this)
    // 动态render函数
    options.render = render
    // 静态节点render函数
    options.staticRenderFns = staticRenderFns
  }
}
```

调用内部\$mount，获取el对应的真实dom赋值到`vm.$el`上

```js
// 获取el对应的真实dom
el = el && inBrowser ? query(el) : undefined

...

// 获取真实dom到实例$el上，并未挂载数据
vm.$el = el
if (!vm.$options.render) {
  vm.$options.render = createEmptyVNode // 初始化render函数
  ...
}
callHook(vm, 'beforeMount') // 调用beforeMount
```

## mounted

[源码位置](https://github.com/vuejs/vue/blob/dev/src/core/instance/lifecycle.js#L169-L211)

- **生命周期描述**：实例被挂载并首次渲染更新后调用，在调用前创建更新前回调，以及组件更新时的操作，在渲染时生成vnode并`__patch__`生成新的真实dom，挂载数据到`vm.$el`

主要代码

```js
let updateComponent
/* istanbul ignore if */
if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
  ...
} else {
  updateComponent = () => {
    // 创建vnode，并进行patch更新挂载
    vm._update(vm._render(), hydrating)
  }
}

// 实例化组件的观察者，并在触发更新时调用updateComponent进行重新更新，首次实例化时会先调用一次updateComponent进行渲染和挂载
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
hydrating = false

if (vm.$vnode == null) {
  vm._isMounted = true
  callHook(vm, 'mounted') // 调用mounted
}
```

![mounted](./img/38.png)

## beforeUpdate

[源码位置](https://github.com/vuejs/vue/blob/dev/src/core/instance/lifecycle.js#L197-L203)

- **生命周期描述**：数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。

主要代码

```js
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)

// watcher.update
update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync) {
    this.run()
  } else {
    // 执行观察者队列
    queueWatcher(this)
  }
}

// Flush both queues and run the watchers.
function flushSchedulerQueue () {
  ...
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    // 遍历执行每个watcher的before构造，触发beforeUpdate
    if (watcher.before) {
      watcher.before()
    }
    ...
  }
}
```

![beforeUpdate](./img/39.png)

## updated

[源码位置](https://github.com/vuejs/vue/blob/dev/src/core/observer/scheduler.js#L130-L139)

- **生命周期描述**：由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。该钩子在`flushSchedulerQueue`方法中被调用

主要代码

```js
function flushSchedulerQueue () {
  ...
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    watcher.run()
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)  // 执行activated队列钩子
  callUpdatedHooks(updatedQueue)  // 执行updated队列钩子
  ...
}

function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated') // 调用updated
    }
  }
}
```

![updated](./img/40.png)

## beforeDestroy

[源码位置](https://github.com/vuejs/vue/blob/dev/src/core/instance/lifecycle.js#L98-L102)

- **生命周期描述**：实例销毁之前调用。在这一步，实例仍然完全可用。

主要代码

```js
Vue.prototype.$destroy = function () {
  const vm: Component = this
  if (vm._isBeingDestroyed) {
    return
  }
  callHook(vm, 'beforeDestroy')
  ...
}
```

![beforeDestroy](./img/41.png)

## destroyed

[源码位置](https://github.com/vuejs/vue/blob/dev/src/core/instance/lifecycle.js#L103-L129)

- **生命周期描述**：实例销毁后调用。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。

主要代码

```js
Vue.prototype.$destroy = function () {
  ...
  vm._isBeingDestroyed = true
  // remove self from parent
  const parent = vm.$parent
  if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
    remove(parent.$children, vm)  // 从父节点中移除自身
  }
  // teardown watchers
  if (vm._watcher) {
    vm._watcher.teardown()  // 移除自身所有watcher
  }
  let i = vm._watchers.length
  while (i--) {
    vm._watchers[i].teardown()
  }
  // remove reference from data ob
  // frozen object may not have observer.
  if (vm._data.__ob__) {
    vm._data.__ob__.vmCount--
  }
  // call the last hook...
  vm._isDestroyed = true
  // invoke destroy hooks on current rendered tree
  vm.__patch__(vm._vnode, null) // 删除节点
  // fire destroyed hook
  callHook(vm, 'destroyed') // 调用destroyed
  // turn off all instance listeners.
  vm.$off() // 移除所有事件监听器
  // remove __vue__ reference
  if (vm.$el) {
    vm.$el.__vue__ = null
  }
  // release circular reference (#6759)
  if (vm.$vnode) {
    vm.$vnode.parent = null
  }
}
```

![destroyed](./img/42.png)

## 组件销毁

- 移除所有事件监听器、解除引用

```js
// turn off all instance listeners.
vm.$off() // 移除所有事件监听器
// remove __vue__ reference
if (vm.$el) {
  vm.$el.__vue__ = null
}
// release circular reference (#6759)
if (vm.$vnode) {
  vm.$vnode.parent = null
}
```

![destroyed](./img/43.png)

## 全过程

![all](./img/44.png)