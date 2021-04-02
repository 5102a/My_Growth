# HTML5新特性

HTML5 技术结合了 HTML4.01 的相关标准并革新，符合现代网络发展要求，在 2008 年正式发布

## 新特性

### HTML5 文档定义

```html 基本框架
<!--文档定义-->
<!DOCTYPE html>
<!--中文编码来解析-->
<html lang="zh-CN">
<head>
    <!--utf-8编码来解析-->
    <meta charset="utf-8">
    <title>Document</title>
</head>
<body>

</body>
</html>
```

### HTML5 新增标签

- 同 div，span 标签
- 有语义化标签实现盒子
  - header 有标签
  - nav 导航标签
  - aside 侧边栏标签
  - footer 页脚标签
  - section 栏目标签

### 表单控件新增属性

- required 属性值为本身，作用为表单控件一定要有内容，不会提交内容
- placeholder 属性内容为：显示提示内容
- autofocus 值为本身，自动获取焦点
- 新增 type 属性
  - email 限制输入为 Email 类型
  - url 限制输入为网站 包含`http://`
  - date 限制输入为 日期
  - week 限制输入为周类型
  - time 限制输入为时间类型 小时和分钟
  - month 限制输入为月类型
  - number 限制输入为数值型
  - color 颜色拾色器
  - range 范围（滑动条）属性 min、max、value 表示设定值
  - 如果浏览器不解析 type 的值，则当成文本框使用

```html 表单控件新增属性
<!-- 此类型要求输入格式正确的email地址 -->
<input type="email" >
<!-- 要求输入格式正确的URL地址  -->
<input type="url" >
<!-- 要求输入格式数字，默认会有上下两个按钮 -->
<input type="number" >
<!-- 时间系列，但目前只有 Opera和Chrome支持 -->
<input type="date" >
<input type="time" >
<input type="datetime" >
<input type="datetime-local" >
<input type="month" >
<input type="week" >
<!-- 默认占位文字 -->
<input type="text" placeholder="your message" >
<!-- 默认聚焦属性 -->
<input type="text" autofocus="true" >
```

### 视频

- video 标签，支持格式 Ogg，MPEG4,WebM
- src 属性为资源，播放 url
- autoplay 自动播放视频
- controls 播放控制控件
- loop 重复播放视频
- width 视频宽
- height 视频高度，一般不设置
- 解决兼容性问题
  - 多选几种格式

  ```html 兼容性
  <video controls>
    <source src="xx.mp4">
    <source src="xx.ogg">
    <source src="xx.webm">
  </video>
  ```

### 音频

- audio 标签同视频控件
- autoplay loop controls 等
- 支持格式 Ogg Vorbis，MP3，Wav

### Canvas绘图

- HTML5的canvas元素可以实现画布功能，该元素通过自带的API结合使用JavaScript脚本语言在网页上绘制图形和处理，拥有实现绘制线条、弧线以及矩形
- 用样式和颜色填充区域，书写样式化文本，以及添加图像的方法，且使用JavaScript可以控制其每一个像素
- HTML5的canvas元素使得浏览器无需Flash或Silverlight等插件就能直接显示图形或动画图像
- 通过canvas**绘制图像、路径、文本、渐变**

### 地理位置

- HTML5通过引入**Geolocation**的API可以通过GPS或网络信息实现用户的定位功能，定位更加准确、灵活
- 通过HTML5进行定位，除了可以定位自己的位置，还可以在他人对你开放信息的情况下获得他人的定位信息

### WebStorage

- WebStorage数据存储，HTML5支持**DOM Storage**和**Web SQL Database** 两种存储机制
- LocalStorage用于长久保存整个网站的数据，保存的数据**没有过期时间**，直到**手动去除**
- SessionStorage用于**临时保存**同一窗口(或标签页)的数据，在**关闭窗口或标签页之后**将会**删除**这些数据

### WebWorker

- WebWorker多线程，通过创建一个Web Worker对象就可以实现**多线程**操作
- HTML5新增加了一个WebWorkerAPI，用户可以创建多个在后台的线程，将耗费较长时间的处理交给后台面**不影响用户界面和响应速度**，这些处理不会因用户交互而运行中断
- 大致步骤如下
  - ①先创建发送数据的子线程；
  - ②执行子线程任务，把要传递的数据发送给主线程；
  - ③在主线程接受到子线程传递回的消息时创建接收数据的子线程，然后把发送数据的子线程中返回的消息传递给接收数据的子线程；
  - ④执行接收数据子线程中的代码
- 此API解决js单线程的限制，使得大量的处理数据不会影响到js主线程的执行

### WebSocket

- WebSocket是HTML5开始提供的一种在**单个 TCP 连接上进行全双工通讯的协议**
- 浏览器通过 JavaScript 向服务器发出建立 WebSocket 连接的请求，连接建立以后，客户端和服务器端就可以通过 TCP 连接直接交换数据
- 当你获取 Web Socket 连接后，你可以通过 send() 方法来向服务器发送数据，并通过 onmessage 事件来接收服务器返回的数据
- 解决HTML4.01的轮询问题

<Vssue title="HTML issue" />
