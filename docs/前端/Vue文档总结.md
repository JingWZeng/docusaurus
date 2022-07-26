---
tags: [Vue2]
---
1. `data`对象所有的属性被加入到Vue的响应式系统(被创建的时候就已经存在才是,临时加入的不是)
   一开始的声明其实就是让他在创建的时候就存在。如果用如果用 `Objectfreeze(obj)`,阻止 `obj`修改自己的属性,所以响应式系统就不能追踪他的变化
2. `v-once`只执行一次插值,当数据改变的时候,插值的内容不会再更新
3. `v-html`可以把 `html`代码执行出来,用户提供的信息不要这样用,`Xss`攻击,只对可信的东西用就好。`Xss`攻击可以利用 `Xss`库进行配置
4. 用在 `html`属性上面不可以用 `{{}}`,需要用 `v-bind`的。其实如果 `v-bind`的属性是 `false`\ `null` \ `undefined`的话,渲染出来的该 `html`元素不会含有该属性的。`{{}}`和 `v-bind`中都可以放 `JavaScript`表达式,`v-bind`的属性名会被强制转换成小写,
5. `v-bind` 和 `v-on`的缩写

```javascript
:herf = "ur1"
//动态参對的缩写
:[key] = "url"

@click = "dosomething"
@[event] = "dosomething"
```

6. 计算属性的使用和普通属性一样绑定在 `html`元素上面
7. 插值可以调用 `methods`里面的方法
8. 计算属性有缓存,看的是它所对应的依赖是否改变,如果改变才会重新求值,如果没有变化,则不会。`methods`的话是每次调用都会执行的

```javascript
computed:{
    now:function(){
        //该属性now不会再更新,因为Date.now ()不是响应式依
        return Date.now()
    }
}
```

9. 当一些数据需要随着其他数据变动而变动的时候,你特别容易滥用 `watch`,其实用 `computed`会更好一点,`computed`可以监听到 `data`里面的响应式数据(做为计算属性的依赖之后)
10. 计算属性默认是只有 `getter`,有需要的时候需要自己提供 `setter`方法来做,就是更改属性的时候调用,做一下事情
11. `watch`:当数据变化的时候执行异步或者开销比较大的操作的时候
12. `class`和 `style`动态的切换 `class`,`class`和 `:class`是可以共存在个html元素上面的

```css
:class = obj或者:class=[]
/*这个obj/[]当然可以定义computer的返回值或者data里面
调用子组件时候使用:class会传入到子组件的class*/
```

13. `Vue`渲染的时候会复用些相同 `html`标签,有些需求是不可以被复用的,此时可以给该标签或者组件添加 `key`属性,确定唯一性。
14. `v-show`渲染的元素是始终存在 `dom`中的,只是控制 `display`的属性切换,`v-lf`会重复创建和销毁的,`v-show`不可以用在 `template`中,也不可以 `v-else`搭配使用
15. `v-for="(1,2)"`参数1是item,参数2是index.他们两个的位置不可以被改变
    遍历的是数组的时候

```javascript
v-for="item of itens"和v-for="item of items"效果是一样的
```

16. `v-for`被遍历的是对象的时候,`v-for="(value,key,index)"`第个参数是值,第二个键名,第三个是索引
17. 嵌套的 `v-for`中不要使用 `computed`方法
18. 访问原生的JS事件对象的时候,可以使用特殊变量 `$event`作为参数传到方法中
19. 事件修饰符

```javascript
//阻止事件继续传播
@click.stop
//提交事件不再加载页面
@submit.prevent
//捕获->目标->冒泡 内部触发的事件先在外部处理,之后才去内部元素处理
@click.capture
//事件自身才会触发
@click.self
//阻止所有的点击
@click.prevent.self
//阻止自身的点击
@click.self.prevent
//点击事件只会触发一次
@click.once
//不想阻止事件的默认行为,比如滚动事件的滚动行为
@:scroll.passive //--->不阻止默认事件的发生
```

20. 按键修饰符

```javascript
//arrowUp/pageDown等
@keyup.enter 
//keyCode
@keyup.13
//全局定义按键修饰符的名字
Vue.config.keyCodes.f1 = 112 //@keyup.f1
//兼容老的浏览器,为键盘起的小名
.enter/.tab/.delete<删除事件/退格键>/.esc/.space/.up/.down/.left/.right
```

21. 系统修饰符:按下响应的键才可以触发鼠标或者其他按键的事件

```javascript
.ctrl  .alt  .shift .meta<windows图标键>
// Alt + C
@keyup.alt.67
//Ctrl + click
@keyup.click.ctrl
//exact精确控制系统修饰符的组合触发的事件
//即使alt、shift被按下,也可以触发,因为按下ctrl+click就可以满足条件
@click.ctrl
//有且仅有ctrl被按下才会触发
@click.ctrl.exact
//没有任何系统修饰符按下才会触发
@click.exact

```

22. 鼠标修饰符

```javascript
.left
.right
.middle
```

23. `v-model`修饰符

```javascript
.lazy // 只有change事件发生的时候,才会同步数据
.number//自动将输入的值转number->parseFloat解析,无法解析的话,返回原始值
.trim//自动过滤输入的首尾空白字符
```

24.`$emit([事件名],args)`在父组件中可以通过 `$event`来得到这个 `args`的值
25. 动态组件用 `is`这个属性
26. 组件的名字全部小写而且用 `-`字符连接。在非模板字符串中,也就是不在 `template`中,无法使用 `<myComponent/>`,只能写成 `<my-component/>`
27. `props['myData']`,`props`中命名是驼峰,`html`会把它们全部转成 `kebab-case`。比如 `my-data`
28. 事件名用 `kebab-case`,因为 `html`会全部转成小写
29. `props`是单向数据流,父亲的数据会更新到儿子那边,所以是响应式的。儿子那边不能修改来自父亲的值,因为父亲更新会改变该值。解决办法:深拷贝一份数据,用来做其他的事情->分两种情况:

+ 如果是想把 `props`的值做为子组件本地的数据使用,可以在 `data`里面定义一个变量,把 `props`属性值给该变量
+ 如果是希望把 `props`里面的值做一个基础的原始值,在子组件中显示的话,可以防止 `computed`中做处理

30. `props`做自定义验证

```javascript
1. 
props:{
    foo:{
        validator:function(val){
            return ['success','warining','danger'].indxOf(val)!=-1
        }
    }
}
2.
props:{
    //判断是不是Perosn的实例
    author:Person
}
function Person(firstname,lastname){
    this.firstname = firstname
    this.lastname = lastname
}
```

31. `$attrs`与 `$listens`

```javascript
//在子组件中使用
1->2->3
//在2中用
`:$attrs` `@listens` ->接受1中没有进入`props`里面的其他属性和1的全部方法
//在3中用
接受1和2中没有进入 `props`里面的其他属性和1和2的全部方法
```

32.组件的 `.sync`修饰符就是让子组件做改变的时候同步到父组件中,和 `props`传值 `/$emit`中效果一样。组件中使用 `v-model`也可以实现

```javascript
<input v-model="something">
<input :value="something" @input="something=$event.target.value">
//在组件中使用v-model
{{title}}测试用的,(1)  //初始的title = '1111'
<Child v-model="title"/>
Vue.Component('Child',{
    template:`<div>
    {{value}}   ------------>用来测试(2),现在显示'1111'
    <button @click="change()">按钮</button>
    </div>,
    props:['value'], 
    methods:{
        change(){
            this.$emit('input','22222') --------------> 一定要触发input事件,点击之后测试(1)/(2)变成'22222'
        }
    }
    `
})
```

33. `keep-alive`可以用来保存切换之后页面的存在状态
34. `filters`中用着 `{{}}/v-bind`中,用|隔开,`原始值|过滤方法A|过滤方法B`,`A`得到的结果到 `B`。或者 `value|A(arg1,arg2)`
35. 对象和数组,`Vue`无法检测它们的变化,解决办法:

```javascript
1. 对于对象---> set向嵌套对象添加响应式的数据
this.$set(this.obj,[属性名],value)
//如果是添加多个属性,需要让原对象与要混合的进去的属性组合成一个新的对象
this.someObj = Object.assign({},this.someObj,{a:1,b:2})
2. 对于数组--->实现vm.items[index]= newVal的效果--->这种不是响应式的,下面的才是
//set
this.$set(vm.items,index,newVal)
//splice
this.items.splice(index,1,newVal)
```

36. `$parent`可以访问父亲的 `data`属性,但最好不要这样做。`ref`给我一个组件的 `id`,通过 `this.$refs.[id]`来访问,refs不是响应式的,所以不应该在模板中或者 `computed`使用
37. `nextTick()`

```javascript
//tick的意思是一次事件循环->保证虚拟dom被挂在真是dom之后立刻执行,数据被更新到dom之后立刻执行
1. Promise
methods:{
    updataMsg(){
        this.msg = '已更新'
        console.log(this.$el.textContent) //未更新
        this.$nextTick(()=>{
            console.log(this.$el.textContent)//已更新
        })
    }
}
2.Async/Await
methods:{
   async updataMsg(){
        this.msg = '已更新'
        console.log(this.$el.textContent) //未更新
        await this.$nextTick
       console.log(this.$el.textContent)//已更新
  
    }
}
```
