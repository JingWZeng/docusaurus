---
tags: [js小知识]
---
- 复制数组 `array.concat()`
- `console.table(obj)`用于对象或者对象数组。`console.clear()`清空控制台
- `eval()`参数是字符串，将字符串变成可执行的 `JS`代码
- `a`标签的 `href`的动态参数，可以设置为参数设置不同的值

  ```javascript
  <a :href="'www.ZJingW.blog?id='+userId" ></a>
  let userId =1111
  ```
- this 既不指向函数自身也不指向函数的词法作用域。this 实际上是在函数调用的时发生的绑定，**它指向啥完全取决函数在哪里被调用**
- 调用栈->为了到达当前执行位置所调用的所有的函数 | 调用位置-->当前正在执行的函数的前一个调用中
- `html5` 的 `meta`

```html
meta 有4个属性 name http-equiv charset content content和它们搭配使用，content =
'具体的描述' name 主要用于描述网页
content就是进一步说明name，也就是指定具体的name对象 http-equiv
相当于http的文件头作用，比如说定义htt平参数啥的 1.<meta charset="UTF-8" /> //
html5固定的写法,简写 2.X-UA-Compatible(浏览器采取何种版本渲染当前页面)
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
//指定IE和Chrome使用最新版本渲染当前页面
3.cache-control(指定请求和响应遵循的缓存机制)
<meta http-equiv="cache-control" content="no-cache" />
no-cache: 先发送请求，与服务器确认该资源是否被更改，如果未被更改，则使用缓存。
no-store: 不允许缓存，每次都要去服务器上，下载完整的响应。（安全措施） public :
缓存所有响应，但并非必须。因为max-age也可以做到相同效果 private :
只为单个用户缓存，因此不允许任何中继进行缓存。（比如说CDN就不允许缓存private的响应）
maxage :
表示当前请求开始，该响应在多久内能被缓存和重用，而不去服务器重新请求。例如：max-age=60表示响应可以再缓存和重用
60 秒。
<meta
  http-equiv="cache-control"
  content="no-siteapp"
/>的作用是避免在移动端浏览时，被百度自动转码
4.expires(网页到期时间)，就是网页资源过了设置这个时间之后，就重新请求资源是否改变，改变则更新
5.refresh(自动刷新并指向某页面)
<meta http-equiv="refresh" content="2; url='https://myblog-six.vercel.app/'" />
//意思是2秒后跳转向我的博客
6.Set-Cookie(cookie设定)如果网页过期，那么这个网页存在本地的cookie也会自动被删除
<meta http-equiv="Set-Cookie" content="name,data" /> //格式
```

- `vh`就是当前屏幕可见高度的 1%，也就是说 `height:100vh === height:100%`

```css
// 问题来了:固定页脚做法
<body>
<main</main>
<footer></footer>
</body>
1.已知footer的高度，去设置<main>的最小高度
min-height:calc(100vh - footer的高度)  // 注意 -的前后需要有空格，不然不生效
2.未知footer的高度 
利用flexBox。body设置flex，同时min-height:100vh，并把伸缩方向设置成column，mian设置成flex：1
flex 只要设置了大于0的值，就获得可伸缩的特性
如果main设置了flex:2 ,footer设置了flex:1 。那么main的高度是footer的两倍
    body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
  background-color: brown;
  width: 100%;
}
footer {
  width: 100%;
  background-color: aqua;
  height: 100px;
}
```

- `:first-child`表示在一组兄弟元素中的第一个元素。注意是相同的元素
- `text-shadow`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <style>
    div {
      height: 200px;
      width: 300px;
      font-size: 100px;
      text-align: center;
    }
    .a {
      background-color: deeppink;
      color: #fff;
      text-shadow: 1px 1px black, 1px -1px black, -1px 1px black, -1px, -1px, black;
      /* 没有背景颜色，相当于镶边效果  x y blur color x为负数，阴影在左，y为负数，阴影在右*/
    }
    .glow {
      background-color: #203;
      color: #ffc;
      text-shadow: 0 0 0.1em, 0 0 0.3em;
      /* 没指定颜色，阴影就和文字一个颜色 */
    }
  </style>
  <body>
    <div class="a">css</div>
    <div class="glow">glow</div>
  </body>
</html>
```

![text-shodow](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202109171149919.png)

- `Set`方式去除字符串里面的重复字符

```javascript
Set.prototype.add(value)：添加某个值，返回 Set 结构本身。🤔
Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set的成员。
Set.prototype.clear()：清除所有成员，没有返回值。
```

![image-20210920151716408](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202109201517506.png)

- `Object.defineProperty`

为对象新增属性或者修改属性的时候呢，有两种不同的方法：

1. 直接使用 = 赋值
2. 使用 `Object.defineProperty()`定义

区别就是使用 = 的话，对象的该属性的 `writable`、`enumerable`和 `configurable`都为 `true`。

使用 `defineProperty`的话，它们都是 `false`,也就是该属性不可以被修改、被遍历、被删除。

`configurable`:当且仅当该属性的 `configurable`为 `true`时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除

- `URL`编码

当期望获取一个可用的 URL 地址时，使用 `encodeURI()`
当需要对 `URL`的参数进行编码时，使用 `encodeURIComponent()`，如果它作用于整个 `url`，它会编码 `http://`导致完成后的不是一个可用的 `url`地址
[关于 `url`编码](http://www.ruanyifeng.com/blog/2010/02/url_encoding.html)

- 子组件想修改父组件的值并传给父组件

`vue`本身是单向数据流的，就是子组件不能直接修改父组件的值，如果子组件想更新父组件的值的话，可以利用 `.sync`和 `$emit(update:xxx)`。其实是简化了在子组件定义一个事件，父组件处理该事件。

子组件 `son`

`this.$emit('update:myMsg',val);`

父组件

`<son :my-msg.sync = "val"/> //此处my-msg一定需要使用kebeb-base写法，驼峰是无效的`

- async/await 是同步代码

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
console.log("script start");
async1();
console.log("script end");

/*
script start
async1 start
async2
script end
async1 end
*/
```

- 提取 10 位的随机数

```js
const str = Math.random().toString(36).substr(2, 10);
console.log(str);
```

- 获取 dom 最快的方法

```html
<div id="zero"></div>
console.log(zero) // 返回的就是这个div
```

- 可选链操作符

```js
const obj = {
  // name: 'zengxpang',
  age: 25,
  sex: "男",
  days: {
    // birth: '1998-06-12'
  },
};
console.log(obj.days && obj.days.birth); // undefined
console.log(obj.days?.birth); // undefined 可选链操作符啊啊啊 代替上面那种写法，可以链式调用哦，其实就相当于.操作符，只不过多了可选，就是兜底可以为空
console.log(obj?.name);

//注意在vue的template中还不支持可选链操作符
```

- 隐藏元素
  > display-none: 元素不会占用空间，在页面中不显示，子元素也不会显示。
  >
  > opacity-0: 元素透明度将为 0，但元素仍然存在，绑定的事件仍旧有效仍可触发执行。
  >
  > visibility-hidden：元素隐藏，但元素仍旧存在，占用空间，页面中无法触发该元素的事件。
  >

> content： w3c 的->就是说定义的 height 和 width 是内容的宽高，实际显示的这部分+padding+border
>
> border-box: 怪异->就是定义的 height 和 width 就是实际的高宽，比如我就是要一个 100\*100 的盒子的时候，那直接设置这个属性就好啦。内容的宽度会自动调整的

- 获取 url 中的参数

```js
const location = "https://juejin.cn/post/？&id='123'&username='zengxpang'";
const q = {};
location.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (q[k] = v));
console.log(q); // { id: "'123'", username: "'zengxpang'" }
```


- 字符串常用的方法

```js
const str = "abcdefg";
console.log(str.includes("i")); // false
console.log(str.startsWith("a")); // true 是不是以a开头，一般用于判断是不是http开头
console.log(str.endsWith("g")); // true 字符串是否为某个字符串结尾。判断后缀名的时候尤其有效
console.log(str.repeat(2)); // abcdefgabcdefg 就是str重复2次之后的字符

// padEnd 在尾巴处拼接字符，长度是5，用第二个参数1来拼接
const a = "abc".padEnd(5, "1");
console.log(a); //abc11
// padStart与padEnd相反
const b = "abc".padStart(5, "1");
console.log(b); // 11abc
```

- 利用 Object.entries 将对象转 Map

```js
const obj = { name: "zjw", age: 20 };
const a = Object.entries(obj);
console.log(a); // [ [ 'name', 'zjw' ], [ 'age', 20 ] ]
const m = new Map(a);
console.log(m); // { 'name' => 'zjw', 'age' => 20 }
/*
size：获取成员的数量
set：设置成员 key 和 value
get：获取成员属性值
has：判断成员是否存在
delete：删除成员
clear：清空所有
*/
console.log(m.get("name")); // zjw
```

- 合并运算符
  假设 name 变量不存在的时候，我需要给一个默认值给它，一般会使用 || 运算符。但是 JS 中，0 或者 false 都会执行||运算符。解决方法就是利用 `??`合并运算符来代替，只允许在 null 或者 undefined 的时候使用默认值。

```js
const name = "";
name || "zjw"; // zjw
name ?? "zjw"; // ''
const age = null;
age ?? 20; // 20
```

- 0.1+0.2 === 0.3 为 false 引出来的问题？
  利用原生的 JS 解决的时候，利用 toFixed 来做，它在决定保留几位小数的过程中会四舍五入。

```js
parseFloat((0.1 + 0.2).toFixed(10)); // 0.3
```

```js
// ES6提供了Number.EPSILON,它是一个数字，代表的是最小的误差
function numQual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
// 只要两个数相减的误差在Number.EPSILON这个范围内，那这两个数就是相等的
```

- BigInt

`JavaScript`可以处理的最大数字是 `2`的 `53`次方 `- 1`，这一点我们可以在 `Number.MAX_SAFE_INTEGER`中看到。

```js
consoel.log(Number.MAX_SAFE_INTEGER); //9007199254740991
```

更大的数字则无法处理，`ECMAScript2020`引入 `BigInt`数据类型来解决这个问题。通过把字母 `n`放在末尾, 可以运算大数据。

`BigInt`可以使用算数运算符进行加、减、乘、除、余数及幂等运算。它可以由数字和十六进制或二进制字符串构造。此外它还支持 `AND`、`OR`、`NOT`和 `XOR`之类的按位运算。唯一无效的位运算是零填充右移运算符。

```js
const bigNum = 100000000000000000000000000000n;
console.log(bigNum * 2n); // 200000000000000000000000000000n

const bigInt = BigInt(1);
console.log(bigInt); // 1n;

const bigInt2 = BigInt("2222222222222222222");
console.log(bigInt2); // 2222222222222222222n;
```

BigInt 是一个大整数，所以他不能用来存储小数。

- Vue 用 index 作为 key?

如果不存在对数据逆序添加，逆序删除等破坏顺序的操作时,用 index 好点。其他情况下，不要用 index。因为在 vue 里面的 key 是判断是不是同一个节点的。

```js
'['+['a','b','v']+']'====>'[a,b,v]' // 真是神奇
```

- 13、Array.prototype.reduce

  - 第一个参数 callback 函数： pre 为上次 return 的值，next 为数组的本次遍历的项
  - 第二个参数为初始值，也是第一个 pre

```js
// 统计元素出现个数
const nameArr = ["林三心", "sunshine_lin", "林三心", "林三心", "科比"];
const totalObj = nameArr.reduce((pre, next) => {
  if (pre[next]) {
    pre[next]++;
  } else {
    pre[next] = 1;
  }
  return pre;
}, {});
console.log(totalObj); // { '林三心': 3, sunshine_lin: 1, '科比': 1 }
```

- HTTP

HTTP/1.0 中一个请求一个 TCP 连接，请求结束之后立即断开连接。如果前一个请求的时间太长，就会有对头阻塞，因为用到的数据结构是队列。这个时候的对头阻塞是发生在客户端的。

HTTP/1.1，每一个连接默认都是长连接，一个 TCP 连接，可以发送多个 http 请求，也就是说不用等到前一个响应收到，就可以发送下一个请求啦。这样就解决了 HTTP/1.0 的客户端的对头阻塞，但是 HTTP/1.1 规定，服务端的响应需要根据收到请求的顺序发送回去，这样就造成了对头阻塞，不过这个时候是发生在服务端的。

HTTP/2 解决了服务端的对头阻塞，采用二进制分帧和多路复用的方式。因为 1.1 中数据包是文本格式，但是 2 中是二进制格式的，更小，而且带有排序的序号，可以打乱发送，接受的时候再重组就好啦。多路复用：在 1.1 中并发多个请求的时候需要多个 TCP 的链接吗，而且单个域名有 6-8 个 TCP 的链接限制。在多路复用中，同一个域名的所有的通信是在单个 TCP 链接里面的，而且支持并发请求和响应，互不干扰。

- JSON.stringify 格式化

```js
console.log(JSON.stringify({ a: 1, b: 2 }, null, "\t"));
/*
{
        "a": 1,
        "b": 2
}

*/
```

- 字符串转数组

```js
[..."test"]; //  ["t", "e", "s", "t"]
```

- if 的判定条件 flag 为布尔值的时候

```js
function get1() {
  console.log("get1");
}
function get2() {
  console.log("get2");
}

function demo(flag) {
  // flag ? get1() : get2();
  // 保证flag是布尔值的话
  // [get1, get2][Number(flag)]();
  // 不能保证的话 ！！强行转成布尔值
  [get1, get2][Number(!!flag)]();
}
console.log(demo(true));
console.log(demo(false));
```
