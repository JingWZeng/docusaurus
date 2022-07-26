---
tags: [BOM]
---
好记性不如烂笔头！

### 1.BOM: Browser Object Model

什么是: 专门操作浏览器窗口的API
没有标准, 导致浏览器兼容性问题
包括:
window
history
location
navigator
dom
event
screen

### 2.window:

属性: .innerWidth, .innerHeight 浏览器窗口中,文档显示区的宽和高
方法: .open() .close() .open(“url”,”name”)

三种:

```
CODE
1.在当前窗口打开,可后退: .open("url","_self")
2.在新窗口打开,可打开多个: .open("url","_blank")
3.在新窗口打开,只能打开一个: 
  .open("url","自定义窗口名")
```

### 3.history: 保存当前窗口打开后,成功访问过的url的历史记录栈

在当前窗口中,每访问一个新url,都会将新url压入history
API: history.go(n)

3种:

```
CODE
前进: history.go(1)  
后退: history.go(-1)  
刷新: history.go(0)
```

### 4.location: 保存当前窗口正在打开的url的对象

属性:
.href 完整url地址
.protocol 协议
.host 主机名+端口号
.hostname 主机名
.port 端口号
.pathname 相对路径
.hash #锚点地址
.search ?查询字符串

方法:

1. 在当前窗口打开,可后退:
   location.assign(url) => location.href=url => location=url
2. 在当前窗口打开,禁止后退:
   location.replace(url)
3. 重新加载页面: 刷新: 2种:
   1. 普通刷新:
      优先从浏览器本地缓冲获取资源:
      F5
      history.go(0)
      location.reload(/*false*/)
   2. 强制刷新:
      无论本地是否有缓存,总是强制从服务器获取资源
      location.reload(true)

### 5.定时器: 2种:

1. 周期性定时器:
   什么是: 让程序每隔指定的时间间隔,反复执行一项任务
   何时: 只要让程序按照指定的时间间隔,自动执行一项任务
   如何: 3件事:
   1.任务函数: 让定时器反复执行的任务
   2.启动定时器: timer=setInterval(task, interval)

   ```
   CODE
   让程序,每隔interval 毫秒自动执行一次task任务
   ```

   3.停止定时器: clearInterval(timer)

   ```
   CODE
   timer: 定时器的序号, 在内存中唯一标识定时器的整数
    专门用于停止定时器
    如何获得: 只能在启动定时器时获得。
    何时: 只要一个定时器可能被停止,就要在启动时,先保存定时器序号
    好的习惯: 在clearInterval之后,手动清除timer中残留的序号: timer=null;
   ```

   停止定时器: 2种情况:

   1. 用户手动停止:
   2. 定时器可自动停止:
      在任务函数中,设定临界值,如果没有达到临界值,则继续执行任务,否则,如果达到临界值,就自动调用clearInterval

2.一次性定时器:
什么是: 让程序先等待一段时间,再执行一次任务。执行后,自动停止。
何时: 只要让程序延迟执行一件事时
如何: 3件事:
1.task
2.启动定时器: timer=setTimeout(task,wait)

```
CODE
让程序等待wait毫秒后,自动执行一次task,执行后自动停止
```

3.停止定时器: clearTimeout(timer)

### 6.定时器原理:

定时器中的任务函数,必须等待主程序所有语句执行后,才能执行。

### 7.navigator:

1.什么是: 保存浏览器配置信息的对象
包括:
.cookieEnabled: 判断当前浏览器是否启用cookie

2.什么是cookie: 在客户端持久存储用户私密数据的小文件
为什么: 内存中所有数据都是临时的! 程序关闭,内存中一切变量都释放!
何时: 只要希望在客户端持久保存数据,都用cookie
.plugins: 包含浏览器所有插件信息的集合

3.什么是插件: 为浏览器添加新功能的小软件

```
CODE
如何判断是否安装指定插件: 
```

.userAgent: 保存浏览器名称和版本号的字符串
何时: 只要判断浏览器名称和版本号

### 8.event:

什么是事件: 人为触发的,或浏览器自动触发的页面内容状态的改变。
什么是事件处理函数: 当事件发生时,自动执行的函数。
如何绑定: 3种:

1. 在HTML中绑定:
   绑定:
   当事件发生时: 自动执行js语句
   问题: 不符合内容与行为分离的原则,不便于维护和重用
   但是: 在组件开发中,反而要求内容,行为和样式集中定义在一个小组件内,自成体系。
2. 在js中绑定, 每个事件只能绑定一个处理函数:
   ANY.on事件名=function(){ … }
   当事件发生时: ANY.on事件名() //this->ANY
   问题: 用赋值方式绑定事件处理函数
3. 在js中绑定,每个事件可绑定多个处理函数:
   ANY.addEventListener(‘事件名’,handler)
   在浏览器中为ANY元素的指定事件,添加一个事件监听对象。将事件监听对象加入到浏览器的监听队列中。
   触发事件时: 浏览器会遍历监听队列中的每个监听对象,找到触发事件元素上对应事件的监听对象,调用其处理函数
   移除事件监听:
   ANY.removeEventListener(‘事件名’,handler)
   说明: handler必须是绑定时使用的原函数对象
   强调: 如果一个处理函数,有可能被移除,则不能使用匿名函数绑定。应使用有名的函数绑定

### 9.DOM事件模型:

什么是: 从事件触发到处理函数执行,所经过的过程
3个阶段:

1. 捕获capture: 由外向内,记录各级父元素上绑定的事件处理函数。——仅记录,不触发!
2. 目标触发: 优先触发实际点击的元素上绑定的处理函数
3. 冒泡执行: 由内向外,按捕获阶段记录的处理函数的倒序,依次执行父元素上的处理函数。

### 10.事件对象:

什么是: 当事件发生时,自动创建的,封装事件信息的对象
何时: 只要希望获得事件信息,或修改事件的默认行为时
如何获取: 事件对象默认总是以处理函数第一个参数,自动传入
如何使用:

1. 取消冒泡: e.stopPropagation()
2. 利用冒泡:
   优化: 尽量减少事件监听的个数
   为什么: 浏览器查找事件监听,采用的是遍历的方式

   ```
   CODE
   事件监听多,浏览器查找就慢
   ```

   何时: 如果对多个子元素绑定相同事件时,都要利用冒泡
   如何: 只要在父元素绑定一次,所有子元素共用即可!
   2个难题:

   ```
   CODE
   1. 获得目标元素:
     目标元素: 最初实际触发事件的当前元素
     如何获得: 
      错误: this->父元素
      正确: e.target
   2. 筛选目标元素:
     比如: 通过nodeName, class, 内容。。。
   ```
3. 阻止默认行为:
   何时: 只要事件的默认行为不是想要的
   如何: e.preventDefault();
   何时:

   1. 用a当按钮时,a会自动向地址栏中添加#锚点地址。
   2. 提交表单时,如果验证没通过,可阻止提交
      自定义表单提交:
      input button + onclick + form.submit
      input submit + form.onsubmit事件 + e.preventDefault()
   3. HTML5中拖拽API: 首先要阻止浏览器默认的拖拽行为

### 11.鼠标坐标:(3组)

```
CODE
1. 相对于屏幕左上角: e.screenX,  e.screenY
2. 相对于文档显示区左上角: e.clientX,  e.clientY
3. 相对于当前元素左上角:  e.offsetX,   e.offsetY
```

### 12.页面滚动:

事件: window.onscroll
获得页面滚动过的高度: body顶部超出文档显示区顶部的距离

```
CODE
scrollTop=document.documentElement.scrollTop
        ||document.body.scrollTop;
```

滚动API:
window.scrollTo(left, top)
window.scrollBy(left的增量,top的增量)
