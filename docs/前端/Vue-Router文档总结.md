---
tags: [Vue-router]
---
#### 两种声明的方式

+ 声明式导航

```javascript
<router-link :to='about'></router-link>
<router-link :to='{path:'about'}'></router-link>
<router-link :to='{name:'about'}'></router-link>
<router-link :to='{name:'about',params:{userId:'123'}}'></router-link>
<router-link :to='{name:'about',query:{plan:'private'}}'></router-link>
```

+ 编程式导航
  动态路由匹配: `url`地址中有一部分是一样的,另外一部分是动态变化的,这些动态变化就是路由参数,也就是动态路由匹配。两种方式:

> 1. 用路由对象
> 2. 使用 `props`
>
> + 当 `props`是 `boolean`时候,路由对象里面的参数会被设置成组件的属性 `props:['id']`
> + 当 `props`是 `Object`时候,原样设置成组件的属性,没有设置在里面就拿不到
> + 当 `props`是 `function`时候,啥也可以获取,接受路由对象做为自己的形参

#### 路由导航守卫

路由的跳转是个大的过程,分为跳转前中后等等细小的过程,在每一个过程中有一 个相应的函教, 这个函数可以让你操作一些其他事情

1. 全局的(就是当触发路由的时候就会触发)
   + `beforeEach`
     路由还没有跳转之前就通知,防止跳转之后再告知就晚了,经常用来做登录的验证。
   + `beforeResolve`
     导航被确认之前,同时组件内守卫和异步路由组件被解析之后执行也就是在 `beforeEach`和组件内的 `beforeRouteEnter`之后,`afterEach`之前调用。
   + `afterEach`
     路由跳转完成之后触发
2. 路由独享的(就是在配路由的时候可以设置的钩子,该路由才有的)
   + `beforeEnter`
     和beforeEach是样的作用
3. 组件内部的(是指在组件内部执行的钩子函数,给该组件被配置在的路由添加生命周期的钩子函数)
   + `beforeRouterEnter`
     在 `beforeCreated`之前调用,是拿不到 `this`的,用 `this`是访问不了组件的实例对象的,可以通过 `next`函数,参数传入一个回调函数来获取组件实例,这个回调函数在路由被确认的时候就会调用。组件实例作为回调函故的参数。可以获取服务端的数据,当成功获取并能进入路由的时候,调用 `next`通过 `vm`访问组件实例进行赋值等操作。`next`中的函数调用在进入 `mounted`之后。

+ `beforeRouterUpdate`
  当前路由改变的时候,并且该组件可以通过 `this`访问实例。`/foo/1` 和 `/foo/2`之间跳转组件会被复用,当前的 `query`改变的时候,组件会被复用。
+ `beforeRouterLeave`
  导航离开该组件的路由的时候调用,可以访问该组件的实例 `this`

**参数**

1. `to` (目标路由对象)
2. `from` (即将离开的路由对象)
3. `next` (佛珠的线)
   + 但凡涉及到 `next`的钩子,必须调用 `next()`才可以继续执行下一个钩子,否则路由跳转就会停止
   + 中断导航用 `next(false)`。如果浏览器的地址改变了(用户手动、浏览器后退操作) `url`会重置到 `from`的地址(登录验证失败的时候处理)
   + `next('/')`或者 `next(path:'/')`当前的导航被中断,然后进行新的导航
   + 在 `beforeRouterEnter`中 `next(vm=>{})`内接受的回调函数的参数为当前组件的实例 `vm`,这个回调函数是在 `mounted`之后调用的,也就是说,他是所有的导航守卫和生命周期函数最后执行的
   + `next(error)`,导航被中断而且错误给 `router.onError()`注册过的回调函数
