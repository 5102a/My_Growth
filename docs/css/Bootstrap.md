# Bootstrap

- 开源框架，web 前端框架
- 支持响应式布局，一个网站兼容多种终端
- css 文件、js 文件、fonts 字体文件
- 使用 html5 文档，移动设备优先`<meta name="viewport" content="width=device-width,initial-scale=1">`
- 将 css 引入
- 所有 js 插件都要依赖与 jQuery 库，先引入 jQuery 再引入 bootstrap.js

## 全局 css 样式

- 直接使用类名 class，默认容器大小
- .container 固定宽度、.container-fluid 占满容器 100%宽度，类似版心

### 排版样式

- .h1~.h6 样式，同标签样式类
- strong、b 加粗标签
- em、i 斜体
- del、s 删除线
- ins、u 下划线
- .text-left 文本水平居左对齐 默认
- .text-center 文本水平居中
- .text-right 文本水平居右
- .text-uppercase 小写转大写
- .text-lowercase 大写转小写
- .text-capitalize 首字母大写

### 列表样式

- .list-unstyled 除去项目前符号，除去列表默认 margin
- .list-inline 将列表中的内容排列成同一行 增加了少量 padding 值
- .dl-horizontal 给定义列表使用，将定义标题与定义描述信息排列在同一行，将 dt 标记与 dd 标记里面的内容排列在同一行

### 表格样式

- .table 给 table 标签添加，可赋予基本样式，少量的内补 padding 和水平方向的分割线，多类名直接后面添加
- .table-bordered 为表格和其中的每个单元格增加边框线
- .table-striped 实现隔行变色效果
- .table-hover 实现鼠标放上效果
- .table-condensed 紧凑型表格，将 padding 值减半
- 状态类给 tr、td、th 设置颜色，不能给 table 设置颜色
  - .active 鼠标悬停时的颜色
  - .success 标识成功或者积极的动作
  - .info 标识普通的提示信息或动作
  - .warning 标识警告或需要用户注意
  - .danger 标识危险或潜在的带来负面影响的动作

### 按钮样式

- .btn 表示按钮 是所有按钮的父类名
- .btn-default 默认样式的按钮
- .btn-primary 重要的按钮
- .btn-success 成功的按钮
- .btn-danger 危险的按钮
- .btn-warning 警告的按钮
- .btn-info 一般信息的按钮
- .btn-link 链接状态的按钮
- .btn-lg 超大按钮
- .btn-sm 小按钮
- .btn-xs 超小按钮

## 图片样式

### 响应式图片

- .img-responsive 响应式的图片，跟随浏览器大小变化，只能给 img 标签设置

### 图片形状

- .img-rounded 圆角矩形的图片
- .img-circle 圆形图片
- .img-thumbnail 圆角边框的图片，响应式，跟随浏览器大小变化

## 栅格系统

- 流式栅格系统，随屏幕或 viewport 尺寸的增加，系统会自动分为最多 12 列，栅格系统用于通过一系列的行.row 与列.col 的组合来创建页面布局，内容就可以放入这些创建好的布局，**行 row 必须包含在.container 固定宽度或者.container-fluid 100%宽度中**
- 一行最多 12 列，多出来的会自动换行

### 栅格参数-依据响应式添加类

- .col-xs-超小屏幕（手机）,列最多 12 同下
- .col-sm-小屏幕（平板）
- .col-md-中等屏幕（桌面显示器）
- .col-lg-大屏幕（大桌面显示器）
- .col-xx-n n 表示一个单元格占据几列

### 列偏移

- .col-xx-offset-n,n表示偏移的格子数相对于左边偏移

### 嵌套列

- 在列里还可嵌套一个栅格系统

## 表单格式（类 table）

- .form-group 表单组，表示行（类似 row）
- .form-control 给 input、textarea、select 元素都将被默认设置宽度属性为 100%，圆角边框
- .form-inline 内联表单 ，一定是给 form 标签设置
- .form-horizontal 水平排列的表单，通过为表单添加这个类与栅格系统联合使用，可以将 label 标签（用户名等提示）和控件组水平并排布局，改变了.form-group 的行为，使其表现为栅格系统中的行 row，所以无需加.row 类
- .sr-only，主要给 label 设置中，将 label 隐藏起来（用户名）

## 组件

- 包括字体图标、下拉菜单、导航
- 官网有样式和类名，bootstrap 免费使用组件，fonts 文件夹下的文件生成的
- 字体图标
- 三角图标.caret 等

## 下拉菜单

- .dropdown 将下拉菜单触发器和下拉菜单都包裹在这个类下
- data-toggle 属性：下拉菜单触发器，值为 dropdown，给按钮设置
- .dropdown-menu 给 ul 标签设置下拉菜单的样式，下拉菜单整个项
- .dropdown-header 用于设置下拉菜单的标题，不可选的标题
- divider 设置水平分割线
- .disabled 为下拉菜单 li 元素添加此类，则会禁用此项

<Vssue title="CSS issue" />