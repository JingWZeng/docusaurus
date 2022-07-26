---
tags: [Markdown]
---
`<br/>+'要被写在下一行的内容'`

`<br/>`我被换行啦啦啦

#### 锚点

**标题的话**

语法就是 `[前台内容](#标题的名字)`。注意在 `typora`中测试锚点的话需要按住 `ctrl`键才行哦

[换行的锚点](#换行)

**非标题的话**

> 需要跳转的地方： `<p name="targets">我是目标位置</p>`
>
> 锚点处：`[前台内容]（#targets）`

`<a name="targets">`我是目标位置`</a>`

#### diff 代码块

```diff
+ import { onMounted, reactive, watchEffect } from 'vue'

export default {
  name: "App",

+  setup( props ) {
+    const state = reactive({ /*...*/ });
+    onMounted(() => { /*...*/ });
+    watchEffect(() => { /*...*/ });
+    return { state };
+  },

-  data: () => ({ state: /*...*/ }),
-  mounted(){ /*...*/ },
-  watch: { /*...*/ },
};
```

#### 折叠

语法：

```html
<details>
  <summary>Title</summary>

  content!!!
</details>
```

<details>

<summary>点击我打开</summary>

我是内容 over、over

</details>

[点我跳到目标位置](#targets)
