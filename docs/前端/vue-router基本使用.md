---
tags: [Vue-router]
---
### 路由的基本使用方法

`vue-router`的使用分为三步

1. 引入 `vue-router`，并使用 `Vue.use(VueRouter)`
2. 定义路由数组 `const routes = {}`，并将数组 `routes`传入 `VueRouter实例`，并将实例暴露出去 `export default new VueRouter({ routes})`
3. 将 `VueRouter`实例引入到 `main.js`，并注册到根 `Vue`实例

> 注意：this.$route、this.$router
>
> - this.$route：表示的是当前的路由信息。`this.$route.matched `是一个数组，包含了当前路由的所有的嵌套记录，即是`routes `配置中的对象数组，包括自己的信息和`children`数据。
> - this.$router：表示的是全局的路由信息。通过`vue`根实例中注入`router`实例，然后再注入到每个子组件，从而让整个应用都有路由功能。所有的页面都可以访问。比如常用的是`this.$router.push()`。如果提供了`path `，`params`会被忽略，例如：
>
>   `this.$router.push({path: 'home', params: { page: 2}}) `这里的 `params`会被忽略。同样的规则也适用于 `router-link`的 `to`属性

> 使用 `route-link`组件进行路径跳转
>
> 使用 `router-view`组件进行路由对应内容展示

![0](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202109291625624.jpg)
