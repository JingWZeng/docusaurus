---
tags: [React]
---
JSX 的语法规则：

1. 定义虚拟 Dom 的时候，不要写引号
2. 标签中的 JS 表达式必须用{}包裹,是表达式不是 JS 代码，不是 JS 语句

> 区分 JS 语句【代码】和 JS 的表达式
>
> 1. 一个表达式会产生一个值，可以放在任何一个需要值的地方，以下都是表达式
>
>  1、a
>
>  2、a+b
>
>  3、demo(1)
>
>  4、arr.map() // 会返回一个数组
>
>  5、function test() {}
>
> 2. JS 语句
>
> 1、if(){}
>
> 2、for(){}
>
> 3、switch(){case:xxx}

3. 样式的类名指定不要使用 class，使用 className
4. 内联样式，要用 `style={{key:value}}`的形式去写，第一层的{}代表的是 JS 表达式，第二层代表是一个对象，所以 value

需要使用引号，如果是 font-size 属性这样的，需要写成 fontSize

5. 只有一个根标签
6. 标签必须闭合或者自闭合
7. 标签首字母

- 如果是小写字母开头，则将该标签转为 html 中的同名元素，如果 html 中找不到对应的话，就会报错。例如`<span>`
- 如果是大写字母开头，react 就去渲染对应的组件，如果组件没有对应，那就报错

##### 函数定义组件

```react
  function Demo() {
      console.log(this) // undefined babel编译后开启了严格模式，严格模式下不让this指向window
      return <h1>我是函数式的组件（适用简单组件的定义）</h1>
    }

    ReactDOM.render(
      <Demo />, // 这里要用大写，不然会被当成html里面去找，所以函数也要用大写
      document.getElementById('example')
    );
```

执行 ` ReactDOM.render(<Demo />....`之后，

1. react 解析了组件标签，找到了 Demo 组件，
2. 发现组件是使用函数调用的，随后调用该函数，
3. 将返回的虚拟 dom 转为真实的 dom，最后呈现在页面中。

##### 类的知识总结

1. 类中的构造器不是必须写的，要对实例进行初始化的操作，如添加指定的属性的时候才写
2. 如果 B 类继承了 A 类，而且 B 类中写了构造器，那么 B 类构造器中必须要调用 super([xxx]),xxx 调用参数写啥，得看 A 类
3. 类中定义的方法，都是放在了类的原型对象上，供实例去使用的。但是如果自身写了该方法，那么就不会去找原型对象上面的该方法了

#### 类定义组件

```react
    class HelloMessage extends React.Component {
        // render放在了HelloMessage的原型对象上，供实例去使用
      render() {
        return <h1>Hello world</h1>;
      }
      console.log(this) // 实例对象
    }
```

执行 ` ReactDOM.render(<HelloMessage />....`之后，发生了什么？

1. react 解析组件标签，找到了 HelloMessage 组件
2. 发现组件是用类定义的，随后 new 出来该类的实例对象（这里是 react 帮我做的，表面看不出来），并通过该实例对象调用到原型上的 render 函数(render 函数是定义在 HelloMessage 类里面的，类里面定义的方法放在了原型对象上面)。
3. 将 render 返回的虚拟 Dom 转成真实的 Dom，随后呈现在页面中

##### 类定义组件中的 this

```react
  class Weather extends React.Component {
      // 构造器调用几次？------ 只是一次
      constructor(props) {
        console.log('调用了'); // 只输出一次
        super(props)
        // 初始化状态
        this.state = { isHot: false, wind: '微风' }
        // 2.也可以在这里把原型对象的上的changeWeather复制一份到自身的实例对象上
        this.changeWeather = this.changeWeather.bind(this) // bind只改变this的指向，返回的是一个新的函数，要用的使用需要重新调用
        console.log(this);
      }
      // render调用几次？----1+n次，1是初始化的那次，n是状态更新的次数
      render() {
        console.log('render调用了');
        // 读取状态
        const { isHot, wind } = this.state
        return <h1 onClick={this.changeWeather}>今天的天气{isHot ? '炎热' : '凉爽'}，{wind}</h1>;
      }
      // 1. 可以使用箭头函数拿到实例的this
      // changeWeather = () => {
      //   // changeWeather放在了哪里？ ----- Weather的原型对象上，供实例使用
      //   // 用于changeWeather是作为onClick的回调使用的，所以不是通过实例调用的，而是直接调用
      //   // 类中的方法默认开启了严格模式，所以changeWeather中的this是undefined，本来是Window的
      //   console.log(this); // 现在是实例对象
      // }

      // changeWeather调用几次？ ----- 触发几次方法就调用几次呗
      // 此时调用的是自身的changeWeather，而不是调用的原型对象上的changeWeather
      changeWeather() {
        // changeWeather放在了哪里？ ----- Weather的原型对象上，供实例使用
        // 用于changeWeather是作为onClick的回调使用的，所以不是通过实例调用的，而是直接调用
        // 类中的方法默认开启了严格模式，所以changeWeather中的this是undefined，本来是Window的

        // 获取原来的isHot值
        // 严重注意。状态不能直接更改，这个就是直接更改 this.state.isHot = !isHot
        const isHot = this.state.isHot
        // 严重注意，状态必须通过setState进行更新,而且更新是单纯的更新需要变的，不需要变不用动，比如wind
        this.setState({ isHot: !isHot })
        console.log(this.state.isHot);
      }
    }
    ReactDOM.render(
      <Weather />,
      document.getElementById('example')
    );
```

![image-20211228094915134](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202112280949247.png)

![image-20211228095657352](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202112280956414.png)

简写：赋值语句和箭头函数

```react
        class Weather extends React.Component {
            // 初始化状态
            state = { isHot: false, wind: '微风' } // 类中的赋值语句就是让实例对象上添加属性
            render() {
                const { isHot, wind } = this.state
                return <h1 onClick={this.changeWeather}>今天的天气{isHot ? '炎热' : '凉爽'}，{wind}</h1>;
            }
            // 自定义方法
            changeWeather = () => {
                console.log(this);
                const isHot = this.state.isHot
                this.setState({ isHot: !isHot })
            }
            // 报错
            // changeWeather = function () {
            //     const isHot = this.state.isHot
            //     this.setState({ isHot: !isHot })
            // }

        }
        ReactDOM.render(
            <Weather />,
            document.getElementById('example')
        );
```

##### 啥叫回调函数

1. 是你自己定义的
2. 不是你调用的
3. 最终会被其他人调用

##### todoList 案例

注意点：

```markdown
    1.拆分组件、实现静态组件，注意：className、style的写法
    2.动态初始化列表，如何确定将数据放在哪个组件的state中？
    			——某个组件使用：放在其自身的state中
    			——某些组件使用：放在他们共同的父组件state中（官方称此操作为：状态提升）
    3.关于父子之间通信：
    		1.【父组件】给【子组件】传递数据：通过props传递
    		2.【子组件】给【父组件】传递数据：通过props传递，要求父提前给子传递一个函数
    4.注意defaultChecked 和 checked的区别，类似的还有：defaultValue 和 value
    5.状态在哪里，操作状态的方法就在哪里
```

##### react 的代理

在 src 文件下新建一个 setupProxy.js 文件

```js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api1", {
      //遇见/api1前缀的请求，就会触发该代理配置
      target: "http://localhost:5000", //请求转发给谁
      changeOrigin: true, //控制服务器收到的请求头中Host的值，欺骗服务器这样子，如果是false，因为我是3000端口请求的，服务器可以知道我是3000，如果写了，那我就变成了5000
      pathRewrite: { "^/api1": "" }, //重写请求路径(必须) 给服务器的请求地址，一开始带上了api1,这个时候服务器那边就显示我想请求的是api1/xxx,但是真正的请求地址是xxx，不带api1的
    }),
    createProxyMiddleware("/api2", {
      target: "http://localhost:5001",
      changeOrigin: true,
      pathRewrite: { "^/api2": "" },
    })
  );
};
```

> devServe 的存在就是说你本地跑的项目的地址，比如是 http://localhost:3000。就是你本地它帮你开服务器地址，同时这个路径代表的就是项目里面的 public 文件夹的路径。而服务器之间是没有跨域的，相当于啥呢，就是浏览器和本地的服务器 3000 和后端服务器 3 个人，利用本地的 3000 服务器来做代理，因为项目（浏览器）也是 3000 端口，本地的服务器也是 3000.所以没有跨域的存在。如果本地请求的东西不存在，就会返回项目里面的 pubilc 的 index.html。
>
> 前端路由跳转是不会请求网络数据的，但是如果直接使用多级路由来做每一个组件的路由，当你跳转路由之后刷新页面的话，样式可能会丢失，因为原本的样式请求地址可能被混入了前面那一级的路由。直接就返回了 pubilc 下的 index.html 了。
>
> **解决多级路径刷新页面样式丢失的问题**
>
> 1.public/index.html 中 引入样式时不写 ./ 写 / （常用）
> 2.public/index.html 中 引入样式时不写 ./ 写 %PUBLIC_URL% （常用） 3.使用 HashRouter，因为#号后面的东西都是前端的资源，不会带给本地的服务器的，也不会带给其他服务器。正常是不会用这种方法的。

##### react 脚手架配置代理总结

**方法一**

> 在 package.json 中追加如下配置

```js
"proxy":"http://localhost:5000"
```

说明：

1. 优点：配置简单，前端请求资源时可以不加任何前缀。
2. 缺点：不能配置多个代理。
3. 工作方式：上述方式配置代理，当请求了 3000 不存在的资源时，那么该请求会转发给 5000 （优先匹配前端资源）

**方法二**

1. 第一步：创建代理配置文件

   ```js
   在src下创建配置文件：src/setupProxy.js
   ```
2. 编写 setupProxy.js 配置具体代理规则：

   ```js
   const proxy = require("http-proxy-middleware");

   module.exports = function (app) {
     app.use(
       proxy("/api1", {
         //api1是需要转发的请求(所有带有/api1前缀的请求都会转发给5000)
         target: "http://localhost:5000", //配置转发目标地址(能返回数据的服务器地址)
         changeOrigin: true, //控制服务器接收到的请求头中host字段的值
         /*
         	changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
         	changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
         	changeOrigin默认值为false，但我们一般将changeOrigin值设为true
         */
         pathRewrite: { "^/api1": "" }, //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
       }),
       proxy("/api2", {
         target: "http://localhost:5001",
         changeOrigin: true,
         pathRewrite: { "^/api2": "" },
       })
     );
   };
   ```

说明：

1. 优点：可以配置多个代理，可以灵活的控制请求是否走代理。
2. 缺点：配置繁琐，前端请求资源时必须加前缀。

##### github 搜索案例

注意点

```markdown
    1.设计状态时要考虑全面，例如带有网络请求的组件，要考虑请求失败怎么办。
    2.ES6小知识点：解构赋值+重命名
    			let obj = {a:{b:1}}
    			const {a} = obj; //传统解构赋值
    			const {a:{b}} = obj; //连续解构赋值
    			const {a:{b:value}} = obj; //连续解构赋值+重命名
    3.消息订阅与发布机制
    			1.先订阅，再发布（理解：有一种隔空对话的感觉）
    			2.适用于任意组件间通信
    			3.要在组件的componentWillUnmount中取消订阅
    4.fetch发送请求（关注分离的设计思想）
    			try {
    				const response= await fetch(`/api1/search/users2?q=${keyWord}`)
    				const data = await response.json()
    				console.log(data);
    			} catch (error) {
    				console.log('请求出错',error);
    			}
```

#### React-route-dom

##### 路由的基本使用

```markdown
    	1.明确好界面中的导航区、展示区
    	2.导航区的a标签改为Link标签
    				<Link to="/xxxxx">Demo</Link>
    	3.展示区写Route标签进行路径的匹配
    				<Route path='/xxxx' component={Demo}/>
    	4.<App>的最外侧包裹了一个<BrowserRouter>或<HashRouter>
    	router相当于一个路由器，route相当于路由器上面的路由接口，没有路由器的话哪里来的路由接口
```

##### 路由组件与一般组件

```markdown
    	1.写法不同：
    				一般组件：<Demo/>
    				路由组件：<Route path="/demo" component={Demo}/>
    	2.存放位置不同：
    				一般组件：components
    				路由组件：pages
    	3.接收到的props不同：
    				一般组件：写组件标签时传递了什么，就能收到什么
    				路由组件：接收到三个固定的属性
    									history:
    												go: ƒ go(n)
    												goBack: ƒ goBack()
    												goForward: ƒ goForward()
    												push: ƒ push(path, state)
    												replace: ƒ replace(path, state)
    									location:
    												pathname: "/about"
    												search: ""
    												state: undefined
    									match:
    												params: {}
    												path: "/about"
    												url: "/about"
```

##### NavLink 与封装 NavLink

```markdown
    		1.NavLink可以实现路由链接的高亮，通过activeClassName指定样式名
```

##### Switch 的使用

```markdown
    		1.通常情况下，path和component是一一对应的关系。
    		2.Switch可以提高路由匹配效率(单一匹配)。

Switch 可以让路由匹配到一个路由之后就停下，单一匹配，因为正常情况下的话，路由会去和每一个注册进行检测的
```

##### 路由的严格匹配与模糊匹配

```markdown
    		1.默认使用的是模糊匹配（简单记：【输入的路径】必须包含要【匹配的路径】，且顺序要一致）
    		2.开启严格匹配：<Route exact={true} path="/about" component={About}/>
    		3.严格匹配不要随便开启，需要再开，有些时候开启会导致无法继续匹配二级路由
```

##### Redirect 的使用

```markdown
    		1.一般写在所有路由注册的最下方，当所有路由都无法匹配时，跳转到Redirect指定的路由
    		2.具体编码：
    				<Switch>
    					<Route path="/about" component={About}/>
    					<Route path="/home" component={Home}/>
    					<Redirect to="/about"/>
    				</Switch>
```

##### 嵌套路由

```markdown
    		1.注册子路由时要写上父路由的path值
    		2.路由的匹配是按照注册路由的顺序进行的
```

##### 向路由组件传递参数

```markdown
1.params 参数
路由链接(携带参数)：<Link to='/demo/test/tom/18'}>详情</Link>
注册路由(声明接收)：<Route path="/demo/test/:name/:age" component={Test}/>
接收参数：this.props.match.params
刷新也可以保留住参数（因为地址栏有显示），地址栏可以看到参数
2.search 参数
路由链接(携带参数)：<Link to='/demo/test?name=tom&age=18'}>详情</Link>
注册路由(无需声明，正常注册即可)：<Route path="/demo/test" component={Test}/>
接收参数：this.props.location.search
备注：获取到的 search 是 urlencoded 编码字符串，需要借助 querystring 解析
刷新也可以保留住参数（因为地址栏有显示），地址栏可以看到参数
3.state 参数
路由链接(携带参数)：<Link to={{pathname:'/demo/test',state:{name:'tom',age:18}}}>详情</Link>
注册路由(无需声明，正常注册即可)：<Route path="/demo/test" component={Test}/>
接收参数：this.props.location.state
备注：刷新也可以保留住参数、地址栏看不到参数。利用的是浏览器的 history 对象做的，如果你现在清空浏览器历史记录就看不到了
```

##### 编程式路由导航

```markdown
    			借助this.prosp.history对象上的API对操作路由跳转、前进、后退
    					-this.prosp.history.push()
    					-this.prosp.history.replace()
    					-this.prosp.history.goBack()
    					-this.prosp.history.goForward()
    					-this.prosp.history.go()
```

##### BrowserRouter 与 HashRouter 的区别

```markdown
    	1.底层原理不一样：
    				BrowserRouter使用的是H5的history API，不兼容IE9及以下版本。
    				HashRouter使用的是URL的哈希值。
    	2.path表现形式不一样
    				BrowserRouter的路径中没有#,例如：localhost:3000/demo/test
    				HashRouter的路径包含#,例如：localhost:3000/#/demo/test
    	3.刷新后对路由state参数的影响
    				(1).BrowserRouter没有任何影响，因为state保存在history对象中。
    				(2).HashRouter刷新后会导致路由state参数的丢失！！！
    	4.备注：HashRouter可以用于解决一些路径错误相关的问题。
```

#### redux

##### 求和案例\_redux 精简版

```markdown
    (1).去除Count组件自身的状态
    (2).src下建立:
    				-redux
    					-store.js
    					-count_reducer.js

    (3).store.js：
    			1).引入redux中的createStore函数，创建一个store
    			2).createStore调用时要传入一个为其服务的reducer
    			3).记得暴露store对象

    (4).count_reducer.js：
    			1).reducer的本质是一个函数，接收：preState,action，返回加工后的状态
    			2).reducer有两个作用：初始化状态，加工状态
    			3).reducer被第一次调用时，是store自动触发的，
    							传递的preState是undefined,
    							传递的action是:{type:'@@REDUX/INIT_a.2.b.4}

    (5).在index.js中监测store中状态的改变，一旦发生改变重新渲染<App/>
    		备注：redux只负责管理状态，至于状态的改变驱动着页面的展示，要靠我们自己写。
```

##### 求和案例\_redux 完整版

```markdown
    新增文件：
    	1.count_action.js 专门用于创建action对象
    	2.constant.js 放置容易写错的type值
```

##### 求和案例\_redux 异步 action 版

```markdown
     (1).明确：延迟的动作不想交给组件自身，想交给action
     (2).何时需要异步action：想要对状态进行操作，但是具体的数据靠异步任务返回。
     (3).具体编码：
     			1).yarn add redux-thunk，并配置在store中
     			2).创建action的函数不再返回一般对象，而是一个函数，该函数中写异步任务。
     			3).异步任务有结果后，分发一个同步的action去真正操作数据。
     (4).备注：异步action不是必须要写的，完全可以自己等待异步任务的结果了再去分发同步action。
```

#### react-redux

##### 求和案例\_react-redux 基本使用

```markdown
    (1).明确两个概念：
    			1).UI组件:不能使用任何redux的api，只负责页面的呈现、交互等。
    			2).容器组件：负责和redux通信，将结果交给UI组件。
    (2).如何创建一个容器组件————靠react-redux 的 connect函数
    				connect(mapStateToProps,mapDispatchToProps)(UI组件)
    					-mapStateToProps:映射状态，返回值是一个对象
    					-mapDispatchToProps:映射操作状态的方法，返回值是一个对象
    (3).备注1：容器组件中的store是靠props传进去的，而不是在容器组件中直接引入
    (4).备注2：mapDispatchToProps，也可以是一个对象
```

##### 求和案例\_react-redux 优化

```markdown
    	(1).容器组件和UI组件整合一个文件
    	(2).无需自己给容器组件传递store，给<App/>包裹一个<Provider store={store}>即可。
    	(3).使用了react-redux后也不用再自己检测redux中状态的改变了，容器组件可以自动完成这个工作。
    	(4).mapDispatchToProps也可以简单的写成一个对象
    	(5).一个组件要和redux“打交道”要经过哪几步？
    					(1).定义好UI组件---不暴露
    					(2).引入connect生成一个容器组件，并暴露，写法如下：
    							connect(
    								state => ({key:value}), //映射状态
    								{key:xxxxxAction} //映射操作状态的方法
    							)(UI组件)
    					(4).在UI组件中通过this.props.xxxxxxx读取和操作状态
```

##### 求和案例\_react-redux 数据共享版

```markdown
    	(1).定义一个Pserson组件，和Count组件通过redux共享数据。
    	(2).为Person组件编写：reducer、action，配置constant常量。
    	(3).重点：Person的reducer和Count的Reducer要使用combineReducers进行合并，
    			合并后的总状态是一个对象！！！
    	(4).交给store的是总reducer，最后注意在组件中取出状态的时候，记得“取到位”。
```

##### 求和案例\_react-redux 开发者工具的使用

```markdown
    	(1).yarn add redux-devtools-extension
    	(2).store中进行配置
    			import {composeWithDevTools} from 'redux-devtools-extension'
    			const store = createStore(allReducer,composeWithDevTools(applyMiddleware(thunk)))
```

##### 求和案例\_react-redux 最终版

```markdown
    	(1).所有变量名字要规范，尽量触发对象的简写形式。
    	(2).reducers文件夹中，编写index.js专门用于汇总并暴露所有的reducer
```

### react 扩展

#### setState

##### setState 更新状态的 2 种写法

```markdown
    (1). setState(stateChange, [callback])------对象式的setState
            1.stateChange为状态改变对象(该对象可以体现出状态的更改)
            2.callback是可选的回调函数, 它在状态更新完毕、界面也更新后(render调用后)才被调用

    (2). setState(updater, [callback])------函数式的setState
            1.updater为返回stateChange对象的函数。
            2.updater可以接收到state和props。
            4.callback是可选的回调函数, 它在状态更新、界面也更新后(render调用后)才被调用。

总结: 1.对象式的 setState 是函数式的 setState 的简写方式(语法糖) 2.使用原则：
(1).如果新状态不依赖于原状态 ===> 使用对象方式
(2).如果新状态依赖于原状态 ===> 使用函数方式
(3).如果需要在 setState()执行后获取最新的状态数据,
要在第二个 callback 函数中读取
```

### lazyLoad

#### 路由组件的 lazyLoad

```js
	//1.通过React的lazy函数配合import()函数动态加载路由组件 ===> 路由组件代码会被分开打包
	const Login = lazy(()=>import('@/pages/Login'))

	//2.通过<Suspense>指定在加载得到路由打包文件前显示一个自定义loading界面
	<Suspense fallback={<h1>loading.....</h1>}>
        <Switch>
            <Route path="/xxx" component={Xxxx}/>
            <Redirect to="/login"/>
        </Switch>
    </Suspense>
```

### 3. Hooks

#### 1. React Hook/Hooks 是什么?

```markdown
(1). Hook 是 React 16.8.0 版本增加的新特性/新语法
(2). 可以让你在函数组件中使用 state 以及其他的 React 特性
```

#### 2. 三个常用的 Hook

```markdown
(1). State Hook: React.useState()
(2). Effect Hook: React.useEffect()
(3). Ref Hook: React.useRef()
```

#### 3. State Hook

```markdown
(1). State Hook 让函数组件也可以有 state 状态, 并进行状态数据的读写操作
(2). 语法: const [xxx, setXxx] = React.useState(initValue)  
(3). useState()说明:
参数: 第一次初始化指定的值在内部作缓存
返回值: 包含 2 个元素的数组, 第 1 个为内部当前状态值, 第 2 个为更新状态值的函数
(4). setXxx()2 种写法:
setXxx(newValue): 参数为非函数值, 直接指定新的状态值, 内部用其覆盖原来的状态值
setXxx(value => newValue): 参数为函数, 接收原本的状态值, 返回新的状态值, 内部用其覆盖原来的状态值
```

#### 4. Effect Hook

```markdown
(1). Effect Hook 可以让你在函数组件中执行副作用操作(用于模拟类组件中的生命周期钩子)
(2). React 中的副作用操作:
发 ajax 请求数据获取
设置订阅 / 启动定时器
手动更改真实 DOM
(3). 语法和说明:
useEffect(() => {
// 在此可以执行任何带副作用操作
return () => { // 在组件卸载前执行
// 在此做一些收尾工作, 比如清除定时器/取消订阅等
}
}, [stateValue]) // 如果指定的是[], 回调函数只会在第一次 render()后执行

(4). 可以把 useEffect Hook 看做如下三个函数的组合
componentDidMount()
componentDidUpdate()
componentWillUnmount()
```

#### 5. Ref Hooks

```markdown
(1). Ref Hook 可以在函数组件中存储/查找组件内的标签或任意其它数据
(2). 语法: const refContainer = useRef()
(3). 作用:保存标签对象,功能与 React.createRef()一样
```

### 4. Fragment

#### 使用

```js
<Fragment><Fragment>
<></>
```

#### 作用

> 可以不用必须有一个真实的 DOM 根标签了

### 5. Context

#### 理解

> 一种组件间通信方式, 常用于【祖组件】与【后代组件】间通信

#### 使用

```js
1) 创建Context容器对象：
	const XxxContext = React.createContext()

2) 渲染子组时，外面包裹xxxContext.Provider, 通过value属性给后代组件传递数据：
	<xxxContext.Provider value={数据}>
		子组件
    </xxxContext.Provider>

3) 后代组件读取数据：

	//第一种方式:仅适用于类组件
	  static contextType = xxxContext  // 声明接收context
	  this.context // 读取context中的value数据

	//第二种方式: 函数组件与类组件都可以
	  <xxxContext.Consumer>
	    {
	      value => ( // value就是context中的value数据
	        要显示的内容
	      )
	    }
	  </xxxContext.Consumer>
```

### 注意

```markdown
在应用开发中一般不用 context, 一般都它的封装 react 插件
```

### 6. 组件优化

#### Component 的 2 个问题

> 1. 只要执行 setState(),即使不改变状态数据, 组件也会重新 render()
> 2. 只当前组件重新 render(), 就会自动重新 render 子组件 ==> 效率低

#### 效率高的做法

> 只有当组件的 state 或 props 数据发生改变时才重新 render()

#### 原因

> Component 中的 shouldComponentUpdate()总是返回 true

#### 解决

```markdown
办法 1:
重写 shouldComponentUpdate()方法
比较新旧 state 或 props 数据, 如果有变化才返回 true, 如果没有返回 false
办法 2:  
 使用 PureComponent
PureComponent 重写了 shouldComponentUpdate(), 只有 state 或 props 数据有变化才返回 true
注意:
只是进行 state 和 props 数据的浅比较, 如果只是数据对象内部数据变了, 返回 false  
 不要直接修改 state 数据, 而是要产生新数据
项目中一般使用 PureComponent 来优化
```

### 7. render props

#### 如何向组件内部动态传入带内容的结构(标签)?

```markdown
Vue 中:
使用 slot 技术, 也就是通过组件标签体传入结构 <AA><BB/></AA>
React 中:
使用 children props: 通过组件标签体传入结构
使用 render props: 通过组件标签属性传入结构, 一般用 render 函数属性
```

#### children props

```markdown
<A>
  <B>xxxx</B>
</A>
{this.props.children}
问题: 如果B组件需要A组件内的数据, ==> 做不到
```

#### render props

```markdown
<A render={(data) => <C data={data}></C>}></A>
A 组件: {this.props.render(内部 state 数据)}
C 组件: 读取 A 组件传入的数据显示 {this.props.data}
```

### 8. 错误边界

#### 理解：

错误边界：用来捕获后代组件错误，渲染出备用页面

#### 特点：

只能捕获后代组件生命周期产生的错误，不能捕获自己组件产生的错误和其他组件在合成事件、定时器中产生的错误

#### 使用方式：

getDerivedStateFromError 配合 componentDidCatch

```js
// 生命周期函数，一旦后台组件报错，就会触发
static getDerivedStateFromError(error) {
    console.log(error);
    // 在render之前触发
    // 返回新的state
    return {
        hasError: true,
    };
}

componentDidCatch(error, info) {
    // 统计页面的错误。发送请求发送到后台去
    console.log(error, info);
}
```

### 9. 组件通信方式总结

#### 方式：

```markdown
    props：
    	(1).children props
    	(2).render props
    消息订阅-发布：
    	pubs-sub、event等等
    集中式管理：
    	redux、dva等等
    conText:
    	生产者-消费者模式
```

#### 组件间的关系

```markdown
    父子组件：props
    兄弟组件(非嵌套组件)：消息订阅-发布、集中式管理
    祖孙组件(跨级组件)：消息订阅-
```
