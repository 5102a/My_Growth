# JS对象方法

### 对象检测方法
1. **obj.hasOwnProperty(prop)返回boolean**，prop：要检测的属性的 String 字符串形式表示的名称，或者 Symbol。指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）
2. **prototypeObj.isPrototypeOf(object)返回boolean**，测试引用对象是否存在于参数对象的原型链，与instanceof不同，object instanceof AFunction中，object 的原型链是针对 AFunction.prototype 进行检查的
3. **obj.propertyIsEnumerable(prop)返回boolean**，检测对象指定的属性是否可枚举
4. **Object.is(value1, value2)返回boolean**，判断两个值是否是相同的值，不会隐式转换
5. **Object.isExtensible(obj)返回boolean**，判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）
6. **Object.isFrozen(obj)返回boolean**，判断一个对象是否被冻结
7. **Object.isSealed(obj)返回boolean**，判断对象是否被密封(不可扩展 ，且所有自身属性都不可配置且因此不可删除（但不一定是不可写）的对象
### 对象属性查看方法
1. **Object.values(obj)返回对象的所有可枚举属性值的数组**，值的顺序与使用for...in循环的顺序相同 ( 区别在于 for-in 循环枚举原型链中的属性 )
2. **Object.keys(obj)返回对的所有可枚举属性的字符串数组**，排列顺序和 for...in 循环遍历时顺序一致 
3. **Object.entries(obj)返回给定对象自身可枚举属性的键值对数组**，其排列与 for...in 循环遍历时顺序一致 
4. **Object.fromEntries(iterable)返回一个由该迭代对象条目提供对应属性的新对象**，把键值对列表转换为一个对象，参数：可迭代对象，类似 Array 、Map历时返回的顺序一致（区别于 for-in 循环还会枚举原型链中的属性），浅拷贝
5. **obj.toString()返回表示该对象的字符串**，[object Object]
6. **object.valueOf()返回该对象的原始值**
7. **obj.toLocaleString()返回对象的字符串表示**，方法被用于派生对象为了特定语言环境的目的（locale-specific purposes）而重载使用
8. **Object.getOwnPropertyDescriptor(obj, prop)返回指定属性描述对象**，返回指定对象上的一个自有属性对应的属性描述符，prop目标对象的属性名
9. **Object.getOwnPropertyDescriptors(obj)返回对象的所有自身属性描述符**，用来获取一个对象的所有自身属性的描述符
10. **Object.getOwnPropertyNames(obj)返回对象的所有属性名字符串组成的数组**，返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组
11. **Object.getOwnPropertySymbols(obj)返回对象所有Symbol属性的数组**
12. **Object.getPrototypeOf(object)返回对象的原型**，返回指定对象的原型（内部[[Prototype]]属性的值），没有则null
### 对象属性操作方法
1. **Object.assign(target, ...sources)返回目标对象**，用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象，浅拷贝
2. **Object.create(proto[,propertiesObject])返回新对象，带有指定原型对象和属性**，参数1：新对象的原型，参数2：要定义其可枚举属性或修改的属性描述符的对象
3. **Object.setPrototypeOf(obj, prototype)返回这个对象**，设置一个指定的对象的原型 ( 即, 内部[[Prototype]]属性）到另一个对象或  null
4. **Object.preventExtensions(obj)返回不可扩展对象**，让对象变的不可扩展，也就是永远不能再添加新属性
5. **Object.freeze(obj)返回冻结的对象**，冻结一个对象。一个被冻结的对象再也不能被修改
6. **Object.seal(obj)返回被密封的对象**，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变
7. **Object.defineProperties(obj, props)返回参数对象本身**，在一个对象上定义新的属性或修改现有属性，并返回该对象，参数2：要定义其可枚举属性或修改的属性描述符的对象
8. **Object.defineProperty(obj, prop, descriptor)返回参数对象**，参数2：定义或修改的属性名，参数3：对应的属性描述符。直接在一个对象上定义一个新属性，或者修改一个对象的现有属性
### 对象原型方法
1. obj.hasOwnProperty()
2. prototypeObj.isPrototypeOf()
3. obj.propertyIsEnumerable()
4. obj.toLocaleString()
5. obj.toString()
6. object.valueOf()
