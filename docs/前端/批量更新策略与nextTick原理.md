---
tags: [ 源码系列 ]
---
#### nextTick 原理

定义一个 callbacks 数组用来存储 nextTick，在下一个 tick 处理这些回调函数之前，所有的 cb 都会被存在这个 callbacks 数组中。
pending 是一个标记位，代表一个等待的状态。
setTimeout 会在 task 中创建一个事件 flushCallbacks ，
flushCallbacks 则会在执行时将 callbacks 中的所有 cb 依次执行。

```js
let callbacks = [];
let pending = false;

function nextTick(cb) {
  callbacks.push(cb);
  if (!pending) {
    pending = false;
    setTimeout(flushCallbacks, 0);
  }
}
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  copies.forEach((item) => {
    item();
  });
}
```

#### 批量更新之后的 watcher

```js
let callbacks = [];
let pending = false;

function nextTick(cb) {
  callbacks.push(cb);

  if (!pending) {
    pending = true;
    // setTimeout是异步任务，在任务队列里面，等主任务中没有其他任务执行之后才执行它
    setTimeout(flushCallbacks, 0);
  }
}

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

/*
 举个例子，如果我要num从0变成1000，那么其他在下面这个queue队列中就存在1000个重复的watcher，显然我们需要去重，id就是区别相同的watcher
 */
let uid = 0;

class Watcher {
  constructor() {
    this.id = ++uid;
  }

  update() {
    // this就是new出来的实例
    console.log("watch" + this.id + " update");
    queueWatcher(this);
  }

  run() {
    console.log("watch" + this.id + "视图更新啦～");
  }
}

let has = {};
let queue = [];
let waiting = false;

function queueWatcher(watcher) {
  const id = watcher.id;
  // 过滤掉重复的watcher
  if (has[id] == null) {
    has[id] = true;
    queue.push(watcher);

    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}
// 下一个tick执行的方法
function flushSchedulerQueue() {
  let watcher, id;

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
  }

  waiting = false;
}

let watch1 = new Watcher();
let watch2 = new Watcher();

watch1.update();
watch1.update();
watch2.update();

/* 原本
watch1 update
watch1视图更新啦～
watch1 update
watch1视图更新啦～
watch2 update
watch2视图更新啦～
*/

/*现在
watch1 update
watch1 update
watch2 update
watch1视图更新啦～
watch2视图更新啦～
*/
```
