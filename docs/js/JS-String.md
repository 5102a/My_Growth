# JS字符串方法

## 字符串查找

1. `str.charAt(index)从一个字符串中返回指定索引的字符`，index介于0-length-1
2. `str.endsWith(searchString[, length])返回boolean`，判断当前字符串是否是以另外一个给定的子字符串“结尾”的，length：作为 str 的长度。默认值为 str.length。
3. `str.includes(searchString[, position])返回boolean`，判断一个字符串是否包含在另一个字符串中，从postition索引开始搜寻，默认0
4. `str.indexOf(searchValue [, fromIndex])返回第一次出现的索引，没有出现则为-1`，fromIndex小于0则返回null，大于length返回-1
5. `str.lastIndexOf(searchValue[, fromIndex])返回从字符串尾部开始第一次出现的索引，没有则-1`，fromIndex的值相对于从尾部开始的索引
6. `str.match(regexp)返回值：如果g模式返回全部匹配结果，不会捕获，如果非g模式，返回第一个匹配结果及其捕获组`，regexp正则表达式对象
7. `str.matchAll(regexp)返回一个所有匹配的结果及分组捕获组的迭代器`，迭代器只能使用一次
8. `str.search(regexp)返回首次匹配到的索引，没有则-1`，执行正则表达式和 String 对象之间的一个搜索匹配
9. `str.startsWith(searchString[, position])返回boolean`，判断str是否以另外一个子字符串pos位置开头，pos为开始搜索的位置，默认从str头部开始
10. `s.toString()返回一个表示调用对象的字符串`，该方法返回指定对象的字符串形式
11. `str.valueOf()返回一个String对象的原始值`，该值等同String.prototype.toString()，通常在js内部调用
12. `string[Symbol.iterator]返回一个新的迭代器对象`，它遍历字符串的代码点，返回每一个代码点的字符串值。
13. `String.raw(callSite, ...substitutions)、
String.raw\`templateString\`返回给定模板字符串的元素字符串`，callSite：一个模板字符串的“调用点对象”，...substitutions：任意个可选的参数，表示任意个内插表达式对应的值，templateString：模板字符串，可包含占位符（${...}）

## 字符串操作

1. `str.trim()返回去掉两端空白后的新字符串`
2. `str.trimEnd/trimRight()返回去除末(右)端空白的新字符串`
3. `str.trimStart/trimLeft()返回去除开头(左)端空格的新字符串`
4. `str.split([separator[, limit]])返回一个以指定分隔符出现位置分隔而成的一个数组，数组元素不包含分隔符`，limit限制返回的分割片段(默认全返回)
5. `str.slice(beginIndex[, endIndex])返回新字符串`，从原str中返回beagin索引到end(不包含)索引(默认到尾部)的新字符串
6. `str.padEnd(targetLength [, padString])返回新字符串`，用一个字符串填充当前字符串(可重复)，返回填充后达到指定长度的字符串，从尾部开始填充
7. `str.padStart(targetLength [, padString])返回新字符串`，用另一个字符串填充当前字符串(可重复)，直到给定的长度。填充从当前字符串头部开始
8. `str.repeat(count)返回一个新字符串`，重复str字符串count次，返回拼接之后的新字符串
9. `str.replace(regexp|substr, newSubStr|function)返回新字符串`，参数1：如果是正则会匹配所有满足匹配条件的内容，如果是字符串则只会匹配第一个满足的内容。参数2：如果是字符串则此串会替换参数1匹配到的内容，如果是func，将会把func的返回值替换匹配的内容
10. `referenceStr.localeCompare(compareString[, locales[, options]])返回值：如果引用字符存在于比较字符之前则为负数; 如果引用字符存在于比较字符之后则为正数; 相等的时候返回 0 `
11. `str.concat(string2, string3[, ..., stringN])返回新的字符串`，将一个或多个字符串与原字符串连接合并
12.  `str.substring(indexStart[, indexEnd])返回新字符串`，返回一个字符串在开始索引到结束索引(不包括)之间的一个子集

## 字符串转换

1. `str.toLocaleLowerCase([locale, locale, ...])返回新字符串`，locale 为指明要转换成小写格式的特定语言区域，返回调用字符串被转换为小写的格式。
2. `str.toLocaleUpperCase([locale, locale, ...])返回新字符串`，locale 参数指明要转换成大写格式的特定语言区域，根据本地化的大小写映射规则将输入的字符串转化成大写的格式
3. `str.toLowerCase()返回新字符串`，将调用该方法的字符串值转为小写形式，并返回
4. `str.toUpperCase()返回一个新字符串`，将调用字符串转换为大写形式返回

## 字符串转码

1. `String.fromCharCode(num1, ..., numN) 返回长度为N的字符串`，参数：UTF-16代码单元的数字。 范围介于0到65535（0xFFFF）之间。
2. `String.fromCodePoint(num1[, ...[, numN]])返回指定Unicode编码位置创建的字符串`，参数：一串Unicode编码位置
3. `str.charCodeAt(index)返回给定索引位置字符的UTF-16编码`，索引超过length-1则返回NaN
4. `str.codePointAt(pos)返回值为给定位置字符的 一个 Unicode 编码数字`
5. `str.normalize([form])返回给定的 Unicode 规范化形式的字符串`，按照指定的一种 Unicode 正规形式将当前字符串正规化

## 字符串静态方法

1. String.raw(callSite, ...substitutions)、String.raw\`templateString\`
2. String.fromCharCode()
3. String.fromCodePoint()