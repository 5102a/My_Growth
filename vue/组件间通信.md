# 组件间通讯

- vue中一个组件就是一个vue实例，那么实例与实例之间如何通讯呢，当然vue也给出了答案

## 父子组件之间的通讯

- 在很多场景中都会涉及到一个组件使用另一个组件，但是如果想要让组件间的数据互通，或者说可以交互那么应该如何实现呢

### 父组件通过props传数据给子组件

#### 通过props给子代传数据

- 一般情况下，子组件需要用到父组件的数据，那么父组件就可以通过给子组件传递属性，而在子组件中的props就是接收到父组件传来的数据

```html
// 父组件
<template>
  <div>
    <Children
    :parent="myName"
    :name="childName"
    ></Children>
  </div>
</template>

<script>
import Children from './Children'
export default {
  name: 'Parent',
  components: {
    Children
  },
  data() {
    return {
      myName: 'Parent',
      childName: '子组件'
    }
  }
}
</script>
// 子组件
<template>
  <div>
    <h1>父组件是：{{ parent }}</h1>
    <h1>我是：{{ name }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Children',
  props: {
    parent: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  }
}
</script>
```

- 从上面可以看的，父组件通过在子组件标签中设置属性，其中属性名对应的就是子组件中设置的props属性，而值就是父组件自身的数据。通过给子组件属性传值，从而使得子组件获取到父组件的数据
- 当然这里也可以不用动态绑定，那么传的就是字符串形式，如果是动态绑定那么传递的就是表达式的值
- 简单说组件的props对象中设置的属性，就是自定义的标签属性，而只有使用这个组件的同时给指定标签属性传递值才会被此组件接收到
- props是只读属性，也就是子组件只能获取不能修改props的属性，且props只能传递一级，从父组件传递到下一个子组件，不能跨级传，而且是单向传递

#### 通过`$children`传数据

```html
// 父组件
<template>
  <div>
    <Children1 :name="childName"></Children1>
  </div>
</template>

<script>
import Children1 from './Children1'

export default {
  name: 'Parent',
  components: {
    Children1
  },
  data() {
    return {
      childName: 'Children1'
    }
  }
}
</script>
// 子组件
<template>
  <div>
    <h1>我是：{{ name }}</h1>
    <button @click="dispatch">点我修改父组件数据</button>
  </div>
</template>

<script>
export default {
  name: 'Children1',
  props:{
    name:{
      type:String,
      default:''
    },
  },
  methods:{
    dispatch(){
      this.$parent.childName='child'
    }
  }
}
</script>
```

- 以上是通过`this.$parent`来修改父组件的数据，其中this是当前的子组件本身，`$parent`是父组件实例

#### 隔代传数据(provide、inject)

- 此方法是vue2.2.0中新添的api
- 父组件把所有后代可能用到的数据存放到provide对象中
- 而后代组件如果需要用到这些数据，则根据需要在inject中导入即可使用，可以看成是灵活的隔代props

```html
// 父组件
<template>
  <div>
    <Children1></Children1>
  </div>
</template>

<script>
import Children1 from './Children1'

export default {
  name: 'Parent',
  components: {
    Children1
  },
  provide: {
    childPage: 5
  }
}
</script>
// 一级子组件
<template>
  <div>
    <Children2></Children2>
  </div>
</template>

<script>
import Children2 from './Children2'

export default {
  name: 'Children1',
  components: {
    Children2
  }
}
</script>
//二级子组件
<template>
  <div>
    <h1>页码：{{ childPage }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Children2',
  inject: ['childPage']
}
</script>
```

- 此时二级子组件就通过inject获取到父组件provide中的数据了

#### 通过ref引用组件

- 在vue中提供了一个属性ref可以在需要引用的组件上使用ref属性来获取引用
- 比如在父组件中给子组件设置一个ref，那么就可以在父组件中通过`this.refs.属性值`获取相应子组件的引用

```html
// 父组件
<template>
  <div>
    <Children1 ref="child1"></Children1>
  </div>
</template>

<script>
import Children1 from './Children1'

export default {
  name: 'Parent',
  components: {
    Children1
  },
  mounted(){
    // 通过refs获取子组件的引用
    this.$refs.child1.name='child'
  }
}
</script>
// 子组件
<template>
  <div>
    <h1>{{ name }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Children1',
  data() {
    return {
      name: 'Children1'
    }
  }
}
</script>
```

- 在设置了ref属性之后，就可以在当前组件中使用`this.$refs`获取到所有当前设置ref的子组件实例引用，从而就能像`this.$children`一样操作

#### 使用`$attrs`

- vue2.4中新增的api，可用于继承父组件中定义的属性
- 比如在父组件中给子组件定义属性，并且这些属性在子组件的props不存在，那么可以在子组件中使用`$attrs`来获取父组件中定义的这些属性

```html
// 父组件
<template>
  <div>
    <Children1 :name="name" :age="age" :city="city"></Children1>
  </div>
</template>

<script>
import Children1 from './Children1'

export default {
  name: 'Parent',
  components: {
    Children1
  },
  data() {
    return {
      name: 'tom',
      age: 5,
      city: 'fuzhou'
    }
  }
}
</script>
// 一级子组件
<template>
  <div>
    <Children2 v-bind="$attrs"></Children2>
  </div>
</template>

<script>
import Children2 from './Children2'

export default {
  name: 'Children1',
  components: {
    Children2
  },
  props: ['name'], // 过滤name属性
}
</script>
// 二级子组件
<template>
  <div>
    <h1>
      名字：{{ $attrs.name }} 年龄：{{ $attrs.age }} 城市：{{ $attrs.city }}
    </h1>
  </div>
</template>

<script>
export default {
  name: 'Children2'
}
</script>
```

- 在二级子组件中无法获取到name属性，是由于在一级组件中的props获取了父组件的name属性，所以`$attrs`中就会剔除props中的属性
- 往下传递的时候需要绑定`$attrs`才能在下级中获取上级传递的数据，如果只是父子组件无需要绑定，直接使用`$attrs`即可，如果是隔代传递，那么就需要在传递的组件中绑定`$attrs`给子组件使用

### 子组件给父组件传递数据

#### 通过`$emit`

- 在vue中没有明确可以直接通过子组件的什么功能给父组件直接传递数据，而是通过子组件触发父组件的事件，从而传递数据或者是执行方法
- 子组件通过$emit触发父组件在子组件标签上定义的事件，并且调用定义的回调函数
- 此方式触发的事件其实也是组件本身的事件，只不过此事件的回调是父组件中传入的方法而已，由于事件可以传递数据，所以就可以给父组件提供数据

```html
// 父组件
<template>
  <div>
    <Children
    :parent="myName"
    :name="childName"
    @childTouch="handlerChild"
    ></Children>
  </div>
</template>

<script>
import Children from './Children'

export default {
  name: 'Parent',
  components: {
    Children
  },
  data() {
    return {
      myName: 'Parent',
      childName: '子组件'
    }
  },
  methods:{
    handlerChild(name){
      console.log(name)
    }
  }
}
</script>
// 子组件
<template>
  <div>
    <h1>父组件是：{{ parent }}</h1>
    <h1>我是：{{ name }}</h1>
    <button @click="$emit('childTouch',name)">点我触发父组件事件</button>
  </div>
</template>

<script>
export default {
  name: 'Children',
  props:{
    parent:{
      type:String,
      default:''
    },
    name:{
      type:String,
      default:''
    },
  }
}
</script>
```

- 这里子组件`@click="$emit('childTouch',name)"`通过自身的click事件执行$emit方法触发childTouch事件，此事件调用父组件的handlerChild，从而执行父组件的方法，当然这里也可以给父组件的回调方法传递子组件中的数据，那么父组件就能获取到子组件的数据了
- vue建议我们在父组件中执行ajax请求获取数据，然后通过props传递数据给子组件渲染。而如果触发子组件的事件，则通知父组件重新请求数据，这样就可以很明确的分工，而且ajax也只在父组件中存在，如果子组件需要重新获取数据，只需要告诉父组件重新获取数据即可
- 一般子组件只负责触发事件，和渲染数据，父组件就是获取数据和传递数据

#### 通过`$parent`

```html
// 父组件
<template>
  <div>
    <Children1></Children1>
  </div>
</template>

<script>
import Children1 from './Children1'

export default {
  name: 'Parent',
  components: {
    Children1
  },
  data() {
    return {
      childName: 'Children1'
    }
  },
  methods: {
    changeChildName() {
      this.$children[0].name = 'child'
    }
  }
}
</script>
// 子组件
<template>
  <div>
    <h1>我是：{{ name }}</h1>
    <button @click="dispatch">点我修改父组件数据</button>
  </div>
</template>

<script>
export default {
  name: 'Children1',
  data() {
    return {
      name: ''
    }
  },
  methods: {
    dispatch() {
      this.$parent.changeChildName()
    }
  }
}
</script>
```

- 同样也可以在父组件中通过`this.$children[i]`来获取第i个子组件实例，但是通常不建议使用`$parent`与`$children`

## 兄弟组件间的通讯方式(事件总线)

- 兄弟组件间通讯，那就意味着不是嵌套关系，也没有相互引用，那么该如何实现呢
- vue中提供了自定义事件，用来不同组件间的通讯

```html
<template>
  <div>
    <h1>我是：{{ name }}</h1>
    <button @click="dispatch">点我修改父组件数据</button>
  </div>
</template>

<script>
export default {
  name: 'Children1',
  data() {
    return {
      name: 'Children1'
    }
  },
  methods: {
    dispatch() {
      this.$emit('touch', this.name)
      console.log(this)
      this.$off('touch', this.touch)
    },
    touch() {
      this.name = 'child'
      console.log('touch')
    }
  },
  mounted() {
    this.$on('touch', this.touch)
  }
}
</script>
```

- 在这个组件的mounted钩子中会添加一个事件监听器，其中touch是监听的事件，`this.touch`也就是自己定义的回调函数，使用`this.$on`可以用来注册监听的事件
- 通过`this.$emit`触发的事件可以在当前组件的`this.$on`中监听到，且同时触发
- 使用`this.$off`来销毁注册的事件，此方法类似原生的DOM注册以及销毁，但是这有一个前提，就是只有自身emit事件时，如果自身注册监听了相同的事件，那么也会触发自身的事件。简单讲，在同组件下`this.$emit`触发的事件会被`this.$on中相同的事件监听到并且调用回调`
- 由于这限制在了一个组件实例下，那么如何在全局都能使用呢？那么就需要单独创建一个vue实例把它当作全局的事件总线来用，所有需要跨组件的通讯只需要导入这个实例就可以监听到对应的事件
  
看看如何使用事件总线实现兄弟组件的通讯

```html
// 兄弟组件1 注册事件
<template>
  <div>
    <h1>我是：{{ name }}</h1>
  </div>
</template>

<script>
import EvnetBus from './EventBus'

export default {
  name: 'Children2',
  data() {
    return {
      name: 'Children2'
    }
  },
  methods:{
    touch(name) {
      this.name = name
      console.log('touch')
    }
  },
  mounted() {
    // 注册事件监听
    EvnetBus.$on('touch', this.touch)
  }
}
</script>
// 兄弟组件2 触发/注销事件
<template>
  <div>
    <button @click="dispatch">点我修改父组件数据</button>
  </div>
</template>

<script>
import EvnetBus from './EventBus'

export default {
  name: 'Children1',
  data() {
    return {
      name: 'Children1'
    }
  },
  methods: {
    dispatch() {
      // 触发
      EvnetBus.$emit('touch', this.name)
      // 注销
      EvnetBus.$off('touch')
    }
  }
}
</script>
```

- 以上就是使用单独的vue实例来当作事件总线使用，当需要隔组件通讯的时候导入事件总线，注册事件或者触发事件即可
- 由于事件总线其实就是一个vue实例，那么如果都在事件总线中注册和触发事件，这样这个实例就会掺杂很多的事件，而且如果要针对销毁同事件名同回调函数的事件，那么就需要在注册的组件中注销相同的函数，也就是必须传入同一个函数注销

## 全局组件通讯Vuex

- vuex是vue专门用来给所有组件管理状态，一般把所有组件共同使用的数据放在vuex中进行管理，而且还能执行异步操作
- Vuex各个模块
  - state：用于数据的存储，是store中的唯一数据源
  - getters：如vue中的计算属性一样，基于state数据的二次包装，常用于数据的筛选和多个数据的相关性计算
  - mutations：类似函数，改变state数据的唯一途径，且不能用于处理异步事件
  - actions：类似于mutation，用于提交mutation来改变状态，而不直接变更状态，可以包含任意异步操作
  - modules：类似于命名空间，用于项目中将各个模块的状态分开定义和操作，便于维护

```html
// index.js store
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: '',
    age: 0,
    city: ''
  },
  getters: {
    getName(state) {
      return state.name
    }
  },
  mutations: {
    changeName(state, newName) {
      state.name = newName
    },
    changeAge(state, newAge) {
      state.age = newAge
    },
    changeCity(state, newCity) {
      state.city = newCity
    }
  },
  actions: {
    async cAge(context, opt) {
      await context.dispatch('cCity', opt.city)
      context.commit('changeAge', opt.age)
    },
    async cCity(context, newCity) {
      setTimeout(() => {
        context.commit('changeCity', newCity)
      }, 1000)

    }
  },
  modules: {}
});
```

```html
// parent.vue
<template>
  <div>
    <Children1></Children1>
    <button @click="change">改变children2的状态</button>
  </div>
</template>

<script>
import Children1 from './Children1'

export default {
  name: 'Parent',
  components: {
    Children1
  },
  data() {
    return {
      name: 'tom',
      age: 5,
      city: 'fuzhou'
    }
  },
  methods: {
    change() {
      this.$store.commit('changeName', this.name)
    }
  },
  mounted() {
    this.$store.dispatch('cAge', { age: this.age, city: this.city })
  }
}
</script>
```

```html
// children1.vue
<template>
  <div>
    <Children2></Children2>
  </div>
</template>

<script>
import Children2 from './Children2'

export default {
  name: 'Children1',
  components: {
    Children2
  }
}
</script>
```

```html
// children2.vue
<template>
  <div>
    <h1>
      名字：{{ $store.getters.getName }} 年龄：{{ $store.state.age }} 城市：{{
        $store.state.city
      }}
    </h1>
  </div>
</template>

<script>
export default {
  name: 'Children2'
}
</script>
```

- vuex其实就是一个状态管理工具，其中也可以分成好几个仓库用于不同模块状态的管理，在vue根实例中注册store，则在所有的vue子组件中都能共享使用vuex
- 通过vuex中的state保存状态数据、getters中设置计算属性(可缓存)、mutations中定义commit调用的同步方法用于直接修改state的数据、在actions中定义dispatch调用的异步方法，这些方法又可以调用commit修改state、modules可以定义各种模块，也可以使用命名空间来管理不同模块的作用域
- 总之vuex就是一个全局的状态管理系统，可以把公共数据提交到vuex上，再通过mutatuin或者actives来执行同步或者异步更新操作
- 通过`$store.state`来获取vuex中的state数据，通过`$store.commit`来调用vuex中的mutations下的方法更新state数据、通过`$store.dispatch`来调用vuex中的actions下的方法，如果有需要可以在定义的方法中异步获取数据，进一步commit更新数据、如果需要管理不同的状态仓库，那么可以定义多个modules分开管理，当然也可以实现他们之间的数据交互

## WebStorage全局通讯

- 当然也可以通过保存在localStorage或者是sessionStorage中，这样每个组件都能访问到存储的数据

```html
// 父组件
<template>
  <div>
    <Children1></Children1>
  </div>
</template>

<script>
import Children1 from './Children1'

export default {
  name: 'Parent',
  components: {
    Children1
  },
  data() {
    return {
      name: 'tom',
      age: 5,
      city: 'fuzhou'
    }
  },
  mounted() {
    localStorage.setItem('name', this.name)
    sessionStorage.setItem('age', this.age)
    sessionStorage.setItem('city', this.city)
  }
}
</script>
// 二级组件
<template>
  <div>
    <h1>名字：{{ name }} 年龄：{{ age }} 城市：{{ city }}</h1>
    <button @click="getData">从WebStorage中获取数据</button>
  </div>
</template>

<script>
export default {
  name: 'Children2',
  data() {
    return {
      name: '',
      age: '',
      city: ''
    }
  },
  methods: {
    getData() {
      this.name = localStorage.getItem('name')
      this.age = sessionStorage.getItem('age')
      this.city = sessionStorage.getItem('city')
    }
  }
}
</script>
```

- 这种方法是window自带的api用于存储数据到本地，在同页面中都能共享数据

## 总结

- 父组件与后代组件通讯：
  1. 通过`$attrs`传递不在`props`中出现的属性，用于传递的组件需要动态绑定此属性给子组件使用
  2. 通过父组件`provide`对象设置需要传递的数据，后代组件通过`inject`获取需要的数据
  - 父组件与子组件通讯：
    1. 通过`props`对象获取父组件传递的数据
    2. 通过`$children`直接修改/获取子组件的数据
    3. 通过`ref`设置子组件的引用，在使用`$refs.属性值`获取子组件，再对子组件数据进行操作
- 子组件与父组件通讯：
  1. 通过`$emit`触发事件，执行父组件的回调，可以在回调中传递参数数据
  2. 通过`$parent`获取父组件的引用，修改/获取父组件的数据
- 全局组件间的通讯：
  1. 通过事件总线，创建一个vue实例，专门用来组件间通讯，通过`$on`注册事件，通过`$emit`触发事件，通过`$off`注销事件
  2. 使用`Vuex`状态管理，通过Vuex提供的api进行全局状态管理，也可以实现异步操作
  3. 通过`WebStorage`存储页面数据到本地，供所有当前页面下的组件读写数据

全局通讯适用于所有组件间的通讯，父组件与后代组件的通讯方式适应与所有嵌套组件间由父组件传递给后代组件的数据，父子组件间有专门的通讯方式