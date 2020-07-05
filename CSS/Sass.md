# Sass

- sass是css的预处理器，通过sass语法编写scss，再处理成css代码，其中sass加入了多种css不具备的语法，使得在开发中更加便利、高效
- scss是sass3所用的语法格式，可以说sass3之前使用的是sass语法，sass3使用的是scss语法，在语法规则上有些不同，以及分别使用.sass与.scss后缀的拓展名，sass采用的是缩进格式来代替{}
- 变量用$前缀，指令用@前缀

此文中使用scss语法

## css拓展

### 嵌套规则

- 嵌套功能避免了重复输入父选择器

scss

```scss
div {
  width: 100px;

  .main {
    width: 50px;

    #top {
      border: red;
    }
  }
}
```

css

```css
div {
  width: 100px;
}
div .main {
  width: 50px;
}
div .main #top {
  border: red;
}
```

### 父选择器`&`

- 在嵌套语法内使用&表示的是使用嵌套外层的父级选择器

scss

```scss
div {
  width: 100px;

  &:nth-child(1) {
    border: red;

    &:hover {
      width: 50px;
    }
  }
}
```

css

```css
div {
  width: 100px;
}
div:nth-child(1) {
  border: red;
}
div:nth-child(1):hover {
  width: 50px;
}
```

生成复合选择器

scss

```scss
.main {
  width: 100px;

  &-top {
    width: 50px;
  }
}
```

css

```css
.main {
  width: 100px;
}
.main-top {
  width: 50px;
}
```

### 属性嵌套

- 把相同前缀的属性提取到外头，作为命名空间，同时也能赋值

scss

```scss
.main {
  font: {
    family: fantasy;
    size: 30em;
    weight: bold;
  }

  margin: 0 auto {
    bottom: 50px;
    top: 50px;
  }
}
```

css

```css
.main {
  font-family: fantasy;
  font-size: 30em;
  font-weight: bold;
  margin: 0 auto;
  margin-bottom: 50px;
  margin-top: 50px;
}
```

### 注释

- `/* 多行注释 */`，会被完整编译到css中,压缩模式不会
- `// 单行注释`，不会被编译到css中
- `/*!  强调注释，在压缩模式下还存在，用于添加版权信息  */`

### `SassScript`

- 在终端输入`sass -i`可测试SassScript功能
  
### 变量

- 变量使用$开头，支持块级作用域，也分全局和局部变量，!global定义为全局变量

scss

```scss
.main {
  $width:100px !global; // 定义为全局变量
  width: width;
}
.header {
  width: width;
}
```

css

```css
.main {
  width: width;
}

.header {
  width: width;
}
```

### 数据类型

- 数字：`1,10px`
- 字符串：`"foo",'bar',baz`
- 颜色：`blue,#000,#666666,rgba(0,0,0,.5),hsl(90,50%,50%)`
- 布尔：`true,false`
- 空：`null`
- 数组(列表)：使用空格或者逗号作为分隔符，`1.5em 1em 0 2em, Helvetica, Arial, sans-serif`
- maps：类似js的对象，`(key1:value1,key2:value2)`

#### 字符串

- 包括有引号字符串和无引号字符串，在编译 CSS 文件时不会改变其类型。
- 只有一种情况例外，使用 `#{}` (interpolation) 时，有引号字符串将被编译为无引号字符串，这样便于在 mixin 中引用选择器名

scss

```scss
.main {
  $head: '.head';
  width: 200px;

  #{$head}-top {
    width: 100px;
    ;
  }
}
```

css

```css
.main {
  width: 200px;
}

.main .head-top {
  width: 100px;
}
```

#### 数组

- 独立的值也被视为数组
- nth 函数可以直接访问数组中的某一项；join 函数可以将多个数组连接在一起；append 函数可以在数组中添加新值；而 @each 指令能够遍历数组中的每一项
- 数组可以有子数组，使用逗号风格为2个子数组，或者使用括号包裹2个子数组，`1px 2px, 5px 6px与(1px 2px) (5px 6px)`，用空括号表示null

#### maps

- maps可视为键值对的集合，必须使用圆括号括起来，其中key和values可以是sass的任何对象
- map-get函数查找键，map-merge用于融合键值

### 运算

- sass支持基本的运算，如果必要会在不同单位间转换值
- `/`在以下情况才会作为除号
  - 如果值，或值的一部分，是变量或者函数的返回值
  - 如果值被圆括号包裹
  - 如果值是算数表达式的一部分

scss

```scss
p {
  font: 10px/8px;             // Plain CSS, no division
  $width: 1000px;
  width: $width/2;            // Uses a variable, does division
  width: round(1.5)/2;        // Uses a function, does division
  height: (500px/2);          // Uses parentheses, does division
  margin-left: 5px + 8px/2px; // Uses +, does division
}
```

css

```css
p {
  font: 10px/8px;
  width: 500px;
  height: 250px;
  margin-left: 9px;
}
```

如果既要使用变量，又要使用`/`不做除法的编译到css中，那么需要使用插值语句将变量包裹起来

### 颜色计算

- 颜色计算是分段计算，R、G、B通道单独计算，`#010203+#010203=#020406`,`#010203*2=#020406`
- 如果包含alpha不透明值，需要在相同alpha值下进行计算
- alpha可以通过opacify和transparentize函数进行对不透明度和透明度调整

scss

```scss
.main {
  color: opacify(#f00, 0.5);
  background-color: transparentize(#999, .2);
}
```

css

```css
.main {
  color: rgba(255, 0, 0, 0.5);
  background-color: rgba(153, 153, 153, 0.8);
}
```

### 字符串连接符

- 字符串连接符`+`，如果有引号字符串（位于 + 左侧）连接无引号字符串，运算结果是有引号的，相反，无引号字符串（位于 + 左侧）连接有引号字符串，运算结果则没有引号
- 运算表达式与其他值连用时，用空格做连接符

### 布尔运算和数组运算

- 布尔类型可以使用and，or，not运算
- 数组运算只支持list functions控制
- 圆括号影响运算顺序

### `#{变量}`插值语句

- 使用`#{变量}`，可以在选择器或者属性名中使用变量
- 插值语句可以避免运算表达式，比如避免除号使用

### 变量默认定义

- 在变量定义结尾使用`!default`可以对未通过`!default`声明的变量赋值，如果变量已经赋值那么将不会在重新赋值，如果变量为null，或者还没被赋值那么将会赋予使用`!default`定义的值

scss

```scss
.main {
  $width: 100px;
  $width: 50px !default;
  $height: null;
  $height: 100px !default;
  width: $width;
  height: $height;
}
```

css

```css
.main {
  width: 100px;
  height: 100px;
}
```

### sass拓展

#### `@import`

- sass支持所有css3的@开头的指令，并拓展了@import功能
- sass的@import允许导入scss或者sass文件，被导入的文件将会被编译到同一个css文件中，包括变量或者混合都可以在导入的文件中使用
- 导入拓展名如果是scss或者sass可以省略后缀,`@import "foo";  // foo.sass、foo.scss`

scss

```scss
@import "foo.css";
@import "foo" screen;
@import "http://foo.com/bar";
@import url(foo);
```

css

```css
@import "foo.css";
@import "foo" screen;
@import "http://foo.com/bar";
@import url(foo);
```

导入时可以使用逗号分隔导入的文件，而且如果是url导入，也可以使用插值语句，但是使用的变量不是动态导入的

import还支持嵌套导入，但是只会导入到嵌套层中，且不能在mixin和控制指令中嵌套`@import`

#### 分音

- 把不需要编译的sass或者scss文件用下划线开头命名，这样导入的时候sass就不会编译这些文件
- 如`_base.scss`，使用`@import "base"`，这样就单纯的把`_base.scss`文件导入内容导入进来，一般此类文件是不需要编译的内容，比如定义的变量和函数等

#### `@media`

- sass中的媒体查询，拓展了css中的功能，使其可以嵌套使用，在sass中嵌套的`@media`会被编译到文件的最外层，包含嵌套的父选择器
- 如果互相嵌套使用media，那么将会被提取出来，将会使用and连接条件，其中条件还能使用变量、函数、运算符代替

scss

```scss
.main {
  $dir: landscape;
  $orientation: orientation;
  @media screen {
    .body {
      @media ($orientation: $dir) {
        width: 100px;
      }
    }
  }
}
```

css

```css
@media screen and (orientation: landscape) {
  .main .body {
    width: 100px;
  }
}
```

#### `@extend`

- extend继承，可以通过`@extend`来实现样式继承，解决一个元素使用的样式与另一个元素完全相同，但又添加了额外的样式

scss

```scss
.error {
  width: 100px;
  height: 100px;

  &:hover {
    color: #fff;
  }
}

.seriousError {
  @extend .error;
  background-color: #f00;
}
```

css

```css
.error, .seriousError {
  width: 100px;
  height: 100px;
}
.error:hover, .seriousError:hover { 
  color: #fff;
}

.seriousError {
  background-color: #f00;
}
```

`@extend` 会把.seriousError.seriousError合并为.seriousError

#### 延时复杂选择器

- extend可以延时任何定义给单个元素的选择器，包括`.main.title`,`a:hover`,`a.user[href^="http://"]`，直接继承选择器所拥有的样式

scss

```scss
.error {
  width: 100px;
  height: 100px;

  &:hover {
    color: #fff;
  }
}

.seriousError {
  @extend .error:hover; // 注意这里
  background-color: #f00;
}
```

css

```css
.error {
  width: 100px;
  height: 100px;
}

.error:hover, .seriousError { // 注意这里
  color: #fff;
}

.seriousError {
  background-color: #f00;
}
```

#### 多重延申

- 使用逗号或者另写一行继承，来实现继承多个样式

scss

```scss
.error {
  width: 100px;
  height: 100px;

  &:hover {
    color: #fff;
  }
}

.confirm {
  border: 10px solid red;
}

.seriousError {
  // @extend .error, .confirm
  @extend .error;
  @extend .confirm;
  background-color: #f00;
}
```

css

```css
.error, .seriousError {
  width: 100px;
  height: 100px;
}

.error:hover, .seriousError:hover {
  color: #fff;
}

.confirm, .seriousError {
  border: 10px solid red;
}

.seriousError {
  background-color: #f00;
}
```

#### 继续延申

- extend可以多次嵌套继承

scss

```scss
.error {
  width: 100px;
  height: 100px;
}

.seriousError {
  @extend .error;
  background-color: #f00;
}

.confirm {
  @extend .seriousError;
  border: 10px solid red;
}
```

css

```css
.error, .seriousError, .confirm {
  width: 100px;
  height: 100px;
}

.seriousError, .confirm {
  background-color: #f00;
}

.confirm {
  border: 10px solid red;
}
```

#### 选择器列

- 虽然sass的extend不能将选择器列延申给嵌套元素，如`.foo .bar`,`.foo + .bar`由于这里涉及到很多层次的延申，所以没有采用。但是可以将其他元素延申给选择器列

scss

```scss
.error {
  width: 100px;
  height: 100px;
}

.main .title {
  @extend .error;
  background-color: #fff;
}
```

css

```css
.error, .main .title {
  width: 100px;
  height: 100px;
}

.main .title {
  background-color: #fff;
}
```

对于**合并选择器列**，如果一个选择器列中的元素需要延申到另一个选择器列中时，当有相同选择器时，相同部分将会合并，不同部交替输出，当没有相同选择器时，将会生成2个新的选择器

拥有相同选择器时

scss

```scss
.head .title {
  width: 100px;
  height: 100px;
}

.head .container {
  @extend .title;
  background-color: #fff;
}
```

css

```css
.head .title, .head .container {
  width: 100px;
  height: 100px;
}

.head .container {
  background-color: #fff;
}
```

没有相同选择器时

scss

```scss
.head .title {
  width: 100px;
  height: 100px;
}

.main .body {
  @extend .title;
  background-color: #000;
}
```

css

```css
.head .title,
.head .main .body,
.main .head .body {
  width: 100px;
  height: 100px;
}

.main .body {
  background-color: #000;
}
```

#### `@extend-Only`选择器

- `@extend-Only`用于定义一套样式，但是此样式不需要被编译成css，而且通过延申指令来使用
- 使用占位符来定义选择器，把原来的`#`与`.`用`%`来代替，此时就不会被编译，当被延申时占位符将会被延申的选择器替换

1. 当继承失败的时候，可以通过`!optional`来声明继承不生成新的选择器，如`@extend .main !optional;`，这样可以避免因继承导致的一些错误提示
2. 在`@media`中使用`@extend`时，如果被继承的选择器在`@media`内定义，那么可以正常使用，如果被继承的选择器在`@media`之外定义的那么将不可用

### `@at-root`

- 在局部样式内使用`@at-root` 定义选择器样式，那么此样式将会被编译到全局样式中，而不是父选择器的局部样式，其中也可以通过条件来判断编译

scss

```scss
.head {
  .body {
    width: 100px;
    height: 100px;
    @at-root .title {
      background-color: #fff;
    }
    @at-root {
      .top {
        background-color: #111;
      }
      .left {
        background-color: #222;
      }
    }
  }
}

```

css

```css
.head .body {
  width: 100px;
  height: 100px;
}

.title {
  background-color: #fff;
}

.top {
  background-color: #111;
}

.left {
  background-color: #222;
}
```

### `@debug`、`@warn`、`@error`

- `@debug`可以把指令结果打印到标准输出流中，对于sass的调试有大作用
- `@warn`将以警告形式输出到标准输出流中
- `@error`将以错误形式输出到标准输出流中

### 控制指令

- sass提供了一些基础的控制指令，比如在满足一定条件时引用样式，或者设定范围重复输出格式
- 控制指令是一种高级功能，日常编写过程中并不常用到，主要与混合指令 (mixin) 配合使用，尤其是用在 Compass 等样式库中

#### `@if`

- `@if...@else if...@else`,分支控制与常规语言相同，如果满足条件则编译相关样式反之不会被编译

scss

```scss
.head {
  $height: 50px;
  @if 3==5 {
    width: 50px;
  } @else if $height>40px {
    width: 30px;
  } @else {
    width: 100px;
  }
}
```

css

```css
.head {
  width: 30px;
}
```

#### `@for`

- 可以在限制范围内重复输出
- 格式1：`@for $var from <start> through <end>`，格式2：`@for $var from <start> to <end>`，当使用through时循环范围包括end，当使用to时不包括end
- 从start循环到end，其中`$var`是每次循环的变量

scss

```scss
$items: 3;
@for $index from 1 through $items {
  ft-#{$index} {
    font-size: 10 * $index;
  }
}
@for $index from 1 to $items {
  mt-#{$index} {
    margin-top: 10 * $index px;
  }
}
```

css

```css
ft-1 {
  font-size: 10;
}

ft-2 {
  font-size: 20;
}

ft-3 {
  font-size: 30;
}

mt-1 {
  margin-top: 10 px;
}

mt-2 {
  margin-top: 20 px;
}
```

#### `@each`

- 此指令格式：`@each $var in <list>`用于对列表(数组)的遍历，其中`$var`是每次遍历的项
- 当然也支持多变量的遍历，以及maps的遍历(变量为键名、键值)

scss

```scss
@each $color, $width, $index in (red 10px 1), (blue 20px 2), (green 30px 3) {
  .title-#{$index} {
    color: $color;
    width: $width;
  }
}
```

css

```css
.title-1 {
  color: red;
  width: 10px;
}

.title-2 {
  color: blue;
  width: 20px;
}

.title-3 {
  color: green;
  width: 30px;
}
```

#### `@while`

- 循环输出，直到表达式为false

scss

```scss
$total: 3;
@while $total>0 {
  .ft-#{$total} {
    font-size: 5 * $total px;
  }
  $total: $total - 1;
}
```

css

```css
.ft-3 {
  font-size: 15 px;
}

.ft-2 {
  font-size: 10 px;
}

.ft-1 {
  font-size: 5 px;
}
```

### 混合指令

- 混合指令用于定义可重复使用的样式，还能通过参数引入变量输出个性化样式
- 通过使用`@mixin 混合名称{}`来定义样式，通过`@include 混合名称`来混合样式
- 同样可以嵌套混合，以及使用关键词参数来给指定的变量赋值

scss

```scss
@mixin title {
  width: 100px;
}
@mixin head {
  @include title;
  height: 100px;
}
.body {
  @include head;
  background-color: #fff;
}
```

css

```css
.body {
  width: 100px;
  height: 100px;
  background-color: #fff;
}
```

参数混合,关键词混合，以及默认值

scss

```scss
@mixin title($width,$color, $height: 50px ) {
  width: $width;
  height: $height;
  color: $color;
}
.body {
  @include title($width: 30px, $color: #000);
  background-color: #fff;
}
```

css

```css
.body {
  width: 30px;
  height: 50px;
  color: #000;
  background-color: #fff;
}
```

参数变量

scss

```scss
@mixin title($border...) {
  border-left: $border;
}
@mixin title1($px, $shape, $color) {
  border-top: $px $shape $color;
}
.body {
  $border: 1px solid red;
  @include title(2px solid blue);
  @include title1($border...);
  background-color: #fff;
}
```

css

```css
.body {
  border-left: 2px solid blue;
  border-top: 1px solid red;
  background-color: #fff;
}
```

混合导入样式，在导入时添加额外样式，用于替换混合中`@content`的位置

scss

```scss
@mixin title($border...) {
  border-left: $border;
  @content;
}

.body {
  @include title(2px solid blue) {
    border-top: 1px solid red;
  }
  background-color: #fff;
}
```

css

```css
.body {
  border-left: 2px solid blue;
  border-top: 1px solid red;
  background-color: #fff;
}
```

可以使用`=`来表示`@mixin`,使用`+`来表示`@include`，这是在sass3之前

### 函数指令

- 如`hsl(60,50%,50%)`，函数计算的结果作为值
- 函数传参的时候可以给形参指定实参，`hsl($hue:60,$saturation:100%,$lightness:50%)`，可以不需要按照形参顺序传值
- 参数名可以使用下划线和短横线作为单词分隔
- sass也支持自定义函数，参数形式同`@mixin`,需要调用`@return 输出结果`

scss

```scss
@function getAdd($first, $second) {
  @return $first + $second;
}
.head {
  font-size: getAdd(5px, 3px);
}
```

css

```css
.head {
  font-size: 8px;
}
```

参数功能同`@mixin`

### Sass输出格式

- sass提供了4种输出格式，通过`:style option`设置，或者在命令行中使用`--style`设置

#### `:nested`默认格式

- 能够清晰反映 CSS 与 HTML 的结构关系。选择器与属性等单独占用一行，缩进量与 Sass 文件中一致，每行的缩进量反映了其在嵌套规则内的层数

```scss
#main {
  color: #fff;
  background-color: #000; }
  #main p {
    width: 10em; }

.huge {
  font-size: 10em;
  font-weight: bold;
  text-decoration: underline; }
```

#### `:expanded`手写形式

- 就与原生css格式一样，选择器、属性等各占用一行，属性根据选择器缩进，而选择器不做任何缩进

```scss
#main {
  color: #fff;
  background-color: #000;
}
#main p {
  width: 10em;
}

.huge {
  font-size: 10em;
  font-weight: bold;
  text-decoration: underline;
}
```

#### `:compact`单行，紧凑形式

- 输出的每一块样式都是一行，每条 CSS 规则只占一行，包含其下的所有属性。嵌套过的选择器在输出时没有空行，不嵌套的选择器会输出空白行作为分隔符

```scss
#main { color: #fff; background-color: #000; }
#main p { width: 10em; }

.huge { font-size: 10em; font-weight: bold; text-decoration: underline; }
```

#### `:compressed`压缩形式

- 压缩样式，删除所有无意义的空格、空白行、以及注释，力求将文件体积压缩到最小，同时也会做出其他调整，比如会自动替换占用空间最小的颜色表达方式

```scss
#main{color:#fff;background-color:#000}#main p{width:10em}.huge{font-size:10em;font-weight:bold;text-decoration:underline}
```

### 命令行

- 编译命令`sass 源文件名.scss:编译后文件名.css --style 编译模式`
- 文件监听`sass --watch 源文件名.scss:编译后文件名.css 编译模式`

### sass安装

- 由于sass基于Ruby语言开发，先安装ruby，再通过ruby终端安装sass
- 安装ruby之后，安装sass`gem install sass`，安装compass`gem install compass`
