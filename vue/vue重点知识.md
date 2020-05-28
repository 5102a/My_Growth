# vue重点知识

- 这篇主要统一介绍vue中常见或者是重点，也有些是个人认为比较重要的一些细节方面

## Mixin混入

- mixin可用于抽离复用的代码，当需要使用的时候混入到当前组件中即可，当然mixin中的数据可能与当前组件的数据有冲突的地方，接下来看看mixin是如何混入的

### 组件混入

```vue
// mixin.js
export default {
  data(){
    return {
      name:'jerry',
    }
  },
  methods:{
    getName(){
      return this.name='tom'
    }
  },
  mounted(){
    console.log('mixin-mounted')
  }
}
// myComponent.vue
<template>
  <div>
    名字：{{ name }} 年龄：{{ age }}
    <button @click="getName">点我修改名字</button>
  </div>
</template>

<script>
import myMixin from './mixin'
export default {
  mixins: [myMixin], // 混入数据
  data() {
    return {
      age: 5
    }
  },
  mounted() {
    console.log('myComponent-mounted')
  }
}
</script>
```

![mixin](img/mixin.png)

- 通过结果可以看的确实混入到当前组件中，其实就是把mixin.js中对应数据进行混合，加入到当前组件中，可以看到混入之后的生命周期执行顺序不是嵌套组件那样，貌似所有混入的钩子都在当前组件钩子之前触发，而且并没有覆盖钩子，似乎是进行顺序调用的
- 再看看如果是相同数据和方法会是如何混合的

```vue
// mixin1.js
export default {
  data(){
    return {
      name:'mixin1',
      age:8
    }
  },
  methods:{
    getName(){
      return this.name='tom'
    }
  },
  mounted(){
    console.log('mixin1-mounted')
  }
}
// mixin2.js
export default {
  data(){
    return {
      name:'mixin2',
    }
  },
  methods:{
    getName(){
      return this.age=10
    }
  },
  mounted(){
    console.log('mixin2-mounted')
  }
}
// myComponent
<template>
  <div>
    名字：{{ name }} 年龄：{{ age }}
    <button @click="getName">点我修改名字</button>
  </div>
</template>

<script>
import myMixin1 from './mixin1'
import myMixin2 from './mixin2'

export default {
  mixins: [myMixin1, myMixin2], // 混入数据
  data() {
    return {
      age: 5
    }
  },
  mounted() {
    console.log('myComponent-mounted')
  }
}
</script>
```

![mixin1](img/mixin1.png)

- 从结果中可以看到，如果是多个mixin混入，那么将会取最后一个混入作为数据，当然如果本身组件有这个属性，那么还是以当前组件为主，而且如果是钩子按照混入顺序执行，组件自身相对于最后混入，如果是普通方法则是后混入的覆盖前面的

### 全局混入

- 如果在全局混入那么之后的每个vue实例都会带有混入的数据

```vue
// main.js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import mixin1 from "./views/mixin1";

Vue.config.productionTip = false;
Vue.mixin(mixin1) // 全局混入

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
// myComponent
<template>
  <div>
    名字：{{ name }} 年龄：{{ age }}
    <button @click="getName">点我修改名字</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      age: 5
    }
  },
  mounted() {
    console.log('myComponent-mounted')
  }
}
</script>
```

![mixin2](img/mixin2.png)

- 可以看的这时候虽然myComponent没有单独混入mixin1.js但是由于在全局中混入，所以之后创建的每个vue都带有这些数据
- 如果是插件，那么可以使用`Vue.use(插件)，此时vue会调用插件内部的install，进行混入到Vue中，之后的实例也都带有插件的数据

mixin利弊：

- 利：
  - 可以抽离公共代码，提高代码复用
- 弊：
  - 但是如果很多组件都要混入许多mixin那么就会导致后期的维护问题，不仅变量函数不够明确、不利于阅读，而且多个mixin可以会存在变量覆盖、命名冲突，使用过的的mixin可能出现多对多的关系，复杂度较高

## v-if与v-show

- 相同点
  - v-if与v-show都是控制标签是否显示
- 不同点
  - v-if可以控制标签是否被渲染，也就是是否会生成DOM，如果判断为false，那么则不会被生成VDOM，更不会被生成真实DOM，可以理解成存不存在
  - v-show只是通过简单的控制css的样式，如果是隐藏则设置为`display:none`，如果是显示则去掉这个属性，就像给他增加一个隐藏的`class`一样

![v-if](img/v-if.png)

- 可以看的，此时判断都为false，v-if用注释节点来占位，而v-show直接设置为`display:none`

![v-show](img/v-show.png)

- 此时显示的时候v-if节点渲染出来了，而v-show的display去掉了

这样我们可以得出一个结论：如果是频繁切换的标签或者组件可以使用v-show来控制，如果是大组件，而且不是特别常用，那么可以在需要使用的时候在生成DOM，比如首屏优化的时候一开始用v-if不生成DOM，等需要的时候生成，这样可以提高首屏渲染速度

- 说到这里顺便讲一下css的display与visibale
- `display:none`，则不显示对应的元素，在文档布局中不再分配空间（回流+重绘）
- `visibility:hidden`隐藏对应元素，在文档布局中仍保留原来的空间（重绘）

![display](img/display.png)

选中display，此时页面根本没有出现其位置，也就意味着不存在页面中，不占位置，当需要显示的时候会触发回流和重绘

![visibility](img/visibility.png)

选中visibility可以看到页面中存在这个元素，当需要显示的时候只会触发重绘

这样一看visibility类似v-show，display类似v-if，同样道理根据元素切换的频率来使用这些属性，如果是首页也可以根据这些特性进行优化加载

## v-if与v-for使用时机

- vue不推荐我们同时在一个元素中使用v-if与v-for，由于v-for的渲染优先级高于v-if，所以只会等到v-for把元素都渲染出来才会再进行v-if判断，这样一来导致了重复的v-if判断，其中尽量都要绑定唯一key值，这样在每次diff计算中可以优化性能，减少对比次数
- 如果一定要使用，那么请把v-if放在v-for循环的父元素上，这样一开始就能进行判断是否渲染，或者放在循环之内，用于内部元素判断是否渲染

## computed与watch

- computed是计算属性，它的特点就是可以缓存，如果数据不变则它返回的结果也不会改变，可以提高性能
- watch是监听数据的变动，当数据改变时就会触发对应的回调，传入参数就是新旧数据，这里有一点需要注意，如果监听的是引用数据，那么新旧参数是指向同一个内存地址，是获取不到旧值的，而值类型数据可以，watch不能使用箭头函数，因为那样获取不到this指向不了vue实例，如果需要watch可以开启深度监听，即设置deep属性为true则可以监听对象内部深层数据的变动

computed主要用来那些可以缓存，且经常读取的数据，watch用于监听那些经常改变，而且改变时需要做出操作的数据

## 事件

- 当事件需要传递而外参数时，则需要手动传递`$event`，如果不写参数默认会传这个事件对象
- vue中可以使用事件修饰符来修饰事件，达到不同的效果，也就是类似原生事件的一些方法，如下
  - .stop // 停止事件传播
  - .prevent  // 提交事件不在重载页面
  - .capture  // 使用事件捕获，即内部元素触发的事件先在此处理，然后才交由内部元素进行处理
  - .self // 只当在 event.target 是当前元素自身时触发处理函数
  - .once // 事件将只会触发一次
  - .passive  // 滚动事件的默认行为 (即滚动行为) 将会立即触发
  - 不要把 .passive 和 .prevent 一起使用
- 当然还包括一些按键修饰符等

## v-model

- 双向绑定数据，用于表单元素绑定value的值
- 修饰符：trim去掉两边空格、lazy输入不会立即同步显示、number只能输入数字

### 自定义v-model

- vue2.2.0新增可以自定义v-model绑定的事件以及属性
- 通过model来设置绑定的prop与event

```vue
// 父组件
<template>
  <div>
    请输入<span>{{ text1 }}</span>
    <Children1 v-model="text"></Children1>
  </div>
</template>

<script>
import Children1 from './Children1'

export default {
  components: {
    Children1
  },
  data() {
    return {
      text: '55'
    }
  }
}
</script>
// 子组件
<template>
  <div>
    <input
      type="text"
      :value="text1"
      @input="$emit('change', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  model: {
    prop: 'text1',
    event: 'change'
  },
  props: {
    text1: {
      type: String,
      default: ''
    }
  }
}
</script>
```

父组件可以通过v-model绑定子组件中的input触发的事件以及改变的值，在子组件的我们自定义绑定的事件以及属性，重点是在model对象以及触发事件时调用`$emit`