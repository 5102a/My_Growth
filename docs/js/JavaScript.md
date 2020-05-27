# JavaScript基础

## 一、js 介绍

* 轻量级脚本语言
* 嵌入式、对象模型语言
* 依靠宿主环境提供的 api 来运行在浏览器、服务器
* 具有标准库，对象模型如 Array、Date、Math
* 制作网页特效
* 服务端的开发、命令行工具 Node.js
* 桌面程序 Electron
* 做 App Cordova
* 物联网 Ruff
* 游戏开发 Cocos2d-js

## 二、js 在网页中引入

1. 行内式：`<input type="button" onclick="alert(112)">`
2. 内嵌式：写在\<script>js 代码\</script>中
3. 外链式：链接 js 文件\<script src="./index.js">\</script>,用外链就不能在 script 标签中填写 js 代码，填了也无效

* js 文件一般加载在后面，在前面会网页加载影响速度
* js 代码由浏览器解析执行

## 三、常量

* const 关键字声明常量，同作用域不能改（不同作用域可重新定义），常量为地址，引用可改
* 声明的常量如果是对象（引用类型，即内存地址不改变），则其对象属性可以改变，但对象不能改
* Object.freeze(常量名)，此静态方法可以锁定常量，即使常量为对象也不能改变其内部的值

## 四、变量

### 变量 tap

* 变量是存储数据的容器
* 没返回值和形参没传值都为 undefined，声明没赋值 undefined，没定义类型为 undefined
* 内部声明与外部不同值
* 变量不声明去上级查找
* let 声明的变量和 const 声明的常量在同作用域下重复声明会报错
* 全局变量保存在 window 对象下，可在任何地方访问
* var 在全局作用域下声明的变量为全局变量，在局部作用域 var 声明的变量会覆盖值
* 有声明没定义为 undefined，没声明没定义会报错

### 可变变量

* ...arrs 可变变量,长度随传入实参改变，接收变量 arrs 为数组，可以赋值也可以被赋值，左聚集右展开
* 结构语法：[name,year]=arr（数组、对象）,快速赋值，需声明，可用逗号占位取指定值[name,...arr],左吸，右散，可设默认值[name=111,age],批量赋值

### 变量命名规则

* 变量命名规则，可用数字、字母、下划线、\$组成，且不能以数字开头，不能为关键字
* 变量命名要有意义，用英文，区分大小写
* 变量尽量用驼峰法命名，除第一个单词后的单词首字母大写 eg：userName

### 变量类型

* 变量类型：数值、字符串（多用单引号，内引号用双引或者转移\'）、布尔、undefined、null、对象

### 变量赋值

* 只声明没赋值的变量为 undefined，null 为空
* 多个变量同时赋值

#### 变量提升

* js 会先解析，把声明的变量和函数提到最前面（变量提升），再运行赋值
* let 声明变量，必须声明之后才能使用，不提升，同作用域必须在使用前即使重复定义，let 声明的变量不会保存在 window 下

## 五、字符串

### 字符串 tap

* html 中输出字符串如果有转义会有一个空格
* 字符串.length 获取字符串长度
* 拼接字符串用+

### 新版字符串

* 新版字符串可用\`\${变量、表达式}\`，\`\${a}哈哈\`，可调用 js 函数，类似 php 定界符,模板字面量，标签模板
* 新版 includes（字符，序号）返回 bool，indexOf 返回-1 找不到

### 字符串操作函数

* slice 截取相应位置到之后字符串同 substring
* substr 起始位置到指定个数
* trim（）去字符串 2 端空格
* startsWith 判断起始字符
* replace 替换字符串
* repeat 重复字符串

## 六、Boolean 类型

* Boolean 型 值 true、false
* 和 bool 比较会转成数值比较，false-0，true-1
* 引用（即使空）为真
* 0 和''为假
* ！！可检测转为 bool 类型的结果

## 七、数据类型 tap

* 复杂数据类型 对象 Object

### 类型转换

* 检查类型用关键字 typeof 变量
* 变量.toString（），转为字符串，或用 String（变量），字符串与其他变量拼接完会自动转成字符串
* Number（变量） 转为数值型 ，无法强制转换的将转成 NaN（非数值）
* parseInt（变量） 转成整型数值，无法强制转换的将转成 NaN（非数值）
* parseFloat（变量） 转成浮点型，无法强制转换的将转成 NaN（非数值）
* 强制转换成数值型，如果是数值开头，则只转换数值部分 Number（1.22.2）==1.22
* Boolean（变量） 转布尔型 ，'0'为真,''为假,0 为假，null 假，undefined 假；字符串中无内容则为假，有内容为真
* 数组.toString()转字符串，字符串通用，join 指定符连接成字符串

## 八、操作符

* 一元操作符为只有一个操作数，几个操作数为几元操作符
* 一元操作符，++，--
* %、/、+、-、&&、||、！、>、<、等
* ===全等、！==不全等，值和类型都对比，==、！=只对比值自动转换
* 赋值运算符，=、+=、-=、/=、%=；等同与：变量=变量+值(变量+=值)
* 三元运算符 表达式 ? 代码 1 : 代码 2 ;表达式为真运行代码 1，反之代码 2
* 短路特性，满足条件直接返回不会继续判断后面，a||2 可当作函数默认值
* 三元表达式，不能不写参数，php 可以

## 九、运算优先级

* 优先级从上到下

1. （）
2. 一元，++、--
3. 算数运算符\*、/、+、-
4. 关系运算符>、<
5. 相等运算符==、===、！==、！=
6. 逻辑运算符 先&& 后||
7. 赋值运算符 =

## 十、循环

### if for while switch do while 等同 c 语言

* continue 跳到下一轮循环
* break 跳出循环
* 标签跳转点

```js 代码
switch(值){
  case 值1：
  代码
  break;
  default:
  代码
  break;
}
```

### 引用类型循环

* for（key in arr/object），遍历键
* for（value of object/arr/str）遍历值，迭代
* for（of）也可遍历 dom 返回的元素集，遍历一个个元素

## 十一、数组

### 数组操作

* lastIndexOf 从后开始查找，新版 includes（元素），返回 bool，第二参数为查找起始位置
* copyWithin(到位置，开始，结束元素)
* pop 返回删除的值，unshift 前入，shift 前删除
* 填充元素 arr.fill(值，位置 1，位置 2)
* slice（开始，结束），截取数组生成新数组不填参数重新生成新数组
* splice（开始，截取几个，替换值）改变原数组，也可增加删除
* 清除数组至[]（指向空内存，原内存还在）或者 length=0（改变原数组值）
* arr.concat（arr1）连接数组==arr=[...arr,...arr1]
* arr.push（...arr1）合并，改变数组值，返回数组长度
* str.split（）拆分成数组
* Array.from 可转数组，有长度能转，dom 获取也可转，第二参数可操作元素
* 展开语法：arr=[...arr1,...arr2]合并数组，...arr 转数组
* slice 截取相应位置到之后字符串同 substring
* substr 起始位置到指定个数
* trim（）去字符串 2 端空格

### 数组声明

* 数组属于引用类型，赋值给不同变量属于同一地址，影响改变
* var arr=['a','b']
* var arr=[],数组.length 获取数组长度
* 多维数组 arr=[1,2,[5,'5']],可为多类型
* 数组通过索引来取值 arr[2][1]=='5';
* 创建数组 new 只填一个值为长度
* 新版 Arrat.of(6),为赋值不同 new

* 数组也是对象，instanceof 判断原型链可以判断数组 Array/Object
* 数组可存储对象
* 没赋值的数组值为 empty（undefined），长度不变

### 遍历数组用 for 循环

```js 遍历数组
for(var i=0;i<arr.length;i++){
  console.log(arr[i]);
}
```

## 十二、函数

* 传值、传址：（传址，大数据类型）引用类型变量传地址不开空间，传值（小数据类型）开辟空间
* arguments，传入参数集

### 箭头函数（新版）

* function（参数）{}等价于（参数）=>{}，可少填参数（如果没用到自带 return）
* 用箭头函数 this 指向父对象，方法内用 function，中的 this 指向 window

### 函数作用域和保留

* 全局环境不会被回收，php 超全局
* 函数内部声明的变量只能函数内使用，运行后清除
* 函数有被外部使用则保留
* 全局函数，压入 window 中，let 不会

### 函数声明

* fun=new Function（参数，内容）
* var 函数名=function（参数）{代码}，表达式声明
* function 函数名（参数）{代码}，此为关键字声明

### 立即执行函数

* 解决命名冲突使用 立即执行函数
* 立即执行函数控制作用域（可随意定义变量），防止全局变量污染

### 函数封装

* 把具有特定功能的代码封装起来，形成一个独立的实体

### 函数 tap

* 调用：函数名（参数）
* 函数返回值,没 return 返回为 undefined，有 return 没写返回值也返回 undefined

  ```js 返回值
  function f(形参){
    代码
    return 返回值;
  }
  var rr=f(实参);
  //rr==返回值
  ```

* 函数名和变量名相同，则函数声明会替换变量声明，如果谁先赋值则为谁

### 匿名、闭包、自调用函数

* 匿名函数，没有函数名
  `var fun=function(){}`，定义的变量即为函数本身 fun（）
* 自调用函数`(function(){})()`定义声明完直接执行，立即执行函数，自调用匿名函数，防止全局变量的污染，封装一个局部作用域
* 函数也可当参数使用，函数也是一种数据类型，对象（函数、数组），回调
* return 可返回一个函数，返回一个内部定义的函数，闭包

## 十三、对象

* event.target 指向触发控件

* call 和 apply 差别

  * 构造函数（对象）.call（对象），call 参数为多个参数，apply 参数为数组，立刻执行，可改变 this
  * bind 返回新函数，其他类似 call，不立即执行，bind 也可以传上级 this

  * 对象独立空间不释放

* delete 对象.属性，删除属性

* 对象中同名属性覆盖

* 结构赋值{name，age}=object，传参也可以{random}=Math，获取 random 函数们获取一部分，严格模式要声明，数组要对应位置取

* 属性和值一样可以写一个

* {name，age：{对象}}={name：hh，age：{对象}}

* 没值可以使用默认值

* hasOwnProperty 查看当前自己是否有对应属性，用 in 可以检查到父级属性

* setPrototypeOf（a，b）设置 a 的原型 b，父级

* object.assign（对象 1，对象 2）合并对象属性生成新对象

* 对象的对象赋值是引用，赋值为对象深拷贝

* 复制对象（一样新对象）浅拷贝

* 拷贝时属性值为数组也要判断

* 工厂函数（类似构造）

* 构造函数首字母大写，构造用 new，系统自动返回 this

* 严格模式下 window 的 this 会 undefined

* 构造函数内 let 声明对象，定义对象属性和值，其他属性访问内部属性值，外部无法修改

* getOwnPropertyDescriptor()查看对象属性特征

* defineProperty 新增属性格特征

* writable 是否可写、enumerable 是否可遍历、configurable 是否可删除、value 值、严格模式会报错

* preventExtensions 保护对象不能添加属性

* seal 封闭对象，禁止操作

* isSealed 判断对象封闭状态

* 冻结 freeze 都不能操作、isFrozen 判断冻结

* 关键字 set 属性名（参数）{}，设置访问器，控制存入数据的范围

* 关键字 get 属性名（）{}，设置访问器，获取时指定返回数据

* 可以设置伪造属性，设置读取返回数据可以是函数，不一定是属性

* 批量设置属性，还是伪造属性通过函数控制数据的读写操作，访问器优先级高于普通属性

* new Proxy（）代理对象，通过代理来规定访问数据，也能代理数组

* JSON.stringify（第二参数保留属性，第三参数格式）转字符串 JSON.parse 转 json 对象，数组也可以转 json 字符串，toJSON 自定义方法序列号对象，可自定义回调函数

* 原型（父亲）类似继承

* Object.create（父亲（原型），属性）创造对象

* 方法放在原型，不要放在构造函数里

* 不能乱添加原型方法

* 对象.\_\_proto\_\_设置原型，也可以查看（非标准）如果右边是对象可以赋值其他无效，访问器

* 对象原型Object.prototype的Object.prototype.\__proto__指向null
![img](./img/25.png)

* 用 set/getPrototypeOf（）创建查看原型

* 原型继承不是改变构造函数的原型

* class 声明类

* 类中声明发放不需要逗号

* constructor（）函数，自执行（构造函数）

* 类就是构造函数，语法糖

* 类中定义的方法自动放在原型中

* class 自动设置原型方法不可遍历

* 类中声明的方法默认是严格模式

* 分配给构造函数的属性是静态属性

* 给类设置静态属性，给所有对象设置默认属性，只保存一份在类中

* 方法放原型，属性用构造函数生成自定义属性

* 静态方法，定义在构造函数中的方法，在构造函数中，也可以定义在对象原型中（定义在构造函数的原型中的方法，静态方法）

* class 中用 static 声明的方法是静态方法

* 通过构造函数的方法创建对象用静态方法，对多个对象操作

* 访问器，对数据获取设置都经过函数处理

* 属性保护\_开头的属性，规定为私有属性

* 使用[Symbol 类型]设置属性名为私有，子类可以使用外部不可使用，this[Symbol].属性名

* extends 继承关键字

* 使用 WeakMap.set 保护属性 get 获取，通过 WeakMap 保存属性

* #属性名，设置为私有属性只能自己访问

* super（）父级构造函数，原型攀升

* 类的方法在原型上

* 声明了 constructor 要用 super，且要写在 this 前，没声明默认

* 重写方法，直接写同名方法优先使用子方法

* 静态方法不能有对象数据，公用方法

* 函数也是对象

* 排序 sort（function（a，b）{return b-a}）（1 大到小）

* arr.forEach（function（item，index，arr）{}）

* 迭代器：arr.kes(),arr.value(),返回 key/value，bool（是否已迭代）

* 迭代器.next()下一个

* arr.entries（）是 key 和 value 的综合

* arr.every（function（item，index，arr）{}），返回全为真才为真，可同时判断数组值

* arr.some（function（item，index，arr）{}），一个为真就为真

* arr.filter（function（item，index，arr）{}）返回真则返回原数组，假不保留

* arr.map（function（item，index，arr）{}），返回什么新数组值就为什么

* 新增 arr.reduce（function（pre，value，index，arr）{}，pre 的初始值），pre 为每上次遍历返回值，最后在返回，可做筛选

* find（function（item）{}）遍历每个元素

* 比对地址查找，不能直接查找对象，只能遍历属性对比属性值

* apply 指定形式传参

* 抽象为类，具体为对象

* 对象的特征为属性，行为为方法（值 函数），键值对，值为数据和函数

* 声明空对象 var obj={}，字面量声明

* var obj={age:12,height:140,play:function(){}},值不为函数则为属性，值为函数则为方法

* 实例化方式声明对象（内置构造函数） var obj=new Object（）

* 自定义构造函数 function fun（）{}；var f=new fun（）；

* 获取对象属性或方法：对象.属性名；obj.age、obj.play()调用

* this 指向

  ```js this
  var obj = {
    name:12,
    fun:function(){
      //在方法中this指向这个方法所在的对象obj
      var a=this.name;
    }
  }
  //函数
  function f（）{
    //普通函数也有this.a（undefined），不过this指向对象
    //this指向全局对象，关键在this指向哪个对象，this向前寻找最近对象，同冒泡寻找
    //**this被谁调用就指向谁（对象），并未在谁下面而是被谁调用**
    console.log(this.a);
  }
  ```

### 遍历对象和删除

* for in；for（键 in 对象）{console.log(对象.键)}；for in 可遍历对象和数组
* 删除属性：delete 对象.属性名

### 包装对象

* 原始类型：数值、字符串、布尔
* 原始类型的数据在一定条件下可自动转换为对象，此为包装对象
* 原始值可用自动当作对象调用，可用调用属性和方法，包装对象使用完会立即销毁
* var a='aaa'；a.length（调用 length 时会创建一个对象用完立即销毁）

### 标准库对象（内置对象）

* time（），timeEnd（）计算经过时间
* console.table 表格形式展示
* Math 对象
  * .abs()绝对值
  * .random()返回随机数[0-1);取指定范围随机数：random()\*(范围最大值-范围最小值）+范围最小值；.float(随机数)
    取整
  * .float()向下取整
  * .ceil()向上取整
* 时间对象 Date
  * var da=new Date（）；先获取对象
  * da.now();返回时间戳毫秒数 Date.now（）
  * da.getHours()、da.getDate（）获取时间是计算机本机时间，月份从 0 开始到 11
* 数组对象 Array
  * var arr=[1,2,3];获取长度 arr.length
  * 插入值 arr.push(4);插入最后面，改变数组
  * 删除值 arr.pop();自动删除最后一个值
  * 删除数组 返回新删除后的数组不改变之前数组 var arr1=arr.slice(2,5)不包括 5
  * arr.concat(数组 2)，链接数组不改变之前数组，返回新数组
  * arr.join(分隔符)，返回新数组用分隔符分开各值
* 字符串对象 String
  * 搜索字符串中指定字符：s='gfdgf1';s.indexOf('f')==1
  * s.substr(2,2);从第 2 个开始取 2 个字符=='dg'
  * 全部转小写：var str=s.toLowerCase();返回新串不改变原串
  * 全部转大写：var str=s.toUpperCase();返回新串不改变原串
  * 替换字符串：s.replace(原字符,替换后字符),返回新串
  * trim（）删除前后空格
* Moment.js 时间库
* valueOf 取值，toFixed 保留小数位数

## 十四、作用域

* 全局作用域（函数外部），局部作用域（函数作用域，定义在函数内部的变量）
* 只有函数才能制造作用域，每个函数独立作用域嵌套函数形成作用域链，层层往前递推寻找定义，如果都没有会报错
* 用{}，也可以形成块作用域，用 let 定义
* 块作用域用 let 不会影响全局变量，for 循环 i 会影响

## 十五、注释

* 注释用//内容 或 /\*内容\*/

## 十六、代码规范

* 缩进；平级不缩进，下级缩进
* 括号位置
* 空格分隔
* 分号：可加可不加，建议不分号，一句结束换行即可，压缩工具会自动添加分号

## 十七、ES6+新增

### js新增

* 唯一特性，let a=Symbol（）类型（特殊字符串），不能压入，a.description()描述，Symbol.for（’sss‘），只定义一个 Symbol 可以重复使用，获取 Symbol.keyFor(变量)描述，**对象属性名用变量要[变量名]**
* 遍历 Symbol，Object.getOwnPropertySymbols（），Symbol 属性普通遍历不出来
* let set=new Set（），set 类型属性不能重复，对象属性名都会保存为字符串，对象属性名为对象时要用 toString 取属性值
* Set（’vjnk‘）会展开字符串保存，set.has（）判断是否存在
* Set.delete()删除，Set.clear()清空
* array 转 set 可以自动取重再转回来
* set.values（）、keys（）、entries（），add（）同对象
* 遍历 set.forEach(),values==key
* new Set([...a,...b])去重，看交集并集
* new WeakSet（引用），不能重复，必须是引用类型，delete、has 方法
* WeakSet 弱引用，没引用地址系统垃圾回收，用 add（）不会增加引用为弱引用，不能循环遍历没 values、keys、entries 等，过一段时间自动清理弱引用
* new Map（），属性名可以为任何类型
* map.set(),map.get(),map.delete(),map.clear(),map.has()
* keys(),values(),entries(),可用 for 遍历，forEach
* WeakMap（），Map 键为对象

## 十八、严格模式

* use strict 严格检查模式
* 严格模式 use strict，必须声明才能用不能直接赋值变量，严格模式会对本作用域和子作用域有影响

## 十九、模块

* 模块化
* define（）定义模块，在自执行函数中
* 模块一开始就初始化，使用初始化的结果
* export 数据，导出模块内容，使用模块 import {数据} from "模块"，使用模块，不导出时私有的
* script type=“module”，模块一开始就全部加载，后解析，模块默认严格模式，只解析一次
* 模块有独立作用域
* 导出函数要有名字
* import \* as api from “模块”，全部导入，建议用声明导入什么
* 数据名 as 别名，模块别名
* 默认导出，export default ，export {数据 as default}，在模块中只能有一个，不在{}中的就是默认导出
* 默认导出模块命名为文件名
* 多模块导出，用分组导出，中间导入模块，静态加载要放最前面
* import（‘模块’）.then（需要的接口）动态加载，新版
* webpack，把高版本模块编译成低版本兼容

## 二十、正则表达式

* 正则表达式字符串的增删改查
* RegExp（匹配字符，模式）
* 正则.test(字符串)
* 选择符，表达式 1 |表达式 2，满足一个
* （）元字组，组匹配，[\d]元字表只匹配其中有的一个类型（可选），加^表示不要
* \d+匹配一个或多个数值，\d 表示包含数值，.除换行外任何字符，\\.转义为.,在字面量中可以，字符串中不行要再转义，/表达式/
* ？表示 0 或多个，^表示起始匹配，\$表示结束匹配，限定字符串
* match（正则表达式）字符串的匹配[a-z]{3.6}匹配字母 3-6 位
* g 模式匹配全部，s 模式视为单行匹配，i 模式不区分大小写，m 模式每一行单独处理，模式可以组合使用/gis 顺序无关，\D 除了数字
* \s 匹配空白，大写为反情况，\w 字母数字下划线，\*为 0 个或多个
* \p{L}匹配属性为 L 的（字母，P 标点符号，{sc=Han}匹配汉文），u 模式匹配属性
* 宽字节用 u 模式
* 正则表达式.exec(字符串)可以匹配到每个属性，循环匹配，g 模式才会继续下一个属性 index，g 模式会继续 index，y 模式要连续满足条件 index 不满足重置
* （）元字组后面要用一样的匹配用\n，n 表示第几元字组
* []中的（）和.就表示本意，外面表示元字组
* （？：）不计入元字组序号
* \*，+尽可能多个，{}尽可能多匹配，贪婪匹配
* ？禁止贪婪，尽可能少匹配，+？、\*？、{2，}？
* 元字组可以一起拿...
* 元字组取别名（？<名字>），使用时\$名字，groups 就会有值

### 字符串方法

* search 返回 index 无返回-1
* match 匹配返回全部内容，只匹配一个会返回相关属性
* matchAll 返回迭代器，获取所有的
* split（拆分符），拆分成数组
* replace（字符串，替换），\$1 第一个元字组， \$`替换匹配左边，\$'匹配右边，\$&匹配内容
* splice（，）截取
* repeat 重复字符

### 正则方法

* 正则.test 匹配返回 bool
* 正则.exec 返回一个带有属性，可配合循环
* 断言，匹配内容（？=后面内容）匹配对应后面有指定内容的那一个，不是组
* 零宽后行断言（？<=前面内容）匹配内容,断言不算匹配内容，算匹配条件
* 零宽负向先行断言，匹配内容（？！后面内容），匹配后面不是什么
* 负向后行断言，（？<!前面内容）匹配内容，前面不是什么

## 二十一、任务、队列

* 宏任务先执行主线程完才会执行任务队列
* onload=function 加载完执行
* 微队列 Promise 对象 pending 准备阶段 reject 拒绝 resolved 成功
* 处理方法,Promise.then（function（）{}）
* 微任务优先集高于宏任务，可以有多个微任务
* setTimeout 准备执行的任务宏任务
* Promise 的回调函数发送成功（resolve（））才会进入微任务，msg，error
* Promise（解决情况 f）要有 then（成功，拒绝）方法，不可撤销
* then 对 Promise 状态改变处理，返回上一个 Promise
* 默认返回成功解决，成功的回调信息是下一个 then 的值，一一对应 Promise 状态没改变不会处理
* 如果 then 返回普通对象，则下面的 then 也返回对象，类对象也可以封装成 Promise
* 封装函数返回 Promise
* .catch(错误处理)可以统一处理错误，一般放最后，也可单独写 error 处理
* 同步可以直接抛错误，异步需要返回错误对象再处理
* finally（fun）无论成功失败都会执行
* Promise 异步加载图片
* Promise.resolve 成功
* Promise.reject 失败
* 批量处理 Promise.all（Promise1，Promise2）一次获取多个结果，
* Promise.allSettled 只返回正确
* Promise.race 返回快的那个
* 队列，每次返回新的 Promise，下一个依赖上一个状态改变
* async function Promise 的语法糖默认 resolve
* await 返回的内容（也可以是 Promise），then 的语法糖
* await 要放在 async 函数里
* try catch 处理完错误才会继续运行
* 并行，多个 Promise 可以同时执行，只是 await 没改变，哪个先改变哪个先处理
* await Promise.all（1，2）同时执行一并处理
* 主线程（同步代码），队列（异步）、微任务、宏任务
* 定时器最少 4ms
* 定时器模块，主线程运行定时器时已经开始计时，定时器队列按定时器时间排序
* 队列任务再主线程执行数据共享，闭包
