---
tags: [ Vue2 , 源码系列 ]
---
#### 响应式原理

响应式的过程是啥？

利用 getter/setter 来对每个对象的属性进行监听，属性变化之后呢，发送到对应的组件的内部，让对应的组件来利用虚拟 dom 更新组件，进而来更新视图。

`Object.defineProperty(obj,prop,desc)`:直接在一个对象上定义一个新属性，或者修改一个已经存在的属性

- obj 需要定义属性的当前对象
- prop 当前需要定义的属性名
- desc 属性描述符

javcript 有三种类型的属性

1. 命名数据属性：拥有一个确定的值的属性。这也是最常见的属性
2. 命名访问器属性：通过 `getter`和 `setter`进行读取和赋值的属性
3. 内部属性：由 JavaScript 引擎内部使用的属性，不能通过 JavaScript 代码直接访问到，不过可以通过一些方法间接的读取和设置。比如，每个对象都有一个内部属性 `[[Prototype]]`，你不能直接访问这个属性，但可以通过 `Object.getPrototypeOf()`方法间接的读取到它的值。虽然内部属性通常用一个双吕括号包围的名称来表示，但实际上这并不是它们的名字，它们是一种抽象操作，是不可见的，根本没有上面两种属性有的那种字符串类型的属性

desc 分为两类：数据描述符和存取描述符，不可以混合使用

| 属性名       | 含义                                                                                                                                                   | 数据描述符 | 存取描述符 | 默认值    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------- | --------- |
| value        | 值                                                                                                                                                     | ✅         | ❌         | undefined |
| get          | 一个给属性提供 `getter`的方法，如果没有 `getter`则为 `undefined`。返回值是被作用的属性的那个值。该属性被读取就触发该方法。                       | ❌         | ✅         | undefined |
| set          | 一个给属性提供 `setter`的方法，如果没有 `setter`则为 `undefined`。该方法将接受唯一参数，并将该参数的新值赋值给该属性。该属性被赋值就触发该方法。 | ❌         | ✅         | undefined |
| writable     | 是否可以改变属性的值                                                                                                                                   | ✅         | ❌         | false     |
| enumerable   | 描述属性是否会出现在 `for in`或者 `Object.keys()`的遍历中                                                                                          | ✅         | ✅         | false     |
| configurable | 描述属性是否配置，以及可否删除                                                                                                                         | ✅         | ✅         | false     |

```js
let obj = {};
obj.name = "zxp";
// 等价于下面的代码
let obj = {};
Object.defineProperty(obj, "name", {
  value: "zxp",
  writable: true,
  configurable: true,
  enumerable: true,
});
```

```js
Object.defineProperty(obj, "name", {
  value: "zxp",
});
// 等价于下面的代码
Object.defineProperty(obj, "name", {
  value: "zxp",
  writable: false,
  configurable: false,
  enumerable: false,
});
```

---

为了啥而看源码：

> 1. 学习 vue 的原理
> 2. 第一阶段：(不要求自己全部看懂源码，但是得知道实现的原理，肯定有好多细节代码是看不懂的)
> 3. 学习设计模式（听说 vue 把能用到的设计模式都用上了）


```js
//封装
//这里的data就是目标的obj对象，key就是该对象的属性，val是未更新之前的值
//从data中的key读取数据  -->get
//从data中的key设置数据  -->set
function de(data, key, val) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      return val;
    },
    set: function (newVal) {
      if (val === newVal) {
        return;
      }
      val = newVal;
    },
  });
}
```

```js
function cb(val) {
  console.log({ val });
  console.log("视图跟新啦啦啦");
}

// 订阅者
class Dep {
  constructor() {
    // 用来存放Watcher对象的数组（保存的就是watcher对象）
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  // 通知所有的watcher对象更新视图
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}
// 观察者
class Watcher {
  constructor() {
    // 在new一个watcher对象的时候呢，this指向的就是该实例，把该对象赋值给Dep.target属性，在get的时候会用到的。
    Dep.target = this;
  }
  /* 更新视图的方法 */
  update() {
    console.log("视图更新啦～");
  }
}
Dep.target = null;

//入参是一个 obj（需要绑定的对象）、key（obj的某一个属性），val（具体的值）
function defineReactive(obj, key, val) {
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
      dep.addSub(Dep.target); // watcher对象存放在了Dep.target中
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
      //cb(newVal);
      dep.notify();
    },
  });
}

function observer(value) {
  if (!value || typeof value !== "object") {
    return;
    /*
    数组的侦测方式是不一样的，因为数组变化的时候不会触发getter、setter方法。例如this.arr.push(1)
    它是通过Array原型上面的方法来改变数组的内容的。
    */
  }
  Object.keys(value).forEach((key) => {
    let a = defineReactive(value, key, value[key]); // obj key val
  });
}

class Vue {
  //   constructor(options) {
  //     this._data = options.data;
  //     observer(this._data);
  //   }
  constructor(options) {
    this._data = options.data;
    observer(this._data);
    // 新建一个watcher对象，这个时候呢，Dep.target会指向这个对象的
    new Watcher();
    // 在这里模拟render的过程，为了触发test属性的get函数（读取的时候触发）
    console.log(`render: ${this._data.test}`);
  }
}

let o = new Vue({
  data: {
    test: "xxx",
  },
});
/**
 * options
 * {data:{
 *    test:'xxx'}
 * }
 */
o._data.test = "yyyy";
o._data.name = "zjw"; // 这个检测不到的 vue提供了vm.$set解决
delete o._data.name; // 这个也检测不到的 vue提供了vm.$delete解决
// render: xxx
// 视图更新啦～
```

> 总结：🤯
>
> `render function`的时候其实就是读取了 `data`里面的属性，读取的时候呢，会触发(`touch`)这个熟悉的 `getter`方法，这个时候在 `Vue`里面会 `new`一个 `watcher`出来,此时 `new`出来的 `watcher`的 `this`指向就是该实例，也就是它自己，这个时候把 `this`赋值给 `Dep`（存放依赖的地方）的一个全局属性 `target`，这个 `target`在 `getter`方法中被存进去 `Sub`函数里面 `subs`（存放依赖的数组）里面去。然后呢，在 `setter`方法中，也就是更新属性值的时候，去遍历 `subs`数组里面的每一个 `watcher`，让每一个 `watcher`去执行更新视图的方法。`Watcher`的角色其实就是一个中间人，负责依赖收集,然后依赖有更新的时候通知相应的视图改变。

#### VNode

`VNode`其实就是一个 `JS`的对象 `{}`，可以叫他节点描述对象。就是是``JS `来模拟真实的`dom `。**VNode->dom->页面**。因为`vue `它是状态发生改变之后，通过`Watcher `通知到有用到该状态的组件，然后组件内部去更新。那这里就有一个好棒的地方啦。为了防止一个小小的变化，导致重新渲染整个组件的问题发生。所以`vue `是怎么做的呢。它把上一次的`VNode `缓存起来，跟更新的`VNode `进行对比。这里用的是`diff `算法。然后，查找出哪里有变化，到真实`dom `那里只需要改变那个需要被改变的`dom`结构就可以啦。

#### patch

patch 就是作用于 oldVNode 和 VNode 之间。它的作用就是比较两个 VNode 之间的差异，然后修改 dom，最后去渲染视图这一整个过程。

- 创建新增的节点

主要发生在两个场景，一是第一次渲染的时候，并没有 oldVNode，二是 oldVNode 中没有最新的 VNode(节点)。

- 修改需要更新的节点

如果是同一节点的话，那就只需要更新不同的属性就可以啦。

- 删除已经废弃的节点

就是 VNode 中没有 oldVNode 的所对应的节点。替换节点的过程就是把新的 dom 节点插进去，旧的 dom 节点删除掉。


#### 未完，待补充
