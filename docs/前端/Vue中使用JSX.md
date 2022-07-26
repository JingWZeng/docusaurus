---
tags: [Vue2]
---
### JSX 使用理由

每个组件上都有一个 `render`函数,其写法是 `this.$createElement('div', {}, [...])`,非常的不直观，`JSX`可以改进这种写法，使其更加直观方便。

> 注意: 如果在组件上定义了 `render`方法，则 `Vue`将忽略 `template`定义。因为 `template`最终还是需要编译成 `render`的格式。

### 啥叫 JSX 呢

> JSX 是 JavaScript 的类似 XML 的语法扩展，没有任何定义的语义。

通过 `babel`将 `JSX`转成 `JS`。简单来说呢，`JSX`就是在 `JS`中写类似 `HTML`的语法。

如果使用的 `Vue-cli`大于或等于 3.0 版本，那么就直接可以使用 `JSX`的语法了。

### 在 Vue 中使用 JSX 需要注意的地方

- 要监听 `JSX`中的事件，我们需要 `“on”`前缀。 例如，将 `onClick`用于单击事件。

```javascript
 render (createElement) {
     return (
         <button onClick={this.handleClick}></button>
     )
 }
```

- 绑定变量，注意这里不是使用 `:`

```javascript
 render (createElement) {
     return (
         <button content={this.generatedText}></button>
     )
 }
```

- 将 `HTML`字符串设置为元素的内容，使用 `domPropsInnerHTML`而不是使用 `v-html`

```javascript
 render (createElement) {
     return (
         <button domPropsInnerHTML={htmlContent}></button>
     )
 }
```

- 我们也可以展开一个大对象：

```javascript
 render (createElement) {
     return (
         <button {...this.largeProps}></button>
     )
 }
```

### 导入 JSX 组件

在 `Vue`中使用 `JSX`的另一个好处是，我们不再需要注册所需的每个组件。 我们只是导入和使用。组件的正常使用是需要注册的。

```js
import { Button } from "../components";

export default {
  render(createElement) {
    return <Button primary={true}>Edit</Button>;
  },
};
```
