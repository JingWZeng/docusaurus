---
tags: [event-loop]
---
JS 是单线程语言。执行过程中产生两种任务：同步任务和异步任务。

- 同步任务：比如声明语句、for、赋值等，读取后依据从上到下从左到右，立即执行。
- 异步任务：比如 ajax 网络请求，setTimeout 定时函数等都属于异步任务。异步任务会通过任务队列(Event Queue)的机制（**先进先出的机制**）来进行协调。

#### 任务队列

任务队列中的任务也分为两种，分别是：宏任务（Macro-take）和微任务（Micro-take）

- 宏任务主要包括：scrip(JS 整体代码)、setTimeout、setInterval、setImmediate、I/O、UI 交互
- 微任务主要包括：Promise(重点关注：值的是 then 部分)、process.nextTick(Node.js)、MutaionObserver

执行规则：理解这个就可以应对执行顺序啦

**第一次初始化，先执行全局的 js 代码(scrip)的宏任务，然后进入 Event loop,此时先执行微任务，再执行宏任务。微/宏任务之间安装先进先出的机制执行。**

例 1：

```js
console.log("script start");

setTimeout(function () {
  console.log("setTimeout");
}, 0);

Promise.resolve()
  .then(function () {
    console.log("promise1");
  })
  .then(function () {
    console.log("promise2");
  });

console.log("script end");
//script start 全局的宏任务（JS代码块）
//script end 全局的宏任务
//promise1 微任务
//promise2 微任务
//setTimeout 宏任务
```

例 2：

Promise 中的代码是同步代码，会立即执行的。只有 then 之后的代码，才是异步执行的代码，是一个微任务。

```js
console.log("script start");

setTimeout(function () {
  console.log("timeout1");
}, 10);

new Promise((resolve) => {
  console.log("promise1");
  resolve();
  setTimeout(() => console.log("timeout2"), 10);
}).then(function () {
  console.log("then1");
});

console.log("script end");
// script start JS代码块
// promise1 JS代码块
// script end JS代码块
// then1 微任务
// timeout1 宏任务
// timeout2 宏任务
```

例 3：

async/await 的执行，其实它就是 Promise 的语法糖

翻译过来：

```js
// async/await 写法
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end"); // 这就是then里面的部分
}
// Promise 写法
async function async1() {
  console.log("async1 start");
  Promise.resolve(async2()).then(() => console.log("async1 end"));
}
```

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
async1();
setTimeout(() => {
  console.log("timeout");
}, 0);
new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});
console.log("script end");
// async1 start JS代码块
// async2 JS代码块 Promise里面的是同步代码，then里面的才是异步
// promise1 同上...
//script end  同上...
// primise2 微任务
// timeout 宏任务
```

例 4：

setTimeout 不太准确的，setTimeout 的第二个参数就是为了告诉 JS 再过多长的事件把当前的任务加到队列中。

如果队列是空的，那么添加的代码会立即执行；如果队列不是空的，那么它就要等前面的代码执行完了以后再执行。

```js
const s = new Date().getSeconds();
console.log("script start");
new Promise((resolve) => {
  console.log("promise");
  resolve();
}).then(() => {
  console.log("then1");
  while (true) {
    if (new Date().getSeconds() - s >= 4) {
      console.log("while");
      break;
    }
  }
});
setTimeout(() => {
  console.log("timeout");
}, 2000);
console.log("script end");
//script start JS代码块
//promise JS代码块
//script end JS代码块
//then1 微任务
4秒之后
//while
//timeout
// 这里虽然setTimeout 2s之后就添加到队列里面了，但是它前面有个微任务，所以要先等微任务执行完才行。
```
