---
tags: [Vue3]
---
#### Q1:父组件中在 setup 如何才能拿到子组件的 ref 的 Dom 节点？

```typescript
// 子
<template></template>
<script lang="ts">
import { defineComponent, ref, reactive, h } from 'vue'
export default defineComponent({
  name: 'myB',
  setup(props, { expose }) {
    const read = ref(0)
    const book = reactive({
      title: 'Vue3 Guide'
    })
    const reset = () => {
      console.log(`某些重置逻辑`)
    }
    // expose只能被调用一次，可以在父组件中通过ref访问到
    expose({
      reset
    })
    return () => h('h3', [read.value, book.title])
  }
})
</script>
<style lang="scss" scoped></style>
```

```typescript
<template>
  <myBVue ref="myBVue"></myBVue>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watchEffect } from 'vue'
import myBVue from './components/myB.vue'
export default defineComponent({
  name: 'Test',
  components: {
    myBVue
  },
  setup() {
    const foo = ref(Symbol('zengxpang'))
    const myBVue = ref()
    console.log(myBVue) // null setup是发生在beforecreate之前的，Dom结构还没渲染出来
    onMounted(() => {
      //
      myBVue.value && myBVue.value.reset()
    })
    watchEffect(
      () => {
        console.log(myBVue.value)
      },
      {
        flush: 'post' // 确保模板更新之后才监听
      }
    )
    return {
      foo,
      myBVue  //注意一定到return出去
    }
  }
})
</script>
<style lang="scss" scoped></style>
```

#### Q2:setup 中 provide/inject 如何做类型确认？

利用 `InjectionKey`或者断言 `as`,不推荐利用断言，因为如果类型变了，需要一个一个手动改

```typescript
// @/type/index.ts
// 用户信息
export interface UserInfo {
  username: string;
}
// 设置用户信息
export type SetUserInfo = (newInfo: UserInfo | undefined) => void;
```

```typescript
// @/symbols/index.ts
import { InjectionKey, Ref } from "vue";
import { UserInfo, SetUserInfo } from "@/types/type";

// 全局的用户信息InjectionKey
export const userInfoKey: InjectionKey<Ref<UserInfo | undefined>> = Symbol();
// 全局的设置用户信息方法 InjectionKey
export const setUserInfoKey: InjectionKey<SetUserInfo> = Symbol();
```

父组件中使用

```typescript
import {
  defineComponent,
  ref,
  onMounted,
  inject,
  watchEffect,
  provide,
  InjectionKey,
} from "vue";

// 初始化
const userInfo = ref<UserInfo | undefined>(undefined);
const setUserInfo: SetUserInfo = (newInfo) => (userInfo.value = newInfo);
// 提供出去
provide("userInfo", userInfo);
provide("setUserInfo", setUserInfo);
```

子组件中使用

```typescript
import { setUserInfoKey, userInfoKey } from "@/symbols";
const userInfo = inject(userInfoKey);
const SetUserInfo = inject(setUserInfoKey);

// 断言的方式，不推荐使用
import { SetUserInfo, UserInfo } from "@/types/index";
const userInfo = inject("userInfo") as UserInfo; // 如果不用断言的话，userInfo此时的类型是unknown
const SetUserInfo = inject("setUserInfo") as SetUserInfo;
```

#### Q3:setup 中 onRenderTracked 和 onRenderTriggered 钩子函数区别？

`onRenderTracked`一个是散弹枪，`onRenderTriggered`一个是狙击枪。一个是作为依赖被追踪的时候触发，也就是作为依赖被读取到的时候，一个是这个依赖被修改的时候触发，里面一般写个 debugger 语句来调试。

`onRenderTracked`跟踪虚拟 `DOM`重新渲染时调用。钩子接收 `debugger event`作为参数。此事件告诉你哪个操作跟踪了组件以及该操作的目标对象和键。会打印所有的，一般只在首次进入页面的时候打印。
`onRenderTriggered`作用和 `onRenderTracked`一样，但是它是精准打印，在调式的时候可以知道是哪个东西引起页面重新渲染的，只要去改变某个东西引起页面重新渲染就会打印。

```js
//debugger event的参数说明
key 那边变量发生了变化
newValue 更新后变量的值
target 目前页面中的响应变量和函数
```

最后一点：它们都是在开发环境下才有用的，用来调试。生产环境下无用。

#### Q4:watchEffect 的清除副作用 onInvalidate 是啥意思？

了解这个之前首先需要知道几个概念：

**vue2 Vs vue3**

vue2 利用的是对象编程的思想 oop，对外的编程模式就是：对象调用自己的数据和方法-`this.xxx`的操作。在 vue3 中的 setup 中，是无法使用 this 的，对外的编程方式变成了让函数来调用对象或者另一个函数，也即是 FP 函数式编程的特点。

**纯函数和副作用**

既然 vue3 是函数式的编程方式，那就得遵守 FP 的规则---一个函数应该只做一件事（这就是纯函数）。

纯函数的特点

1. 相同的输入产生相同的输出
2. 不能有副作用

啥事副作用？在一个 vue 的组件中可能需要做很多的事情

- 获取数据
- 事件监听或订阅
- 改变应用状态
- 修改 DOM
- 输出日志

这些改变其实就是副作用。因为在 vue3 中，不推荐像 vue2 那样子通过 `this.$axios`、`this.$route`等来全局调用插件，而是通过间接的方式---也就是通过函数的方式来调用（这些函数往往就是会包含副作用，也需要做其他的事情）。vue3 提供了一个通用的副作用的钩子函数

`watchEffect`。

现在应该说我们的主角 `onInvalidate`啦

`watchEffect`的第一个参数是 effect 函数，effect 函数自己也有个参数，就是 `onInvalidate`,`onInvalidate`也是个函数，作用就是来清除里面的异步方法的副作用（虽然现在还想不到具体的使用场景）

`onInvalidate`的调用条件：前提是只作用于异步函数。并且只有以下两种情况才会被调用

1. 当 effect 函数被重新调用的时候
2. 当监听器被注销的时候（组件被卸载或者人为的显示注销[watchEffect 会返回该监听器，只需要调用该实例的 `stop`方法就行]）

```js
import {asyncAction} from './asyncAction' // 异步操作，比如接口调用？

setup(){
    const id = ref(0)
    watchEffect((onInvalidate)=>{
        const token = asyncAction(id.value)
        onInvalidate(()=>{
            // 取消异步函数的副作用，当id被改变或者该watchEffect实例被注销的时候调用
            token.cancel()
        })
    })
}
```
