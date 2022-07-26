---
tags: [node]
---
JS 是脚本语言，脚本语言都需要一个解析器才能运行。对于写在 HTML 页面里的 JS，浏览器充当了解析器的角色。而对于需要独立运行的 JS，NodeJS 就是一个解析器。

每一种解析器都是一个运行环境，不但允许 JS 定义各种数据结构，进行各种计算，还允许 JS 使用运行环境提供的内置对象和方法做一些事情。例如运行在浏览器中的 JS 的用途是操作 DOM，浏览器就提供了 `document`之类的内置对象。而运行在 NodeJS 中的 JS 的用途是操作磁盘文件或搭建 HTTP 服务器，NodeJS 就相应提供了 `fs`、`http`等内置对象。

#### 模块

NodeJS 遵循的模块化规范是 `commonJS`。其原理及使用规则见 xxx。`NodeJS`主模块就是通过命令行参数传递给 `NodeJS`启动程序的模块。一个模块中的 `JS`代码仅在模块第一次被使用时执行一次，并在执行过程中初始化模块的导出对象。之后，缓存起来的导出对象被重复利用。一个 `JS`模块里面的变量因为会被缓存，所以在多处调用的地方值是会互相影响的。

#### 模块路径解析规则

按照以下规则解析路径，直到找到模块位置

1. 内置模块

   如果传递给 `require`函数的是 NodeJS 内置模块名称，不做路径解析，直接返回内部模块的导出对象，例如 `require('fs')`。
2. node_modules 目录

   NodeJS 定义了一个特殊的 `node_modules`目录用于存放模块。例如某个模块的绝对路径是 `/home/user/hello.js`，在该模块中使用 `require('foo/bar')`方式加载模块时，则 NodeJS 依次尝试使用以下路径。

   ```js
    /home/user/node_modules/foo/bar
    /home/node_modules/foo/bar
    /node_modules/foo/bar
   ```
3. NODE_PATH 环境变量

   与 PATH 环境变量类似，NodeJS 允许通过 NODE_PATH 环境变量来指定额外的模块搜索路径。NODE_PATH 环境变量中包含一到多个目录路径，路径之间在 Linux 下使用 `:`分隔，在 Windows 下使用 `;`分隔。例如定义了以下 NODE_PATH 环境变量：

   ```js
    NODE_PATH=/home/user/lib;/home/lib
   ```

   当使用 `require('foo/bar')`的方式加载模块时，则 NodeJS 依次尝试以下路径。

   ```
    /home/user/lib/foo/bar
    /home/lib/foo/bar
   ```

#### 包

我们利用 `npm install [xxx]`安装的就是包，其实就是多个模块的集合。当我们引入包的使用，利用 `require`进行引入。每一包都是有一个入口文件的，如果模块的文件名字是 `index.js`的话，引入的时候就可以省略掉 `index.js`（这个和 ES6 的模块规则是一样的）。`npm`就是一种包管理工具。其次比较常用的还有 `yarn`。需要注意的是 `npm install xxx --S`安装的包是用作生产依赖，`npm install xxx --D`安装的包是用作开发依赖。(记忆：--S（保存）--D(dev 开发))。

#### 😎 debug 的使用

![image-20211027163957024](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202110271639084.png)

在调试的时候呢。特别容易进入第三方库中。比如 `JQuery`。这个时候如果你已经进入了，那就利用【单步跳出】的方法，跳出来。如果你还没有进入，那就利用【单步跳过】的方法直接执行该函数，跳到该函数的下一条语句。

#### 循环依赖的解决

```js
// a.js
console.log("a 开始");
exports.done = false;
var b = require("./b.js");
console.log("在 a 中，b.done = %j", b.done);
exports.done = true;
console.log("a 结束");
```

```js
//b.js
console.log("b 开始");
exports.done = false;
var a = require("./a.js");
console.log("在 b 中，a.done = %j", a.done);
exports.done = true;
console.log("b 结束");
```

```js
//main.js
console.log("main开始");
let a = require("./a");
let b = require("./b");
console.log("在 main 中，a.done=%j，b.done=%j", a.done, b.done);
```

![image-20211028094650069](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202110280946148.png)

对比输出：当 `main.js`加载 `a.js`的时，`b.js`又加载了 `a.js`。这个时候，`b.js`会去加载 `a.js`，为了防止无限的循环。`nodeJS`是这样干的，此时返回给 `b.js`的 `a.js`是一个没有完成执行流程的 `exports`对象的副本。也就是 `a.js`执行到 `exports.done = false`为止的一个副本。之后等 `b.js`加载完成后，并将自己的 `exports`对象给 `a.js`。

#### module.exports 和 exports 的区别

它们两个是等价的，`exports`是 `module.exports`的简写。

**但是**，使用的时候需要注意

```js
exports = {
  a: 3,
};
console.log(exports); // {a:3}
console.log(module.exports); // {}
console.log(exports === module.exports); // false
```

因为 `exports={a:3}`，`exports`被赋值了，这样的话就会断开和 `module.exports`之间的引用啦。此时它们就不是同一个对象了。所以此时没办法再用 `module.exports`来导出。同样的给 `module.exports` 重新赋值也会断开它们之间的引用。

所以使用的时候可以遵循以下原则：**因为 `require`得到是 `module.exports`导出的值**

- 导出多个成员用 `module.exports`和 `exports`都可以
- 导出单个成员只能用 `module.exports`(因为此时用 `exports`的话，`module.export`的值为 `{}`)

> 不出错：一直用 `module.export`就可以啦！！！

#### 简单非阻塞体验

```
//syl.txt
 hello，Zeng!
```

```js
var fs = require("fs");
fs.readFile("syl.txt", function (err, data) {
  if (err) return console.error(err);
  console.log(data.toString());
});

console.log("程序执行完毕!");
// 程序执行完毕
// hello,Zeng！
```

上面就是非阻塞，其实就是异步。等到读取完毕才输出 `syl.txt`里面的内容，不影响同步代码的执行。其实，`node`中用到的回调基本是匿名函数。

**require加载规则**
1. 优先在同级目录下查找 node_modules目录，查看该包名
2. 查找这个包的目录下的package.json文件中，里面的main字段，就是加载的第三方模块
3. 如果没有main字段，默认就是该包根目录下的index.js文件
4. 如果没有package.json文件，就去查找它父级模块的node_modules目录，规则一样，找不到一直往上，再找不到就报错can not find module xxx
