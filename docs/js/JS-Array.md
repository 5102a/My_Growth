# JS数组方法

## 数组增删改

1. `Array.of(...items)返回新数组` 将参数中所有值作为元素形成数组
2. `arr.push()`数组尾部添加，`arr.pop()`尾部取出，`arr.shift()`首端取出，`arr.unshift()`首端插入
3. `arr.splice(pos,deleteCount,...item)返回被修改的元素，会改变原数组`从pos开始删除deleteCount个元素，并在当前位置插入items
4. `arr.slice(start,end)返回新数组，浅拷贝`，将start到end(不包括end)的元素复制进去，并返回
5. `arr.concat(...items)返回新数组`，复制当前数组的所有元素，并添加items的元素
6. `arr.copyWithin(pos[, start[, end]])浅拷贝，返回改变后的数组`，复制从start到end(不包括end)的元素，到pos开始的索引
7. `arr.fill(value[, start[, end]])返回修改后的值`，从start到end默认length，填充val

## 搜索元素

1. `arr.indexOf(item[,pos])`从pos开始搜索item，搜索到返回索引，没找到返回-1。`arr.lastIndexOf(item[,pos])`,位置从后面开始计算
2. `arr.includes(val)`如果数组有val，返回true，否则false
3. `arr.find(callback(element[, index[, array]])[, thisArg])`通过func过滤元素，返回使func为true的第一个值。
4. `arr.findIndex(callback(element[, index[, array]])[, thisArg])`类似find，返回索引，不是值,没找到返回-1
5. `arr.filter(callback(element[, index[, array]])[, thisArg])`返回使func为true的全部值

## 遍历元素

1. `arr.forEach(callback(currentValue [, index [, array]])[, thisArg])`对每个元素调用func，不返回任何值
2. `arr.entries/keys/values()返回新的数组迭代器对象`，该对象包含数组中每个索引的键/值对[key,val]/[key]/[values]，可用next()遍历，value()查看值
3. `arr.every(callback(element[,index[,array]])[, thisArg]))返回boolean`，callback(element[,index[,array]])为测试数组元素的函数,el为测试当前值，index为当前索引，array为调用的数组本身。如果每次回调函数都返回true则函数返回true，否则false
4. `arr.some(callback(element[, index[, array]])[, thisArg])返回boolean`，类every，只要一个通过测试则返回true

## 转换数组

1. `arr.map(function callback(currentValue[, index[, array]])[, thisArg])`根据调用func的返回结果创建新数组
2. `arr.sort([compareFunction])`对数组进行原位（in-place）排序，然后返回，func参数arg1：第一个比较的元素，arg2：第二个比较的元素
3. `arr.reverse()`原位反转数组，然后返回
4. `arr.join([separator])`将数组转换为指定分隔符连成的字符串并返回，默认用','
5. `arr.reduce/reducnRight(callback(accumulator, currentValue[, index[, array]])[, initialValue])返回函数累计处理的结果`通过对每个元素调用func，计算数组是的单个值，并在调用之间传递中间结果。accum累计器累计回调的返回值; 它是上一次调用回调时返回的累积值，或initialValue(初始accum的值，如果没有则用数组第一个元素)。
6. `Array.isArray(arr)`检查arr是否为数组
7. `Array.from(arrayLike[,mapFn[,this.Arg]]) 返回新数组,浅拷贝`，将类数组对象或可迭代对象转化为数组,第二参数：用于对每个元素进行处理，放入数组的是处理后的元素。第三参数：用于指定第二参数执行时的this对象
8. `arr.flat([depth])返回新数组`，depth维数组转一维
9. `arr.flatMap(function callback(currentValue[, index[, array]])[, thisArg]))`对flat的转换有回调函数的处理
10. `arr.toString(function callback(currentValue[, index[, array]])[, thisArg])返回字符串`，数组转字符串
11. `arr.toLocaleString([locales[,options]])返回数组元素的字符串`，locales为带有BCp 47语言标记的字符串或者字符串数组，options为可配置对象，对于数字 Number.prototype.toLocaleString()，对于日期Date.prototype.toLocaleString()

## 属性方法

1. `arr\[Symbol.iterator]()默认与values()的返回值相同`
2. `Array[Symbol.species]返回数组的构造函数`

## Array构造函数的方法

1. Array.of(...items)
2. Array.isArray(arr)
3. Array.from(arrayLike[,mapFn[,this.Arg]]) 
4. Array[Symbol.species]

## 会影响原数组本身的方法

1. pop()
2. push()
3. shift()
4. unshift()
5. sort()
6. reverse()
7. splice()
8. copyWithin()
9. arr.fill()

<Vssue title="JavaScript issue" />