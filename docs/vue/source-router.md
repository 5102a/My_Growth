# Vue Router3.x源码分析

此系列通过在Vue Router源码中分析底层原理

> 以Vue Router3.5.1版本进行源码分析

## Router路由器

- 通过`new VueRouter({})`实例化router对象，作为全局路由器，其中包含了处理导航的各种方法以及属性

```js
export default class VueRouter {
  constructor (options: RouterOptions = {}) {
    this.app = null
    this.apps = []
    this.options = options
    // 全局导航钩子
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []
    // matcher:{match,addRoute,getRoutes,addRoutes}
    // 创建匹配器，包含已经映射的路由和内置方法
    this.matcher = createMatcher(options.routes || [], this)

    // 默认hash模式
    let mode = options.mode || 'hash'
    // 不支持pushState的环境下是否回退到 hash 模式
    this.fallback =
      mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      // 回退hash
      mode = 'hash'
    }
    // 非浏览器 abstract
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    // 根据mode创建url导航实例
    switch (mode) {
      case 'history':
        // h5
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        // hash
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        // 其他
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }

  // 匹配当前路由对象
  match (raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {}

  // 获取当前路由对象
  get currentRoute (): ?Route {}

  // 在vm的beforeCreate阶段初始化router
  init (app: any /* Vue component instance */) {}

  // 注册全局导航钩子
  beforeEach (fn: Function): Function {
    return registerHook(this.beforeHooks, fn)
  }

  beforeResolve (fn: Function): Function {
    return registerHook(this.resolveHooks, fn)
  }

  afterEach (fn: Function): Function {
    return registerHook(this.afterHooks, fn)
  }

  // 导航准备完成
  onReady (cb: Function, errorCb?: Function) {}

  // 导航出错
  onError (errorCb: Function) {}

  // 处理浏览器导航记录
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        this.history.push(location, resolve, reject)
      })
    } else {
      this.history.push(location, onComplete, onAbort)
    }
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    // $flow-disable-line
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        this.history.replace(location, resolve, reject)
      })
    } else {
      this.history.replace(location, onComplete, onAbort)
    }
  }

  go (n: number) {
    this.history.go(n)
  }

  back () {
    this.go(-1)
  }

  forward () {
    this.go(1)
  }

  // 获取所有路由命中的组件
  getMatchedComponents (to?: RawLocation | Route): Array<any> {}

  // 解析出路由配置
  resolve (
    to: RawLocation,
    current?: Route,
    append?: boolean
  ): {
    location: Location,
    route: Route,
    href: string,
    // for backwards compat
    normalizedTo: Location,
    resolved: Route
  } {}

  // 获取所有路由配置
  getRoutes () {}

  // 添加路由含有父路由
  addRoute (parentOrRoute: string | RouteConfig, route?: RouteConfig) {}

  // 将弃用，使用addRoute代替
  addRoutes (routes: Array<RouteConfig>) {}
}
```

## Route路由对象

- 一个路由对象 (route object) 表示当前激活的路由的状态信息，包含了当前 URL 解析得到的信息，还有 URL 匹配到的路由记录 (route records)，只读

```js
export function createRoute (
  record: ?RouteRecord,
  location: Location,
  redirectedFrom?: ?Location,
  router?: VueRouter
): Route {
  const stringifyQuery = router && router.options.stringifyQuery

  let query: any = location.query || {}
  try {
    query = clone(query)
  } catch (e) {}

  // 路由对象
  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []  // 嵌套路由记录
  }
  // 如果存在重定向，即为重定向来源的路由的名字
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
  }
  // 冻结，不可配置。只读
  return Object.freeze(route)
}
```

## RouteRecord路由记录对象

- RouteRecord用于记录在路由表中配置的每项路由参数

```js
// 向路由map中添加路由记录建立映射关系
function addRouteRecord (
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>,
  route: RouteConfig,// 单项路由
  parent?: RouteRecord,
  matchAs?: string
) {
  // 解构路由path、name
  const { path, name } = route
  // path校验
  if (process.env.NODE_ENV !== 'production') {
    ...
  }

  // 正则表达式匹配路由， 编译正则的选项
  const pathToRegexpOptions: PathToRegexpOptions =
    route.pathToRegexpOptions || {}

  // 规范化path,去除多余// 为 /,或者去除 开头 /
  const normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict)

  // 是否 caseSensitive 区分大小写
  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive
  }

  // 路由记录
  const record: RouteRecord = {
    path: normalizedPath, // 规范化后的路径
    // 正则 根据正则规则解析路径参数，返回对象数组 
    // [{ name: 'bar', prefix: '/', suffix: '', pattern: '[^\\/#\\?]+?', modifier: '' }]
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    // 包装路由，可使用命名视图
    components: route.components || { default: route.component },
    // 路径别名，包装成数组，多个
    alias: route.alias
      ? typeof route.alias === 'string'
        ? [route.alias]
        : route.alias
      : [],
    instances: {},
    enteredCbs: {},
    name,
    parent,
    matchAs,
    // 重定向
    redirect: route.redirect,
    // 钩子beforeEnter
    beforeEnter: route.beforeEnter,
    // 路由元信息
    meta: route.meta || {},
    // 路由属性对象
    props:
      route.props == null
        ? {}
        : route.components
          ? route.props // 命名视图下的属性
          : { default: route.props }  // 单个路由直接用default指代
  }

  // 存在子路由
  if (route.children) {
    // 命名默认路由导航
    if (process.env.NODE_ENV !== 'production') {
      // 存在name、没有redirect、有子路由，且通过name导航则不会渲染子路由
      if (
        route.name &&
        !route.redirect &&
        route.children.some(child => /^\/?$/.test(child.path))
      ) {
        ...
      }
    }
    // 递归记录子路由
    route.children.forEach(child => {
      // 别名
      const childMatchAs = matchAs
        ? cleanPath(`${matchAs}/${child.path}`) // 规范化路径去//
        : undefined
      // 递归添加子路由记录到map中
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
    })
  }

  // 未记录，则记录路由
  if (!pathMap[record.path]) {
    pathList.push(record.path)  // 路由路径，顺序添加
    pathMap[record.path] = record // 路由记录添加映射
  }

  // 记录别名路由
  if (route.alias !== undefined) {
    const aliases = Array.isArray(route.alias) ? route.alias : [route.alias]
    // 遍历别名列表
    for (let i = 0; i < aliases.length; ++i) {
      const alias = aliases[i]
      // 别名与path相同，则警告
      if (process.env.NODE_ENV !== 'production' && alias === path) {
        // skip in dev to make it work
        continue
      }
      // 重新创建一个别名作为path路由，并且进行记录
      const aliasRoute = {
        path: alias,
        children: route.children
      }
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      )
    }
  }

  // 记录命名路由
  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      // 重复名称的路由配置
      ...
    }
  }
}
```

## 安装VueRouter

- 在`new VueRouter({})`前需要先安装VueRouter

```js
Vue.use(VueRouter)
```

- 执行`VueRouter.install`方法安装

```js
export function install (Vue) {
  // 避免重复安装
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  // 调用父级组件的 registerRouteInstance 注册路由
  const registerInstance = (vm, callVal) => {
    // 父级vnode
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      // 如果父级数据中存在 registerRouteInstance 则注册路由，即被RouterView包裹的组件将会被注册
      i(vm, callVal)
    }
  }

  // 在全局配置Vue.options中混入 路由的 beforeCreate 和 destroyed 用于注册和注销路由
  Vue.mixin({
    beforeCreate () {
      // 有定义路由
      if (isDef(this.$options.router)) {
        // 路由所属组件
        this._routerRoot = this
        this._router = this.$options.router
        // 路由初始化
        this._router.init(this)
        // 响应式设置vm._route 值为当url的route对象
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 未定义路由，使用父组件或者组件自身作为路由根组件
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      // 注册实例,即注册被RouterView包含的组件
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  // 挂载$router到Vue原型上，使所有vm都能通过this.$router访问
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  // 挂载$route到Vue原型上，使所有vm都能通过this.$route访问
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  // 全局注册 RouterView和RouterLink，挂载到Vue.components全局组件中
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  // 选项合并策略
  const strats = Vue.config.optionMergeStrategies
  // 钩子合并策略时使用created钩子的合并策略
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```

## 实例化VueRouter

- `new VueRouter({options})`实例化全局路由器

```js
export default class VueRouter {
  constructor (options: RouterOptions = {}) {
    debugger
    this.app = null
    this.apps = []
    this.options = options
    // 全局导航钩子
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []
    // matcher:{match,addRoute,getRoutes,addRoutes}
    // 创建匹配器，包含已经映射的路由和内置方法
    this.matcher = createMatcher(options.routes || [], this)

    // 模式 默认hash
    let mode = options.mode || 'hash'
    // 不支持pushState的环境下是否回退到 hash 模式
    this.fallback =
      mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      // 回退hash
      mode = 'hash'
    }
    // 非浏览器 abstract
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    // 根据mode创建实例history实例
    switch (mode) {
      case 'history':
        // h5
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        // hash
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        // 其他
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }
}
```

### createMatcher创建匹配器

- createMatcher的主要作用是将路由表配置解析为路由记录，并用map记录与path、name的映射关系，最后暴露操作route的内置方法

```js
export function createMatcher (
  routes: Array<RouteConfig>,// 路由表
  router: VueRouter
): Matcher {

  // 返回路由列表（顺序）、路由配置映射、命名路由映射
  // pathList = [record,...,*]
  // pathMap[record.path] = record
  // nameMap[name] = record
  const { pathList, pathMap, nameMap } = createRouteMap(routes) // 创建路由映射关系

  // 路由配置数组添加路由记录
  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap)
  }

  // 根据父级路由，添加路由记录
  function addRoute (parentOrRoute, route) {
    const parent = (typeof parentOrRoute !== 'object') ? nameMap[parentOrRoute] : undefined
    // $flow-disable-line
    createRouteMap([route || parentOrRoute], pathList, pathMap, nameMap, parent)

    // add aliases of parent
    if (parent) {
      // 为父级别名路由添加子路由配置
      createRouteMap(
        // $flow-disable-line route is defined if parent is
        parent.alias.map(alias => ({ path: alias, children: [route] })),
        pathList,
        pathMap,
        nameMap,
        parent
      )
    }
  }

  // 返回当前所有路由记录
  function getRoutes () {
    return pathList.map(path => pathMap[path])
  }

  // 匹配路由跳转并创建新的route对象
  function match (
    raw: RawLocation,
    currentRoute?: Route,
    redirectedFrom?: Location
  ): Route {}

  // 根据重定向返回匹配的route对象
  function redirect (
    record: RouteRecord,
    location: Location
  ): Route {}

  // 根据路由别名，创建route对象
  function alias (
    record: RouteRecord,
    location: Location,
    matchAs: string
  ): Route {}

  // 根据路由配置递归创建route对象
  function _createRoute (
    record: ?RouteRecord,
    location: Location,
    redirectedFrom?: Location
  ): Route {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match,
    addRoute,
    getRoutes,
    addRoutes
  }
}
```

#### createRouteMap创建路由映射

- createRouteMap根据路由表创建路由记录与path、name等映射关系

```js
export function createRouteMap (
  routes: Array<RouteConfig>,
  oldPathList?: Array<string>,
  oldPathMap?: Dictionary<RouteRecord>,
  oldNameMap?: Dictionary<RouteRecord>,
  parentRoute?: RouteRecord
): {
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>
} {
  // 路径列表用于控制路由匹配优先级
  const pathList: Array<string> = oldPathList || []
  // 路由map映射
  const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null)
  // 命名路由映射
  const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null)

  // 遍历路由表，分别向map中添加路由记录
  routes.forEach(route => {
    // 记录路由
    addRouteRecord(pathList, pathMap, nameMap, route, parentRoute)
  })

  // 把通配符*路由放到最后
  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0])
      l--
      i--
    }
  }

  // 根路由必须要有前导 /
  if (process.env.NODE_ENV === 'development') {
    const found = pathList
      .filter(path => path && path.charAt(0) !== '*' && path.charAt(0) !== '/')
    if (found.length > 0) {
      const pathNames = found.map(path => `- ${path}`).join('\n')
      warn(false, `Non-nested routes must include a leading slash character. Fix the following routes: \n${pathNames}`)
    }
  }

  // 返回路由列表（顺序）、路由配置映射、命名路由映射
  // pathMap[record.path] = record
  // nameMap[name] = record
  return {
    pathList,
    pathMap,
    nameMap
  }
}
```

### 实例化History历史清单对象

- 在`new VueRouter({})`时，根据配置对象，实例化history、hash、abstract对象，用于处理不同模式下的路由导航

```js
export default class VueRouter {
  constructor (options: RouterOptions = {}) {
    ...
    // 模式 默认hash
    let mode = options.mode || 'hash'
    // 不支持pushState的环境下是否回退到 hash 模式
    this.fallback =
      mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      // 回退hash
      mode = 'hash'
    }
    // 非浏览器 abstract
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode
    // 根据mode创建实例history实例
    switch (mode) {
      case 'history':
        // h5
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        // hash
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        // 其他
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }
}
```

#### 实例化HashHistory

- 以hash模式为例，实例化HashHistory

```js
export class HashHistory extends History {
  constructor (router: Router, base: ?string, fallback: boolean) {
    super(router, base)
    // check history fallback deeplinking
    // 回退，替换为hash模式
    if (fallback && checkFallback(this.base)) {
      return
    }
    // 校验 / 添加hash记录
    ensureSlash()
  }

  // 根据模式添加url监听事件以及滚轮行为
  setupListeners () {}

  // 使用push添加记录
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(
      location,
      route => {
        pushHash(route.fullPath)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }

  // 使用replace替换记录
  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    // 控制页面跳转
    this.transitionTo(
      location,
      route => {
        replaceHash(route.fullPath)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }

  // 导航
  go (n: number) {
    window.history.go(n)
  }

  // 校验跳转路径有效性，并添加记录
  ensureURL (push?: boolean) {
    const current = this.current.fullPath
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current)
    }
  }

  // 获取hash值 getHash
  getCurrentLocation () {
    return getHash()
  }
}
```

#### History基类

- HashHistory继承History基类，在这个基类中定义了页面跳转方法以及跳转时的回调

```js
export class History {
  constructor (router: Router, base: ?string) {
    // 路由器
    this.router = router
    // base路径规范化，加/为根路径
    this.base = normalizeBase(base)
    // 当前开始起始路径路由对象route 默认 / 路径
    this.current = START
    this.pending = null
    this.ready = false
    this.readyCbs = []
    this.readyErrorCbs = []
    this.errorCbs = []
    this.listeners = []
  }

  // 当前监听回调
  listen (cb: Function) {
    this.cb = cb
  }

  // 已经ready则直接调用cb，否则push进readyCbs数组
  onReady (cb: Function, errorCb: ?Function) {
    if (this.ready) {
      cb()
    } else {
      this.readyCbs.push(cb)
      if (errorCb) {
        this.readyErrorCbs.push(errorCb)
      }
    }
  }

  // 添加errorCb回调
  onError (errorCb: Function) {
    this.errorCbs.push(errorCb)
  }

  // 页面过渡
  transitionTo (
    location: RawLocation,
    onComplete?: Function,
    onAbort?: Function
  ) {}

  // 确保页面过渡
  confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {}

  // 更新当前route对象（页面跳转），current重新赋值，并执行跳转后cb回调
  updateRoute (route: Route) {
    this.current = route
    this.cb && this.cb(route)
  }

  // 未实现，由子类实现
  setupListeners () {
    // Default implementation is empty
  }

  teardown () {
    // 清除所有路由相关的事件监听器
    this.listeners.forEach(cleanupListener => {
      // 清除函数
      cleanupListener()
    })
    this.listeners = []
    // 重置当前路由对象
    this.current = START
    this.pending = null
  }
}
```

##### transitionTo

- transitionTo从旧页面过渡到新页面

```js
transitionTo (
  location: RawLocation,
  onComplete?: Function,
  onAbort?: Function
) {
  let route
  try {
    // 匹配新页面的路由，并生成route对象
    route = this.router.match(location, this.current)
  } catch (e) {
    // 捕获重定向时抛出的错误
    this.errorCbs.forEach(cb => {
      cb(e)
    })
    // Exception should still be thrown
    throw e
  }
  // 旧页面的route对象
  const prev = this.current
  // 确保导航过程
  this.confirmTransition(
    route,
    () => {
      // 导航成功回调
      // 更新路由对象
      this.updateRoute(route)
      // 递归调用子路由的onComplete
      onComplete && onComplete(route)
      // 确保url正确
      this.ensureURL()
      // 调用全局afterEach钩子
      this.router.afterHooks.forEach(hook => {
        hook && hook(route, prev)
      })

      // 触发一次ready回调
      if (!this.ready) {
        this.ready = true
        this.readyCbs.forEach(cb => {
          cb(route)
        })
      }
    },
    // 错误处理，触发readyErrorCbs
    err => {
      // 存在错误处理
      if (onAbort) {
        onAbort(err)
      }
      // 初始化重定向不应该把状态置为ready
      if (err && !this.ready) {
        // 初始化页面时的导航不能进入ready状态
        if (!isNavigationFailure(err, NavigationFailureType.redirected) || prev !== START) {
          // 不是导航错误，并且不是初始化跳转
          this.ready = true
          // 执行错误回调
          this.readyErrorCbs.forEach(cb => {
            cb(err)
          })
        }
      }
    }
  )
}
```

##### confirmTransition

- confirmTransition处理导航过程

```js
confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
  // 当前路由对象
  const current = this.current
  this.pending = route
  // 导航错误handler
  const abort = err => {
    // 导航错误handler
    if (!isNavigationFailure(err) && isError(err)) {
      if (this.errorCbs.length) {
        this.errorCbs.forEach(cb => {
          cb(err)
        })
      } else {
        warn(false, 'uncaught error during route navigation:')
        console.error(err)
      }
    }
    onAbort && onAbort(err)
  }
  // 新匹配的最后一个路由记录
  const lastRouteIndex = route.matched.length - 1
  // 旧匹配的最后一个路由记录
  const lastCurrentIndex = current.matched.length - 1
  // 相同路由记录，导航重复
  if (
    isSameRoute(route, current) &&
    lastRouteIndex === lastCurrentIndex &&
    route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]
  ) {
    // 确保url，并添加历史记录
    this.ensureURL()
    // 处理导航重复错误
    return abort(createNavigationDuplicatedError(current, route))
  }

  // 根据新旧路由记录，标记各状态的路由记录
  // updated更新的记录、deactivated失活的记录、activated激活的路由记录对象
  const { updated, deactivated, activated } = resolveQueue(
    this.current.matched,
    route.matched
  )

  // 各种导航钩子队列
  // 顺序：beforeRouteLeave、beforeEach、beforeRouteUpdate、beforeEnter
  const queue: Array<?NavigationGuard> = [].concat(
    // 组件内 beforeRouteLeave 钩子
    extractLeaveGuards(deactivated),
    // 全局 beforeEach 钩子
    this.router.beforeHooks,
    // 组件内 beforeRouteUpdate 钩子
    extractUpdateHooks(updated),
    // 在路由表中的 beforeEnter 钩子
    activated.map(m => m.beforeEnter),
    // 解析异步组件
    resolveAsyncComponents(activated)
  )

  // 导航钩子迭代器
  const iterator = (hook: NavigationGuard, next) => {
    if (this.pending !== route) {
      // 导航取消
      return abort(createNavigationCancelledError(current, route))
    }
    try {
      hook(route, current, (to: any) => {// next函数
        if (to === false) {
          // next(false) -> abort navigation, ensure current URL
          this.ensureURL(true)
          abort(createNavigationAbortedError(current, route))
        } else if (isError(to)) {
          this.ensureURL(true)
          abort(to)
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' &&
            (typeof to.path === 'string' || typeof to.name === 'string'))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort(createNavigationRedirectedError(current, route))
          if (typeof to === 'object' && to.replace) {
            this.replace(to)
          } else {
            this.push(to)
          }
        } else {
          // confirm transition and pass on the value
          next(to)
        }
      })
    } catch (e) {
      abort(e)
    }
  }

  // 执行路由钩子
  runQueue(queue, iterator, () => {
    // 异步组件解析前，提取组件内 beforeRouteEnter 钩子
    const enterGuards = extractEnterGuards(activated)
    // 追加 全局 beforeResolve  钩子
    const queue = enterGuards.concat(this.router.resolveHooks)
    runQueue(queue, iterator, () => {
      if (this.pending !== route) {
        // 导航取消
        return abort(createNavigationCancelledError(current, route))
      }
      // 导航结束
      this.pending = null
      // 完成导航后执行完成回调，更新route、添加历史记录
      onComplete(route)

      // 异步执行vm下的 beforeRouteEnter 
      if (this.router.app) {
        this.router.app.$nextTick(() => {
          handleRouteEntered(route)
        })
      }
    })
  })
}
```

##### runQueue

- runQueue依次执行路由中间件

```js
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  // fn 导航钩子迭代器，cb之后完成后回调
  const step = index => {
    // 路由中间件执行结束
    if (index >= queue.length) {
      // 结束时回调
      cb()
    } else {
      // 存在导航钩子
      if (queue[index]) {
        // 导航钩子迭代器执行当前钩子
        fn(queue[index], () => {
          // 执行结束后调用下一个中间件
          step(index + 1)
        })
      } else {
        // 队列当前索引不存在或未定义钩子，顺序执行,相当于执行next，直到结束
        step(index + 1)
      }
    }
  }
  // 开始执行第一个路由中间件
  step(0)
}


// 钩子迭代器
const iterator = (hook: NavigationGuard, next) => {
  if (this.pending !== route) {
    // 导航取消
    return abort(createNavigationCancelledError(current, route))
  }
  try {
    // 执行钩子，并传入next，由用户控制执行下一个中间件
    hook(route, current, (to: any) => {// next函数
      // to：传入next(to)的参数
      if (to === false) {
        // next(false) -> abort navigation, ensure current URL
        this.ensureURL(true)
        abort(createNavigationAbortedError(current, route))
      } else if (isError(to)) {
        // next(new Error())
        this.ensureURL(true)
        abort(to)
      } else if (
        typeof to === 'string' ||
        (typeof to === 'object' &&
          (typeof to.path === 'string' || typeof to.name === 'string'))
      ) {
        // next('/') or next({ path: '/' }) -> redirect
        // 终止导航，进行重定向
        abort(createNavigationRedirectedError(current, route))
        if (typeof to === 'object' && to.replace) {
          // 替换记录
          this.replace(to)
        } else {
          // 添加记录
          this.push(to)
        }
      } else {
        // 传递参数
        next(to)
      }
    })
  } catch (e) {
    abort(e)
  }
}
```

## Vue中使用VueRouter

在Vue中Router注入过程

1. 使用`Vue.use(VueRouter)`向Vue.options全局配置混入beforeCreate、destroyed钩子，挂载$router、$route到实例原型上，并注册RouterView、RouterLink全局组件
2. `new VueRouter({option})`通过路由表配置选项实例化Router实例
3. 在`new Vue({router})`实例化全局vm时传入router，挂载到vm上

### router挂载过程

```js
// 安装VueRouter
Vue.use(VueRouter)

// 定义路由组件
const Home = { template: '<div>home</div>' }

// 创建router
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  // 路由表
  routes: [
    { path: '/', component: Home },
  ]
})

// 全局before导航钩子
router.beforeEach((to, from, next) => {
  if (to.query.delay) {
    setTimeout(() => {
      next()
    }, Number(to.query.delay))
  } else {
    next()
  }
})

// 创建根实例，并注入router，渲染<router-view>中的组件
const vueInstance = new Vue({
  router,
  data: () => ({ n: 0 }),
  template: `
    <div id="app">
      <h1>Basic</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
      <router-view class="view"></router-view>
    </div>
  `,
}).$mount('#app')
```

#### 初始化VueRouter

- 在use时就已经注册了RouterView和RouterLink组件，并挂载了$router和$route

```js
export function install (Vue) {
  // 避免重复安装
  if (install.installed && _Vue === Vue) return
  install.installed = true
  ...
  // 调用父级组件的 registerRouteInstance 注册路由
  const registerInstance = (vm, callVal) => {
    // 父级vnode
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      // 如果父级数据中存在 registerRouteInstance 则注册路由
      i(vm, callVal)
    }
  }

  // 在全局配置中混入 路由的 beforeCreate 和 destroyed 用于注册和注销路由
  Vue.mixin({
    beforeCreate () {
      // 有定义路由
      if (isDef(this.$options.router)) {
        // 路由所属组件
        this._routerRoot = this
        this._router = this.$options.router
        // 路由初始化
        this._router.init(this)
        // 响应式设置vm._route 值为当url的route对象
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 未定义路由，使用父组件或者组件自身
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      // 注册实例,即注册被RouterView包含的组件
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  // 挂载$router到Vue原型上
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  // 挂载$route到Vue原型上
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  // 全局注册 RouterView和RouterLink
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)
  ...
}
```

#### beforeCreate

- 监听事件、注册将要渲染的组件

```js
beforeCreate () {
  // 配置中存在路由器对象
  if (isDef(this.$options.router)) {
    // 路由器所属组件
    this._routerRoot = this
    // 内部路由器属性
    this._router = this.$options.router
    // 路由器初始化，绑定dom事件
    this._router.init(this)
    // 响应式设置vm._route 值为当url的route对象
    Vue.util.defineReactive(this, '_route', this._router.history.current)
  } else {
    // 未定义路由，使用父组件或者组件自身作为路由器根组件
    this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
  }
  // 标记组件实例,即被RouterView包含的组件，等待RouterView render时渲染对应路由组件
  registerInstance(this, this)
},
```

## VueRouter流程图

![VueRouter流程图](./img/54.png)