# meta标签详解

元素可提供有关页面的**元信息**（meta-information），比如针对搜索引擎和更新频度的描述和关键词
标签位于文档的头部，不包含任何内容。`<meta>` 标签的属性定义了与文档相关联的名称/值对

## 必选属性content

- 定义与 http-equiv 或 name 属性相关的元信息
- content 属性提供了名称/值对中的值。该值可以是任何有效的字符串
- content 属性始终要和 name 属性或 http-equiv 属性一起使用
- 但是所有服务器都至少要发送一个：`content-type:text/html`。这将告诉浏览器准备接受一个 HTML 文档

```html
<!-- 网页作者 -->
<meta name="author" content="开源技术团队"/>
<!-- 网页地址 -->
<meta name="website" content="https://baidu.com"/>
<!-- 网页版权信息 -->
<meta name="copyright" content="2018-2019 demo.com"/>
<!-- 网页关键字, 用于SEO -->
<meta name="keywords" content="meta,html"/>
<!-- 网页描述 -->
<meta name="description" content="网页描述"/>
<!-- 搜索引擎索引方式，一般为all，不用深究 -->
<meta name="robots" content="all" />
<!-- 移动端常用视口设置 -->
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0, user-scalable=no"/>
<!-- 
  viewport参数详解：
  width：宽度（数值 / device-width）（默认为980 像素）
  height：高度（数值 / device-height）
  initial-scale：初始的缩放比例 （范围从>0 到10）
  minimum-scale：允许用户缩放到的最小比例
  maximum-scale：允许用户缩放到的最大比例
  user-scalable：用户是否可以手动缩 (no,yes)
 -->
```

### 可选属性name

- name提供名称，与把content属性关联到一个名称
- 通常情况下，您可以自由使用对自己和源文档的读者来说富有意义的名称
- "keywords" 是一个经常被用到的名称。它为文档定义了一组关键字。某些**搜索引擎**在遇到这些**关键字**时，会用这些关键字对文档进行分类

### 可选属性http-equiv

- http-equiv 属性为名称/值对提供了名称
- 指示服务器在发送实际的文档之前先在要传送给浏览器的 MIME 文档头部包含名称/值对
- 当服务器向浏览器发送文档时，会先发送许多名称/值对，服务器将把名称/值对添加到发送给浏览器的内容头部
- **只有浏览器可以接受这些附加的头部字段，并能以适当的方式使用它们时，这些字段才有意义**

```html http-equiv
<!-- expires指定网页的过期时间。一旦网页过期，必须从服务器上下载。 -->
<meta http-equiv="expires" content="Fri, 12 Jan 2020 18:18:18 GMT"/>
<!-- 等待一定的时间刷新或跳转到其他url。下面1表示1秒 -->
<meta http-equiv="refresh" content="1; url=https://www.baidu.com"/>
<!-- 禁止浏览器从本地缓存中读取网页，即浏览器一旦离开网页在无法连接网络的情况下就无法访问到页面。 -->
<meta http-equiv="pragma" content="no-cache"/>
<!-- 也是设置cookie的一种方式，并且可以指定过期时间 -->
<meta http-equiv="set-cookie" content="name=value expires=Fri, 12 Jan 2001 18:18:18 GMT,path=/"/>
<!-- 使用浏览器版本 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<!-- 针对WebApp全屏模式，隐藏状态栏/设置状态栏颜色，content的值为default | black | black-translucent（半透明） -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### charset字符集(html5新增)

- 定义文档的字符编码

```html charset字符集
<!-- 定义网页文档的字符集，用于浏览器解析 -->
<meta charset="utf-8" />
```

### scheme(html5不支持)

- 定义用于翻译 content 属性值的格式
- 此方案应该在由 `<head>` 标签的 profile 属性指定的概况文件中进行了定义。

### 总结

meta主要定义此文档的一些信息，比如关键字，网站描述，服务器发送文档前发送给浏览器的MIME类型支持，以及网站信息，和部分http设置

<Vssue title="HTML issue" />