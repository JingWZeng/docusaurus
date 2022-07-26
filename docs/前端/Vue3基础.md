---
tags: [Vue3]
---
#### Fragment

vue3 中 template 中不一定只要一个 div 进行包裹，可以有多个

#### script

```js
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    setup(){

        return{} // 这里返回的属性方法会合并到data函数中和methods对象里面
    }
})
</script>
```

- 使用 TS 的话只需要标记 `lang="ts"`
- `defineComponent`用来创建一个组件

#### setup

- 组合式 API 的入口
- setup 是在 `beforeCreate`之前执行的，所以里面是没有 this 的，`this==='undefined'`，因此 setup 里面无法访问 data 里面的属性和 methods 里面的函数。
- setup 的返回值，返回的属性是合并到 data 函数里面的，返回的方法是合并到 methods 对象里面的，所以组件中利用 this 可以访问到返回的东西。
- Suspense 组件，翻译过来就是不确定的。因为 setup 会返回数据，那么一些接口的调用，返回的是 Promise，是没有正常使用的。解决的方案就是在父组件调用子组件的时候，包一个 `<Suspense></Suspense>`组件。

```js
// child.vue
<template>
    {{res.data.name}}
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    setup(){
        const res = await axios.get('https://api.github.com/users/[github的用户名]')
        return{
            res
        }
    }
})
</script>
```

```js
// parenet.vue
<template>
  <Suspence>
    <child />
  </Suspence>
</template>
```

- setup 的参数 `setup(props,context)`。props 就是父组件传递给子组件的 props，context 是上下文参数，包含 4 个属性，最常用的是 `attrs`、`slots`、`emit`，分别是除了 props 以外的其他属性、父组件传入插槽的内容、用于父子组件之间的通行。

#### ref

作用就是转成响应式，因为 `setup`里面写的数据都不是响应式的，修改了数据的时候，视图是不会改变的。一般用于基础的数据类型。

```js
setup(props，context){
    let num = ref(10)
}
```

ref 的另一个作用是用来获取 dom 元素

```html
<div ref="hello"></div>
```

```js
setup(props,context){
    let hello = ref<HTMLElement|null> = (null)
    return {
        hello // 要在外面使用，一定需要return出去，不return的话其实hello是null
    }
}
mounted(){
  this.hello && (this.hello.style.color = 'red') //注意这里hello可能是null
}
```

#### reactive

作用也是转成响应式，不过是把对象转成响应式。利用的是 `Proxy`，接受一个对象然后返回这个普通对象的响应式代理。而且它是深层的代理，做了递归处理的。

但是 `shallowReactive`的作用和 `reactive`一样，只是把第一层的对象转成了响应式。

```js
setup(props，context){
    let obj = reactive({
      name: '小狼',
      age: 20,
      phone: {
        number: 123456,
        IdCard: {
          hasRegister: true
        }
      }
    })
    function updateIdCard() {
      obj.phone.IdCard.hasRegister = !obj.phone.IdCard.hasRegister
    }

}
```

![image-20211122152238510](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202111221522618.png)

如果利用 ref 来响应式对象的话,可以看出 ref 的 value 其实就是利用 reactive 的原理来做的。

```js
setup(props,context){
   let obj2 = ref({
      name: 'zengxpang',
      sex: 'boy'
    })
    console.log({ obj2 })
}
```

![image-20211122153354608](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202111221533648.png)

#### toRefs

这个方法可以把经过 reactive 处理过后的响应式对象，变得可以解构。正常情况下，对响应式对象进行解构的话，那么就会让这个对象失去响应性的特性。

#### toRef

它的作用和 toRefs 差不多，只不过 toRefs 转一个对象的所有属性，它就转某一个属性。

#### shallowRef 与 shallowReactive

shallowReactive 就是只转第一层对象为响应式。之前说的 ref 也可以转一个对象，实际上调的是 reactive 嘛，也就是 ref 对象上的 value 属性调了 reactive，也是递归调用。同理，shallowRef 其实内部的 value 也是调用 shallowReactive。也就是说，只是对 ref 的 value 进行了响应式的处理。shallowRef 是可以自动追踪到更新，但是不会对更改之后的 value 做处理，也就是视图无法更新。

```js
ref({
  name: "zengxpang",
});
// 等价于
const value = {
  name: "zengxpang",
};
reactive(value); // reactive(value:{name:'zengxpang'})
```

#### readonly 和 shallowReadonly

readonly 深度只读，哪里都不可以更改；shallowReadonly 第一层只读。

#### toRaw 和 markRaw

toRow 就是把响应式对象转回普通的对象，markRaw 就是标记一个对象，被标记的话就永远不可以转成响应式对象。`raw`翻译回来就是未加工的。

#### computed

```js
<template>
  <div class="about">
    <input type="text" v-model="name" />
    <br />
    <input type="text" v-model="age" />
    <br />
    <input type="text" v-model="getInfo" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
export default defineComponent({
  name: 'About',
  data() {
    return {}
  },
  setup(props, context) {
    let name = ref('zengxpang')
    let age = ref(21)
    let getInfo = computed({
      get() {
        return `${name.value},${age.value}`
      },
      set(val: string) {
        let arr = val.split(',')
        name.value = arr[0]
        age.value = +arr[1]
      }
    })
    return {
      name,
      age,
      getInfo
    }
  }
})
</script>
```

![image-20211122162242190](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202111221622224.png)

#### watch

watch 是惰性的，也就是只有依赖数据发生改变的时候才会触发回调函数，解决惰性的方法是设置 `immediate`为 true

```js
<template>
  <div class="two">
    <input type="text" v-model="name" />
    <br />
    <input type="text" v-model="age" />
    <br />
    <input type="text" v-model="watchName" style="width: 400px" />
  </div>
</template>

<script lang="ts">
/**
watch(data,handler,object)
data：可以是返回值的 getter 函数，也可以是 ref
handler：回调函数 回调函数的参数是 (新值,旧值)
object：可选配置项 { immediate: true }
 */
import { defineComponent, watch, ref } from 'vue'
export default defineComponent({
  name: 'About',
  data() {
    return {}
  },
  setup(props, context) {
    let name = ref('zengxpang')
    let age = ref(20)
    let watchName = ref('')
    watch(
      [name, age],
      (newNameAndAge, oldNameAndAge) => {
        watchName.value = `new: ${newNameAndAge},old:  ${oldNameAndAge}`
      },
      {
        immediate: true
      }
    )
    return {
      name,
      age,
      watchName
    }
  }
})
</script>
```

如果监听的对象是 reactive 转成响应式的话，会出错。监听的 newInfo 和 oldInfo 返回都是当前最新的那个值，就算 deep 为 true 也是一样？？？利用函数的写法进行改进

```js
<template>
  <div class="two">
    <input type="text" v-model="user.name" />
    <br />
    <input type="text" v-model="user.age" />
    <br />
  </div>
</template>

<script lang="ts">
/**
watch(data,handler,object)
data：可以是返回值的 getter 函数，也可以是 ref
handler：回调函数 回调函数的参数是 (新值,旧值)
object：可选配置项 { immediate: true }
 */
import { defineComponent, watch, ref, reactive } from 'vue'
export default defineComponent({
  name: 'About',
  data() {
    return {}
  },
  setup(props, context) {
    let user = reactive({
      name: 'zengxpang',
      age: 20
    })
    let watchInfo = ref('')
    watch(
      user,
      (newInfo, oldInfo) => {
        console.log(newInfo === oldInfo) //true
      },
     // { deep: true }  // 打开深度监听也是出错
     /*
     解决办法：
     ()=>user,
     (newInfo.oldInfo) => {} // 如果user是第二层或者以下二段属性，还需要设置deep:true
     */
    )
    return {
      user,
      watchInfo
    }
  }
})
</script>

```

#### watchEffect

这个也是用来监听数据变化，默认就会执行一次所以这里就不需要配置，而且不用指定 `data`,使用哪些响应式数据就监听哪些。它不是惰性的哦，一开始就会执行。

```js
let user = reactive({
  name: "zengxpang",
  age: 20,
});
watchEffect(() => {
  console.log(user.name);
  console.log(user.age);
});
```
