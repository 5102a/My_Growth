# React Router5.x源码分析

此系列通过在React Router源码中分析底层原理

> 以React Router5.2.0版本进行源码分析

react router相关的包有4个：

1. react-router：路由核心包，主要分析
2. react-router-config：提供2个方法的工具包
3. react-router-dom：与dom强相关的包，包含Link、NavLink、HashRouter、BrowserRouter组件的实现
4. react-router-native：与原生平台相关的路由包，包括ios、android平台

这里主要分析react-router、react-router-config、react-router-dom这3个包的源码

## react-router

所有核心代码都在这里实现，与平台无关的代码

公共api

```js
/* index.js */
// 核心组件
export { default as MemoryRouter } from "./MemoryRouter.js";
export { default as Prompt } from "./Prompt.js";
export { default as Redirect } from "./Redirect.js";
export { default as Route } from "./Route.js";
export { default as Router } from "./Router.js";
export { default as StaticRouter } from "./StaticRouter.js";
export { default as Switch } from "./Switch.js";
export { default as generatePath } from "./generatePath.js";
export { default as matchPath } from "./matchPath.js";
export { default as withRouter } from "./withRouter.js";
// react特定上下文对象
export { default as __HistoryContext } from "./HistoryContext.js";
export { default as __RouterContext } from "./RouterContext.js";
// react中hooks的支持
export { useHistory, useLocation, useParams, useRouteMatch } from "./hooks.js";
```

### 特定上下文对象

基于React.createContext创建指定displayName的ctx对象，用于给路由组件提供context

createNamedContext创建指定displayName（用于React DevTools中显示上下文名称）的上下文

```js
/* createNamedContext.js */
import createContext from "mini-create-react-context";
// 创建react的ctx对象
const createNamedContext = name => {
  // 创建react的context对象，用于provider
  const context = createContext();
  // 指定调试中的ctx名称
  context.displayName = name;

  return context;
};

export default createNamedContext;
```

创建名为Router-History的ctx对象

```js
/* HistoryContext.js */
// ctx对象，displayName为Router-History
const historyContext = /*#__PURE__*/ createNamedContext("Router-History");
export default historyContext;
```

创建名为Router的ctx对象

```js
/* RouterContext.js */
// ctx对象，displayName为Router
const context = /*#__PURE__*/ createNamedContext("Router");
export default context;
```

### Router组件

Router组件用于给子组件提供ctx上下文环境和渲染子组件，以及路由组件的创建和销毁

```jsx
/* Router.js */
class Router extends React.Component {
  // Router.computeRootMatch,返回与根路由（/）的match对象
  static computeRootMatch(pathname) {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
  }

  constructor(props) {
    super(props);

    this.state = {
      location: props.history.location
    };

    this._isMounted = false;
    this._pendingLocation = null;

    // 没有静态上下文，进行初始化
    if (!props.staticContext) {
      // 监听history变化
      this.unlisten = props.history.listen(location => {
        if (this._isMounted) {
          // 已挂载，更新location
          this.setState({ location });
        } else {
          // 未挂载pending，当挂载后更新location
          this._pendingLocation = location;
        }
      });
    }
  }

  componentDidMount() {
    // 已挂载
    this._isMounted = true;
    // 更新location
    if (this._pendingLocation) {
      this.setState({ location: this._pendingLocation });
    }
  }

  componentWillUnmount() {
    if (this.unlisten) {
      // 解绑
      this.unlisten();
      this._isMounted = false;
      this._pendingLocation = null;
    }
  }

  render() {
    return (
      /* 为子路由组件提供ctx */
      <RouterContext.Provider
        value={{
          history: this.props.history,
          location: this.state.location,
          match: Router.computeRootMatch(this.state.location.pathname),
          staticContext: this.props.staticContext
        }}
      >
        {/* 渲染子组件并提供history对象 */}
        <HistoryContext.Provider
          children={this.props.children || null}
          value={this.props.history}
        />
      </RouterContext.Provider>
    );
  }
}
```

### Route组件

Route组件用于匹配单个路径以及渲染指定组件，在这里处理嵌套路由、子组件为函数等情况

```jsx
/* Route.js */
class Route extends React.Component {
  render() {
    return (
      // 使用Router提供的ctx
      <RouterContext.Consumer>
        {context => {
          // 优先使用自身的location属性
          const location = this.props.location || context.location;
          // 计算匹配对象，使用 switch 时会提供，如果当前路由不匹配会返回 null 即不渲染
          const match = this.props.computedMatch
            ? this.props.computedMatch // <Switch>组件会匹配，并提供match对象（前提是使用switch包裹）
            : this.props.path // 否则根据自身path属性判断match对象来源
            ? matchPath(location.pathname, this.props)  // 存在path则构造匹配对象
            : context.match;  // 不存在path采用Router提供的ctx全局匹配对象

          // 合并props，更新子组件location、match对象
          const props = { ...context, location, match };
          // 获取子路由，当前组件，渲染函数
          let { children, component, render } = this.props;

          // 处理空子路由情况，统一children为null，不进行渲染，而是渲染component属性对应组件
          if (Array.isArray(children) && isEmptyChildren(children)) {
            // 空子组件
            children = null;
          }
          // 真正渲染
          return (
            // 给渲染组件提供更新location和match的Router上下文对象
            <RouterContext.Provider value={props}>
              {props.match
                ? children  // 匹配路径
                  ? typeof children === "function" // 匹配路径、存在子路由
                    ? __DEV__ // 匹配路径、存在子路由函数，则渲染函数结果
                      ? evalChildrenDev(children, props, this.props.path)
                      : children(props) // 执行函数作为child组件
                    : children // 非函数子组件，直接返回组件
                  : component // 不存在子组件，存在当前组件
                  ? React.createElement(component, props) // react渲染当前组件
                  : render  // 存在render函数
                  ? render(props) // 执行render函数渲染
                  : null  // 都不存在，不渲染
                : typeof children === "function" // 不匹配，children为函数
                ? __DEV__   // 开发环境，不匹配且子组件为函数，也执行函数
                  ? evalChildrenDev(children, props, this.props.path)
                  : children(props)
                : null // 不匹配，生产环境不渲染}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
```

### withRouter高阶组件

withRouter高阶组件的作用是不需要route匹配，就能让组件使用到Router提供的ctx上下文对象

```jsx
function withRouter(Component) {
  // 构造组件在react devtool 中的名称
  const displayName = `withRouter(${Component.displayName || Component.name})`;
  // 包装后返回的组件
  const C = props => {
    const { wrappedComponentRef, ...remainingProps } = props;

    return (
      <RouterContext.Consumer>
        {context => {
          // 渲染被包装后（注入context）的原始组件
          return (
            <Component
              {...remainingProps} // 其他外部传入的属性
              {...context} // 注入Router提供的ctx
              ref={wrappedComponentRef} // 获取原始组件引用
            />
          );
        }}
      </RouterContext.Consumer>
    );
  };

  // 指定名称
  C.displayName = displayName;
  // 标识被包装的原始组件
  C.WrappedComponent = Component;
  // 拷贝所有原始组件中非内置react的静态方法到C
  return hoistStatics(C, Component);
}
```

### MemoryRouter路由组件

MemoryRouter路由组件用于在内存中模拟history，维护location正常使用，一般用于非宿主环境下的前端路由

```jsx
/* MemoryRouter.js */
import { createMemoryHistory as createHistory } from "history";
class MemoryRouter extends React.Component {
  // 根据props创建history对象
  history = createHistory(this.props);

  render() {
    // 渲染 指定memory history的Router
    return <Router history={this.history} children={this.props.children} />;
  }
}
```

### Lifecycle组件

Lifecycle组件的作用很简单，以class组件形式暴露组件生命周期函数给外部实现，主要用于实际不渲染内容，但是需要在组件的各个阶段操作的时候

```jsx
/* Lifecycle.js */
class Lifecycle extends React.Component {
  componentDidMount() {
    // 调用传入的onMount函数挂载location
    if (this.props.onMount) this.props.onMount.call(this, this);
  }

  componentDidUpdate(prevProps) {
    // 调用传入的onUpdate进行更新location
    if (this.props.onUpdate) this.props.onUpdate.call(this, this, prevProps);
  }

  componentWillUnmount() {
    // 卸载location
    if (this.props.onUnmount) this.props.onUnmount.call(this, this);
  }

  render() {
    return null;
  }
}
```

### Redirect组件

Redirect组件用于重定向到其他路由，让另一个路由组件代替渲染

```jsx
/* Redirect.js */
function Redirect({ computedMatch, to, push = false }) {
  return (
    <RouterContext.Consumer>
      {context => {
        // 获取顶层Router上下文对象
        const { history, staticContext } = context;
        // 替换url方式，默认以replace方式替换记录
        const method = push ? history.push : history.replace;
        // 根据to、params属性生成location对象
        const location = createLocation(
          computedMatch // 计算匹配
            ? typeof to === "string"
              ? generatePath(to, computedMatch.params)  // 根据params，to生成url
              : {
                  ...to,
                  pathname: generatePath(to.pathname, computedMatch.params)
                }
            : to
        );

        // 当处于静态上下文时，立即更新当前location，进行跳转（主要用于测试和ssr）
        if (staticContext) {
          method(location);
          return null;
        }

        // 动态上下文，则使用生命周期组件控制渲染时机
        return (
          <Lifecycle
            onMount={() => {
              // 挂载时，更新浏览器location对象
              method(location);
            }}
            onUpdate={(self, prevProps) => {
              const prevLocation = createLocation(prevProps.to);
              // 更新时进行diff location对象
              if (
                !locationsAreEqual(prevLocation, {
                  ...location,
                  key: prevLocation.key
                })
              ) {
                method(location);
              }
            }}
            to={to}
          />
        );
      }}
    </RouterContext.Consumer>
  );
}
```

### Switch组件

Switch组件用于渲染第一个匹配到的路由组件Route，即如果有多个路由命中，则只会渲染第一个

```jsx
/* Switch.js */
class Switch extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {

          // 获取当前location对象
          const location = this.props.location || context.location;

          let element, match;

          // 不渲染相同组件，不同path，所以采用React.Children.forEach
          React.Children.forEach(this.props.children, child => {
            // 直接遍历所有子路由，返回第一个匹配的route组件
            // 当前是组件，且未匹配到，则进行判断
            if (match == null && React.isValidElement(child)) {
              element = child;
              // 获取有效path，或者redirect的from
              const path = child.props.path || child.props.from;

              match = path
                ? matchPath(location.pathname, { ...child.props, path })  // 判断匹配
                : context.match;  // 采用ctx中的匹配标志
            }
          });

          return match
            ? React.cloneElement(element, { location, computedMatch: match }) // 匹配到路径，则克隆对应的子路由，并指定location和match对象的Route组件
            : null; // 未匹配到，不显示
        }}
      </RouterContext.Consumer>
    );
  }
}
```

### 对应react的router hooks

在react-router中支持了react 16.8中的hooks特性，让react更好的使用router

```jsx
/* hooks.js */
import RouterContext from "./RouterContext.js";
import HistoryContext from "./HistoryContext.js";

// 16.8 新的hooks特性
const useContext = React.useContext;
// 对于这些context，在最上层需要提供Router上下文，才能获取到对应提供的值
// 使用指定displayName为history的ctx上下文对象
export function useHistory() {
  return useContext(HistoryContext);
}

// 使用指定displayName为router的ctx的上下文中的location
export function useLocation() {
  return useContext(RouterContext).location;
}

// 使用指定displayName为router的ctx的上下文中的match中的params参数对象（路由匹配到的参数对象）
export function useParams() {
  const match = useContext(RouterContext).match;
  return match ? match.params : {};
}

// 使用指定displayName为router的ctx的上下文中的match对象（路由匹配到的match对象）
export function useRouteMatch(path) {
  const location = useLocation();
  const match = useContext(RouterContext).match;
  return path ? matchPath(location.pathname, path) : match;
}
```

### match对象

match对象，记录路由匹配结果的数据集合

```jsx
/* matchPath.js */
function matchPath(pathname, options = {}) {
  if (typeof options === "string" || Array.isArray(options)) {
    // 字符串，或者路径数组
    options = { path: options };
  }

  const { path, exact = false, strict = false, sensitive = false } = options;

  // 嵌套多路径数组
  const paths = [].concat(path);

  // 遍历多层路径，逐个路由从父->子路由进行匹配，返回最终的匹配结果对象
  return paths.reduce((matched, path) => {
    // 无路径，不匹配
    if (!path && path !== "") return null;
    // 已匹配，则直接返回匹配结果对象
    if (matched) return matched;

    // 根据匹配参数编译路径，生成reg，并缓存
    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive
    });

    // 通过正则判断路径url是否匹配，并返回正则匹配的结果
    const match = regexp.exec(pathname);

    // 不匹配，返回null
    if (!match) return null;

    //解构匹配对象
    const [url, ...values] = match;
    // 是否精确匹配url
    const isExact = pathname === url;

    // 需要精确匹配，但是没能精确匹配
    if (exact && !isExact) return null;

    // 匹配，返回最终的匹配对象，包含各种匹配结果和标识参数
    return {
      path, // the path used to match
      url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo, key, index) => {
        // 解析参数
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

export default matchPath;
```

## react-router-config

这个包主要包含2割工具方法

1. matchRoutes 返回路由嵌套匹配结果数组
2. renderRoutes 使用函数的方式来渲染routes，而非jsx

### matchRoutes

传入routes路由配置数组，匹配pathname

```jsx
/* matchRoutes.js */
function matchRoutes(routes, pathname, /*not public API*/ branch = []) {
  routes.some(route => {
    // 获取匹配对象
    const match = route.path
      ? matchPath(pathname, route) // 匹配生成match对象
      : branch.length
      ? branch[branch.length - 1].match // 采用父级match对象
      : Router.computeRootMatch(pathname); // 采用根match对象

    // 匹配，则添加到branch中
    if (match) {
      branch.push({ route, match });
      // 递归匹配
      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }

    return match;
  });

  // 每个路由嵌套匹配的结果
  return branch;
}
```

### renderRoutes

使用函数的方式来渲染routes，而非jsx

```jsx
/* renderRoutes.js */
function renderRoutes(routes, extraProps = {}, switchProps = {}) {
  return routes ? (
    /* 采用switch单一匹配命中 */
    <Switch {...switchProps}>
      {routes.map((route, i) => (
        /* 渲染每个route */
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={props =>
            // 支持render函数渲染，优先级高于component属性
            route.render ? (
              route.render({ ...props, ...extraProps, route: route })
            ) : (
              <route.component {...props} {...extraProps} route={route} />
            )
          }
        />
      ))}
    </Switch>
  ) : null;
}
```

## react-router-dom

这个包主要实现了浏览器（dom）环境下的路由组件，包含以下组件

1. BrowserRouter：创建HTML5 history模式的Router组件
2. HashRouter：创建hash模式的Router组件
3. Link：内部封装了a标签，并使其支持路由导航的组件
4. NavLink：在Link的基础上支持对激活链接的样式控制

### BrowserRouter组件

创建一个基于html5 history实现的router

```jsx
/* BrowserRouter.js */
import { createBrowserHistory as createHistory } from "history";
class BrowserRouter extends React.Component {
  // 根据属性初始化内部history对象
  history = createHistory(this.props);
  render() {class HashRouter extends React.Component {
  history = createHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}
    // 绑定history对象
    return <Router history={this.history} children={this.props.children} />;
  }
}
```

### HashRouter组件

创建一个基于window.location.hash实现的router

```jsx
/* HashRouter.js */
import { createHashHistory as createHistory } from "history";
class HashRouter extends React.Component {
  // 根据属性初始化内部history对象
  history = createHistory(this.props);

  render() {
    // 绑定history对象
    return <Router history={this.history} children={this.props.children} />;
  }
}
```

### a标签包装

LinkAnchor对a标签进行包装，使其具备路由导航功能

```jsx
/* Link.js */
// React 15 兼容 forwardRef
const forwardRefShim = C => C;
let { forwardRef } = React;
if (typeof forwardRef === "undefined") {
  forwardRef = forwardRefShim;
}

// 修饰符事件
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

// a链接导航
const LinkAnchor = forwardRef(
  (
    {
      innerRef,
      navigate,
      onClick,
      ...rest
    },
    forwardedRef
  ) => {
    const { target } = rest;

    let props = {
      ...rest,
      onClick: event => {
        // 处理点击事件
        try {
          if (onClick) onClick(event);
        } catch (ex) {
          // 异常情况
          event.preventDefault();
          throw ex;
        }

        if (
          !event.defaultPrevented && // 未调用 event.preventDefault();
          event.button === 0 && // 忽略除了左键以外的点击
          (!target || target === "_self") && // 让浏览器能够处理 "target=_blank" 的点击情况，target === "_self"则阻止
          !isModifiedEvent(event) // 忽略带有修饰键的点击
        ) {
          // 没有包含修饰符，是左键点击，没有被阻止默认，在自身打开，则阻止默认a标签跳转行为
          event.preventDefault();
          // 然后路由导航
          navigate();
        }
      }
    };

    // 用于获取底层a标签的dom引用
    // React 15 兼容 forwardRef
    if (forwardRefShim !== forwardRef) {
      props.ref = forwardedRef || innerRef;
    } else {
      props.ref = innerRef;
    }

    // 渲染a标签
    return <a {...props} />;  
  }
);
```

### Link组件

Link标签根据传入的to属性以及ctx中的location对象，生成新的location，最后在a标签被点击时调用BOM方法进行导航，并阻止默认行为

```jsx
/* locationUtils.js */
import { createLocation } from "history";
// 产生新的location
export const resolveToLocation = (to, currentLocation) =>
  typeof to === "function" ? to(currentLocation) : to;

// 标准化location
export const normalizeToLocation = (to, currentLocation) => {
  return typeof to === "string"
    ? createLocation(to, null, null, currentLocation)
    : to;
};
/* Link.js */
// Link组件
const Link = forwardRef(
  (
    {
      component = LinkAnchor,
      replace,
      to,
      innerRef, // TODO: deprecate
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <RouterContext.Consumer>
        {context => {
          const { history } = context;

          // 规范化location对象
          const location = normalizeToLocation(
            resolveToLocation(to, context.location),
            context.location
          );
          // 根据导航到的location对象，创建href字符串
          const href = location ? history.createHref(location) : "";
          const props = {
            ...rest,
            href,
            // 使用原生BOM方法进行导航
            navigate() {
              const location = resolveToLocation(to, context.location);
              const method = replace ? history.replace : history.push;
              // 导航到指定location
              method(location);
            }
          };

          // React 15 兼容 ref
          if (forwardRefShim !== forwardRef) {
            props.ref = forwardedRef || innerRef;
          } else {
            props.innerRef = innerRef;
          }
          // 创建a标签的组件，并包含导航方法
          return React.createElement(component, props); 
        }}
      </RouterContext.Consumer>
    );
  }
);
```

### NavLink组件

NavLink组件与Link组件最大的区别就是NavLink组件可以根据激活状态应用不同的style和class

```jsx
/* NavLink.js */
// React 15 兼容 ref
const forwardRefShim = C => C;
let { forwardRef } = React;
if (typeof forwardRef === "undefined") {
  forwardRef = forwardRefShim;
}

// 拼接className
function joinClassnames(...classnames) {
  return classnames.filter(i => i).join(" ");
}
// 导航link，可控制导航样式
const NavLink = forwardRef(
  (
    {
      "aria-current": ariaCurrent = "page",
      activeClassName = "active",
      activeStyle,
      className: classNameProp,
      exact,
      isActive: isActiveProp,
      location: locationProp,
      sensitive,
      strict,
      style: styleProp,
      to,
      innerRef, // TODO: deprecate
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <RouterContext.Consumer>
        {context => {

          // 获取和处理location
          const currentLocation = locationProp || context.location;
          // 导航到的location对象
          const toLocation = normalizeToLocation(
            resolveToLocation(to, currentLocation),
            currentLocation
          );
          // 导航pathname
          const { pathname: path } = toLocation;
          // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
          // 对路径符号进行转义
          const escapedPath =
            path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");

          // 获取匹配结果match对象
          const match = escapedPath
            ? matchPath(currentLocation.pathname, {
                path: escapedPath,
                exact,
                sensitive,
                strict
              })
            : null;
          
          // 获取当前激活状态
          const isActive = !!(isActiveProp
            ? isActiveProp(match, currentLocation)
            : match);

          // 根据激活增删active class
          const className = isActive
            ? joinClassnames(classNameProp, activeClassName)
            : classNameProp;
          // 根据激活增删style
          const style = isActive ? { ...styleProp, ...activeStyle } : styleProp;
          
          // 根据激活状态生成当前导航链接对应属性
          const props = {
            "aria-current": (isActive && ariaCurrent) || null,
            className,
            style,
            to: toLocation,
            ...rest
          };

          // React 15 兼容 ref
          if (forwardRefShim !== forwardRef) {
            props.ref = forwardedRef || innerRef;
          } else {
            props.innerRef = innerRef;
          }

          // 渲染active中带有class和style的Link
          return <Link {...props} />;
        }}
      </RouterContext.Consumer>
    );
  }
);
```

### SPA中的router

SPA之所以可行，前端路由在这其中起到主要作用。

传统MPA多页应用通过创建多个页面，每个页面指定单独的url，当点击a标签时，重新刷新页面，向后端发起请求，跳转到指定url的页面，从而进行页面切换

在ajax技术出来之后，页面可以发起无刷新请求，利用这一点，实现动态页面

结合ajax以及前端框架开发出spa应用，只需部署一个html文件，通过前端路由进行组件切换，以达到切换页面的效果

### SPA页面切换

传统MPA中实现页面切换依靠a链接跳转，发起另一个url请求到服务器，服务器根据url返回不同的页面

在SPA中通过前端路由控制页面切换，当需要切换页面时，通过改变a链接的默认行为，并且配合BOM的history接口达到页面切换的效果

Router中通过阻止a标签的跳转行为，并根据跳转路径重新生成location对象，内部调用BOM的history.pushState、History.replaceState、url.hash、HashChangeEvent等方式实现对url的改变以及监听，并记录浏览器操作

结合前端路由懒加载技术，当命中url时，异步请求独立打包的组件模块，加载后渲染对应组件

## Vue Router与React Router

看过Vue Router与React Router源码之后，最大的感受就是：

1. 前端路由底层实现原理大同小异，理念互通，实现各异
2. Vue Router更加强大，源码实现也更加复杂
3. React Router更加精炼，没有过多的花样，源码实现简洁明了

库没有好坏只有更适合