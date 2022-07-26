---
tags: [滚动条]
---
#### el-scrollbar 用法

官方文档没有写出来。记录下！！！

```html
<template>
  <div>
    <h2>list:</h2>
    <el-scrollbar
      wrap-style="font-weight:bold" // 这个貌似不起作用？一般不用
      wrap-class="list" // 增加class
      view-style="font-weight:bold;color:blue"// 增加行内样式，一般不用
      view-class="view-box" // 增加class
      :native="false"
    >
      <div v-for="value in num" :key="value">
        {{ value }}
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      num: 20,
    };
  },
};
</script>

<style lang="scss">
/*展示列表的区域，超过200px出现滚动条*/
.list {
  max-height: 200px;
}
</style>
```

![image-20211026193925087](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202110261939203.png)

![image-20211026194313480](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202110261943517.png)

![image-20211026194459067](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202110261944105.png)
