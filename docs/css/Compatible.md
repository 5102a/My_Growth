# 浏览器兼容

- 这里主要列出一些关于浏览器css兼容性问题以及解决方法(hack)

## 兼容处理

**图片有边框**

描述：在ie中图片会出现边框

> hack 给图片加 border:0; 或者 border: 0 none;

**图片间隙**

描述：div中的图片有间隙

> hack1 把标签写在一行； hack2 把img转为块级元素； hack3 div设置line-height:0

**双倍边框(ie6)**

描述：当ie6及更低版本浏览器在解析浮动元素时会错误的把浮动边边距（margin）加倍显示

> hack 给浮动元素添加 display:inline;

**默认高度(ie6、7)**

描述：在ie6及以下版本中，部分块元素拥有默认高度（在16px左右）

> hack1 给元素添加 font-size:0; hack2 给元素添加overflow:hidden;

**表单元素行高对齐不一致**

描述：表单元素高度对齐不同

> hack 给表单元素添加 float:left;

**按钮元素默认大小不同**

描述：不同浏览器的按钮大小不同

> hack1 使用 a 标签代替 button;  hack2 使用额外样式来修正； hack3 如果按钮是图片，则使用图片来当背景

**li元素bug**

描述：当li有浮动时，子元素a没有浮动，会导致a元素垂直显示

> hack 给li和a都加浮动

描述：当li没浮动，且子元素a设置为display:block、有高度、有浮动会导致a元素出现阶梯显示

> hack 给li也 加浮动

**上下外边距重叠**

描述：父元素外边距和子元素外边距重叠

> hack1 给父元素添加 overflow:hidden;  hack2 给子元素添加浮动

**鼠标指针bug**

描述：在ie9以下的浏览器识别cursor:hand手型鼠标

> hack 统一使用 cursor:pointer 来声明手型鼠标

**透明属性**

描述：ie与其他浏览器透明写法不同

> ie 浏览器使用 filter:alpha(opacity=value); value为1-100整数
> 其他浏览器使用 opacity:value; value为0-1

**html对象获取**

描述：在ie中可使用document.idName()来获取属性

> hack 在所有浏览器中统一使用 document.getElementById()

**事件对象**

描述：在ie中event对象有x、y属性，没有pageX、pageY属性。在Firefox中event没有x、y属性，有pageX、pageY属性

> hack 使用 mX = event.x ? event.x :event.pageX 来兼容

**window.location.href问题**

描述：在ie和Firefox2.0.x下，可以使用window.location或window.location.href，Firefox1.5.x下,只能使用window.location

> hack 统一使用 window.location

**frame对象**

描述：ie可以使用window.frameId或者window.frameName来访问frame对象，Firefox只能使用window.frameName来访问

> hack 统一使用window.frameName来访问frame对象

**模态和非模态框**

描述：ie中可以使用showModalDialog和showModelessDialog打开模态和非模态窗口;Firefox下则不能

> hack 直接使用window.open(pageURL,name,parameters)方式打开新窗口