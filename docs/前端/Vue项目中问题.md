---
tags: [Vue2]
---
- `computer`中传参数的话需要使用闭包的方式
- `filter`中无法访问 `this`,使用 `filter`的前提是有个现成的变量
- 数字千分位处理并保留两位小数 `nums.toFixed(2).replace(/(\d)(?=(\d{3}+.)/g,'$1')`
- `splice(index,1)`返回的数据是被删除的那个数据或者数组 ----- 会改变原数组
- `try/catch` 只能捕获同步函数的异常,包括 async/await
- `Vue`项目中报错 `Already include file name 'xxxx' differs from files name...`,解决办法是：去掉后面 `.vue`后缀名既可
- 页面刷新之后,会重新加载 `Vue`实例,`store`里面的值会被重新赋值,这样会造成页面刷新只会 `Vuex`中数据丢失的问题,解决办法是：利用 `Web`存储 `(cookie\localStorage\sessionStorage)`
- 每一个页面都是一个组件,路由跳转的时候组件就会被 `销毁和重新建立`,跳转会经历一个完整的生命周期
- `babel` 又名通天塔,它的作用是 `ES6`、`ES7`转成 `ES5`
- `CSS`中的行内元素水平居中直接在父元素中 `text-align:center`,垂直居中设置行高和高度相等:`height:10px;line-height:10px`
- `SSR`服务端渲染
  - 前后端分离的缺点(适合后台管理项目或者大量路由的项目)
    - `SEO`不友好:因为页面中只有一个 `div`,其他页面的操作是通过 JS 来进行的,`SEO`是通过爬取 `html`代码的,而不是 `JS`代码
    - 首屏加载慢:更多的加载和渲染的工作是由浏览器来完成的
    - 性能的问题:理由同上,频繁的和服务端进行数据交互
  - 解决上述办法->`SSR`服务端渲染(适合官网项目和推广页项目)
    - 简单来说就是服务端拿到数据进行解析渲染,直接生成 `html`片段返回给前端
    - 传统的服务端模板引擎渲染整个页面
    - 服务端渲染生成的 `html`代码块,前端通过 `ajax`获取然后通过 `JS`动态的添加
- 在 `js`文件中，也就是不在 `vue`文件中，需要得到 `vuex`里面的值的话，是木有办法拿到的，除非路由跳转才可以拿到，在 `vue`文件中需要在 `computed`中或者 `watch`才可以响应拿到，但是在 js 文件中，目前我的做法就是存放在 `cookie`或者 `sessionStorage`中了。

```js
computed:{
  getTotalCount(){
    return this.$store.state.totalCount
  }
}
```

---

#### Q1:如何让父组件加载时不加载子组件的方法？

父组件刷新加载的时候默认会执行子组件的生命周期，其实这是有两个前提的

1. 父组件的 `template`中使用了子组件
2. 子组件的请求是自发请求的，也就是请求方法挂在了某一个生命周期中

**解决办法**
把子组件中生命周期执行的方法，比如一些请求接口的调用，从 `mounted`或者 `created`中去掉，把这些请求封装成一个方法，在父组件中通过 `$ref`来换取该子组件，拿到该方法，在特定条件中去执行就可以了。

#### Q2:`el-drawe`想让侧边栏加个关闭的按钮？

需要把 `el-drawe`的 `overflow:hidden`属性改成 `visible`,不然的话整个抽屉的溢出隐藏了，按钮脱离抽屉就被隐藏掉了。之前一直以为是 `z-index`的问题，其实不是，如果是 `z-index`的问题的话，那其实整个抽屉都被隐藏掉了。

#### Q3:改变图标的大小？

在父元素中利用 `font-size`属性就可以啦

#### Q4:一个页面但是又好几个 `tabs`页应该如何组件代码？

利用动态组件的方法，在顶层设置一个父组件用来切换子组件的显示就很好了。

#### Q5:二次封装 `el-table`的时候如果在使用的时候，把数据源 `tableData`也一起放在 `computed`计算属性中，会造成表格数据与接口数据不同步的问题?

问题就出在了把 `tableData`放在了 `computed`里面，计算属性是依赖于 `data`里面的数据才会更新的，如果相关的 `data`数据不更新,它是有缓存作用的。

#### Q6:`el-form`中的表单验证怎么写好一点？

```js
name:[
  {required:true,validator:this.validName,trigger:'blur'}
]
methods:{
  validator(rule,value,callback){
    if(condition){
      return callback(new Error('请干啥干啥'))
    }
  }
}
```

以上就是想说明,把验证单独在 `methods`中写成一个函数，而不是推荐文档的写法，把验证写在 `data`上面，这样容易造成 `this`的指向问题。

#### Q7:碰到 `if-else`需要思考使用优化的方式?

利用三元运算符优化的时候，需要注意 `return`的写法,需要把 `return`提到最前面。

```js
// 返回最大值
return a > b ? a : b;
```

如果是 `if`条件下有多条语句的话，那么可以利用多条的三元运算符来做

```js
this.a = condition ? 20 : 0;
this.b = condition ? 10 : 0;
```

可以利用 `condition&&action`的模式来代替 `if(condition){action}`的形式。

#### Q8:vue 的非响应式？

`vue`的响应式的对象是初始化的时候放在 `data`里面的数据的操作，如果是正常的对象的话，会转成 `getter/setter`的方式来监听其变化。而对于数组的方式与 `getter/setter`不同，是通过拦截其原型上的方法来实现的。这里不重点讨论，主要是记录不能被处理成响应式的类型和处理方式。

**对于对象**

1. 想 data 里面的已经存在的对象，比如 person,本身具有 name 属性，继续向其添加 age 属性

```js
data(){
  return{
    person:{
      name:''
    }
  }
}
this.person.age = 20 //非响应式
```

解决方法:
利用 `this.$set(obj,[要添加的属性名],[属性值])`

`this.$set(person,age,20)`这样就可以变成响应式了。
如果需要添加多个属性的话,则需要使用 `Object.assign`或者 `this.$extend()`

```js
this.person = Objecet.assign({}, this.person, { age: 29, sex: "男" });
```

注意不要使用 `Object.assign(this.person,{age:29,sex:'男'})`。这样是没有用的，需要混合原对象来创建一个新的对象才行的。

2. 删除对象
   this.$delete(obj,[属性名])

````

**对于数组**

1. 直接利用下标来改变值`this.dataArr[1]=20`

解决方法:(2 种)

- `this.$set(dataArr,[index],[value])`，比如`this.$set(dataArr,1,20)`。这里需要注意的就是与对象的区别，第二个参数代表的是`index`,也就是数组的下标。
- 利用`splice`,简单的解释下该函数的用法，首先需要记住的是它返回的是被删除的数据组成的数组，可以改变原数组。
  ![](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202111122044145.png)

stash{num} `,`num`代表记录的顺序，利用`git stash list`可以看到，例 0,1,2,3...

> 1 个参数的时候,表示从下标值开始的地方到结尾的全部删除
>
> 2 个参数的时候,表示从第一个参数值的下标处开始删除几个(第二个参数决定删除几个)数据
>
> 3 个以上参数的时候，从第 3 个参数开始表示需要被添加的数据，从删除之后的原数据开始添加

所以可以使用`this.dataArr.splice(1,1,20)`，从下标为 1 的地方删除 1 个数据，然后把新的数据 20 加进去，相当于替换了下标为 1 的值。

2. 直接修改数组的长度`this.dataArr.length=4`
   解决办法:

利用`this.dataArr.splice(newlength)`

3. 同样输出数组的某个元素的响应式也可以利用
```js
this.$delete(dataArr,index)
````

4. 数组对象直接修改属性，可以触发视图的更新

```js
this.dataArr[0].name = "zjw";
this.dataArr.forEach((item) => {
  item.isShow = true;
});
```

5. 数组赋值为新数组，可以触发视图的更新。改变了原数组。

```js
this.dataArr = this.dataArr.filter(...)
this.dataArr = this.dataArr.concat(...)
```

6. `Vue`提供了以下数组的变异方法，可以触发视图的更新。
   > 其实这里涉及到 `Vue`关于数组响应式的原理，它是通过代理数组原型上的方法来实现的。
   >

```js
push();
pop();
shift();
unshift();
splice(); // 返回的是被删除的元素组成的数组
sort();
reverse();
```

#### Q9:vue 的组件懒加载？

正常的在 `script`引入子组件，生命周期是:
父组件 created -> 子组件 created -> 子组件的 mounted -> 父组件 mounted

```html
<script>
  import child from "./child.vue";
  export default {
    components: {
      child,
    },
  };
</script>
```

懒加载
父组件 created -> 父组件 mounted -> 子组件 created -> 子组件 mounted

```html
<script>
  export default {
    child: () => import("./child.vue"),
  };
</script>
```

#### Q10:解决 ESlint 和 prettier 的冲突?

`eslint-plugin-prettier`将 `Prettier`的规则设置到 `ESLint`的规则中。

`eslint-config-prettier` 关闭 `ESLint`中与 `Prettier`中会发生冲突的规则。

1. 安装

`yarn add eslint-plugin-prettier eslint-config-prettier -D`

2. 在 `.eslintrc.js`添加 `prettier`插件

```js
module.exports = {

 ...

 extends: [

  'plugin:vue/essential',

  'airbnb-base',

  'plugin:prettier/recommended' // 添加 prettier 插件

 ],

 ...

}
```

这样，我们在执行 `eslint --fix`命令时，`ESLint`就会按照 `Prettier`的配置规则来格式化代码，轻松解决二者冲突问题。
