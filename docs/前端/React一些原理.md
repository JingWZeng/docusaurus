---
tags: [React]
---

### JSX

**JSX是JS的拓展，它很像模板语法，但是它具备JS的语法能力**

* **JSX会被Babel编译成React.createElement(),React.createElement() 将返回一个叫做** `<span class="ne-text">ReactElement</span>`的JS对象
* **啥是Babel，Babel会将ES6以后的JS代码转成向后兼容的JS代码。**

![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1652968649639-e37281f0-027a-4c5f-9e17-627a1d5fae74.png)

### React生命周期

#### React15的生命周期![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1652968803969-fa643b7b-2581-48ed-87e4-a1a3acd08884.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1652969070642-2e7004e3-8dac-4ea6-930b-fc1cea5e76b5.png)

**父组件修改组件的Props时会调用 componentWillReceiveProps(newProps),由父组件触发，并不是由props更改触发，所以如果父组件其他与传入子组件props无关的state发生改变，也会调用该方法。**

**组件更新时会调用shouldComponentUpdate(nextProps,nextState)，由组件自身触发**

**componentWillUpdate(nextProps,nextState)**

**componentDidUpdate(nextProps,nextState)**

#### React16的生命周期

![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1652971583042-952eccdc-dbf6-43ca-9a72-5a8b85102991.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1652971665494-7f79fbcb-cbbb-45c5-b68a-9567668a787b.png)

`<span class="ne-text">getDerivedStateFromProps(props,state)</span>`：作用就是使用props来更新state。是一个静态方法，不依赖组件实例，所以里面无法使用this。必须要返回一个对象格式（因为react需要该返回值来更新state）。

**在更新的时候，相对于componentWillReceiveProps来说是个替代品，但不是完全替代，做了减法，因为只能是props来触发更新，而componentWillReceiveProps不止于props改变来触发state更新**

`<span class="ne-text">componentWillMount</span>`几宗罪？

![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1652971954233-c1378255-e11f-489c-b987-df477008a6a1.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1652972249303-a124b4c1-9bf0-467e-8479-962dc3f96527.png)

**Fiber将同步渲染变成可中断的异步渲染模式。分为render和commit，render是异步（不可感知），commit是同步。render阶段是允许暂停、终止和重启的，不是接着上次执行的代码往下走而是重新开始执行，所以render阶段的生命周期都是有可能被重复执行的。**

* `<span class="ne-text">componentWillMount</span>`
* `<span class="ne-text">componentWillUpdate</span>`
* `<span class="ne-text">componentWillReceiveProps</span>`

**它们都处于render阶段，所以都可以被重复执行，造成不必要的bug。所以被废弃。废弃的原因就是为了配合Fiber架构带来的异步渲染机制**

### React单向数据流

#### 子->父

**父组件传给子组件的是一个绑定了自身上下文的函数，那么子组件在调用函数的时候，就可以将想要交给父组件的数据以函数入参的形式给出去。**

#### 父->子

**通过props**

#### 发布订阅

```javascript
// 1 事件和监听函数的对应关系应如何处理
// 2 如何实现订阅，也就是注册监听函数 写操作
// 3 如何实现发布 读操作

class myEventEmit{
    constructor(){
        // eventMap用来储存事件和监听函数之间的关系
        this.eventMap = {}
    }
// type是事件的名称
// 就是把事件和对应的监听函数写进去
    on(type,handler){
        // handler必须是一个函数，不然报错
        if(! (handler instanceof Function)){
            throw new Error('哥，请传一个函数')
        }
        // 判断type事件对应的队列是否存在
        if(!this.eventMap[type]){
            // 不存在，就新建该队列
            this.eventMap[type] = []
        }
        // 如果存在，直接往队列里面推入handler
        this.eventMap[type].push(handler)
        console.log(this.eventMap);
    }
    // 触发是可以携带数据的，params就是数据
    emit(type,params){
        // 假如该事件是有订阅的（对应的事件队列存在）
        if(this.eventMap[type]){
            // 将事件队列中的handler依次出队
            this.eventMap[type].forEach((handler,index)=>{
                // 注意不要忘记了读取params
                handler(params)
            })
        }
    }
    off(type,handler){
        if(this.eventMap[type]){
            this.eventMap[type].splice(this.eventMap[type].indexOf(handler),1)
        }
    }
}

const myEvent = new myEventEmit()
// handler
const testHandler = (params)=>{
    console.log(`test事件被触发，testHandler的入参是${params}`);
}
//监听test事件
myEvent.on('test',testHandler)
// 在触发test事件的同时，传入希望testHandler感知的参数
myEvent.emit('test','newState')
```

#### context

![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1652978262760-c7ae5261-0c12-416a-bb2c-462261440e1e.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1652978446251-8c912fe4-b4fb-4012-9ca7-7827423899cb.png)

#### redux

* **store是一个单一的数据源，只读的**
* **action是对变化的描述**
* **reducer负责对变化进行分发和加工**

![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1652978637422-12dbde03-54c4-4d54-9fa9-b358e28b84e5.png)

![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1652978796420-b1cdb40a-f132-415e-9409-4a6fb176be5a.png)

### React Hooks

**React组件就是一个吃进数据，吐出UI的函数**

* **why： 类组件和函数组件的侧重和思考，函数组件在hooks出来之前被叫做无状态的组件**

<details class="lake-collapse"><summary id="u6b31b2a9"><strong><span class="ne-text">结论：函数式组件会捕获render内部的状态，类组件不会</span></strong></summary>

**通过setTimeout将预期的渲染推迟了3s，打破了this.props和渲染时机上的关联。**

**props本身是不可变的，但this却是可以改变的，this上的数据可以被修改（如this.props），会保持最新的，这就是类组件确保数据实时性的重要手段。**

**函数式组件没有问题，因为props是不可变的，函数的调用一瞬间就捕获到了该props**

![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1653023448341-6b36c109-16e9-4005-9a7a-42d0dedf7756.png)

</details>

* **what：**

**useEffect是函数引入副作用的hooks。useEffect返回的函数称为** **清除函数，** **这个函数在组件卸载之前执行啊**

* **how：**

**Q：为啥需要react-hooks**

* **告别难以理解的Class**

<details class="lake-collapse"><summary id="udfaa9d2e"></summary>

1. **this**
2. **生命周期（一个生命周期里面会做特别多的事情）**

</details>

* **解决业务逻辑难以拆分的问题**
* **使状态逻辑复用变得简单可行**
* **函数式组件从设计思想上来看更加契合React的理念（这点参考why部分的结论）**

### React15栈调合

**调和（Reconciliation）就是把虚拟Dom映射成真实Dom的过程**

**Diff算法是调合的一个过程**

**Diff算法是找不同的过程，调和是使一致的过程**

### React16的Fiber调合

**栈调合的弊端**

**React15的栈调合是一个同步的递归过程，这就导致一个问题，JS对主线程的超时占用问题，导致浏览器不会及时渲染页面，造成卡顿**

**具体操作：**

**因为Diff是采用树的深度优先遍历，使用的是递归**

**Fiber的核心：可中断，可恢复，优先级**

**fiberNode节点，不同于之前的虚拟节点，每个 Fiber 节点对应一个 React element，注意一下，这里是对应，而不是等于。我们调用 render 函数产生的结果是 React element（jsx对象），而 Fiber 节点，由 React Element 创建而来。fiberNode构成的树就叫做fiber树啦。在 React 中最多会同时存在两棵Fiber树。当前屏幕上显示内容对应的Fiber树叫做 current Fiber 树，正在内存中构建的Fiber树叫做 workInProgress Fiber树，他们通过一个 alternate 属性连接，也就是所谓的"双缓存"**

![](https://cdn.nlark.com/yuque/0/2022/png/22614773/1653029368726-a825398a-e6ef-41e3-b937-1412d944418d.png)

### setState 到底是同步的还是异步的

**setState本身的调用时同步的，但是如果在同步代码中同时执行两个setState时不会执行2次的，因为setState是具备批处理机制的**

```javascript
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }
  
  componentDidMount() {
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);   
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);   

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val); 
      this.setState({val: this.state.val + 1};
      console.log(this.state.val);  
    }, 0);
  }

  render() {
    return null;
  }
};
// 输出
// 0 , 0 ,2 ,3
```

**因为setState是同步的嘛，当同时触发多次setState的话浏览器会一直被JS阻塞，那么浏览器就会卡顿，所以React会引入批处理机制，主要是为了将同一上下文中触发的更新合并为一个更新。**
