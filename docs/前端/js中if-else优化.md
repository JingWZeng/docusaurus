---
tags: [if/else优化]
---
### 单个 if

```js
// before
if (flag) {
  handler();
}
```

```js
// pref
flag && handler();
```

#### if/else

##### 排非

```js
// before
if (user && password) {
  // 逻辑处理
} else {
  throw "用户名和密码不能为空!";
}
// pref
if (!user || !password) return throw "用户名和密码不能为空!";
```

##### 三元

```js
// pref
condition ? successHandler() : failHandler();
```

#### 单个 if 多条件

```js
// before
function isImage(type){
    if(type === 'jpg' || type === 'gif' || type = 'png' || type === 'webp'){
        console.log('图片')
    }
}
// pref
const imgArr = ['jpg','gif','png','webp']
imgArr.includes(type) && console.log('图片')
```

#### 多个 if/else

```js
// before
if (this.type === "A") {
  this.handlerA();
} else if (this.type === "B") {
  this.handlerB();
} else if (this.type === "C") {
  this.handlerC();
} else if (this.type === "D") {
  this.handlerD();
} else {
  this.handlerE();
}
// pref 利用key-value对象或者Map，推荐Map。不推荐用switch代替
let conditionType = new Map([
  ["A", handlerA],
  ["B", handlerB],
  ["C", handlerC],
  ["D", handlerD],
  ["E", handlerE],
]);

function action(type) {
  let handler = conditions.get(type);
  handler();
}
```
