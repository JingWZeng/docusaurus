---
tags: [异步编程]
---
异步是啥？程序的不连续执行就是异步,一个任务分几个部分,几个时间段完成

同步就是程序连续执行,1没执行完2就只能等着

### 回调函数

> `JS`对异步编程的实现,就是回调函数。把异步任务的第二段单独写在一个函数里面,等异步任务的第一段执行完毕的时候,就调用这个函数啊

```javascript
fs.readFile('etc/passwd',function(err,data){
    if(err) throw err
    console.log(data)
})
```

上述代码中,`readFile`函数的第二个参数,就是回调函数,也就是任务的第二段,等到操作系统返回 `/etc/passwd`这个文件之后,回调函数才会执行。

回调函数的第一个参数是 `err`(如果没有错误,该参数就是 `null`)?原因是执行分为两段,在这两段之间抛出的错误,程序无法捕捉,只能当成参数,传入第二段.

### Promise

回调函数本身没问题,问题在于多个回调函数的嵌套。假定读取A文件之后,再读取B文件 。造成回调噩梦 `callback hell`

```javascript
fs.readFile(fileA,function(err,data){
    if (err) throw err  // 捕获读取A失败的错误
    fs.readFile(fileB,function(err,data){
        if(err) throw err // 捕获读取B失败的错误  捕获读取A失败的错误其实可以不写,放在B这里捕获
        // ...
    })
})


```

`Promise`不是一种新的语法,而是一种新的回调函数的写法,解决了 `callback hell`的问题。`then`方法加载回调函数,`catch`方法捕获执行第一段和第二段之间的错误

```javascript
let readFile = require('fs-readfile-promise')//返回一个Promise版本的readFile函数
 readFile(fileA)
.then(function(data){ //加载完fileA文件之后,再去执行then里面的回调函数
     console.log(data.toString())
 }).then(function(){
     return readFile(fileB) // A读取完毕,开始加载B
 }).then(function(data){
     console.log(data.toString ())//加载完fileB文件之后,再去执行then里面的回调函数
 }).catch(function(err){
     throw err // 捕获整个加载过程之中抛出的错误
 })
```

`Promise`的缺点就是代码冗余,一堆的 `then`,语义不清晰

### Generator

`Generator`函数是协程在 `ES6`中的实现,最大的特点就是可以交出函数的执行权(即暂停执行)

```javascript
// Genertor可以进行函数体内外部的数据交换和部署错误处理代码
function *gen(x){
    try{
        var y = yield x + 2 // yield 就是暂停
    }.catch(e){
        console.log(e)
    }
    return y
}

let g = gen(1)
g.next()// 返回第一个yield的结果 {value:3,done:false}
g.next()// {value:undefined,done:true} g.next(2)=> {value:2,done:true}
g.throw('出错了') // 可以被里面的try...catch代码块捕获
```

实际例子

```javascript
let fetch = require('node-fetch')
function* gen(){
    let url = "https://github.com/users/github"
    let result = yield fetch(url)
    console.log(result.data)
  
}
// 执行代码
let g = gen()
let res = g.next() //得到{value:result(Promise),done:false}
// fetch返回的是一个Promise对象,所以用then方法来调用下一个next,then方法等fetch返回完毕后才执行,里面是任务的第二段.拿到result返回结果,再return结果出来
res.value.then(function(data){
    return data.json()
}).then(function (data){
    g.next(data)
})
```

`Generator`的缺点：流程管理不方便(何时执行第一阶段、何时执行第二阶段) **基本不用它**

### Async/Await

`async/await`是Generator的语法糖,`*`换成了 `async`,`yield`换成了 `await`。`async `函数是 `ES7`的语法功能,不过可以在开发中正常使用,因为 `Babel`已经支持,经转码之后就可以使用。

+ 指定50毫秒之后,输出“hi”

```javascript
function timeout(ms){
    return new Promise((resolve)=>{
        setTimeout(resolve,ms)
    })
}
async function xxx(value,ms){
    await timeout(ms)
    console.log(value)
}
xxx('hi',50)
```

+ `await`后面的 `Promise`对象,运行的结果可能是 `rejected`,所以最好把 `awai`t命令放在 `try...catch`代码块之中

```javascript
async function fun(){
    try{
        await somethingReturnPromise()
    }catch(err){
        console.log(err)
    }
}

//另一种写法
async function fun(){
    await somethingReturnPromise().catch(err=>{
        console.log(err)
    })  
}
```

+ `forEach`方法的参数改成 `async`函数,也会有问题,原因是三个 `db.post`操作是并发执行,也就是同时执行,而不是继发执行

```javascript
async function dbFunc(db){
    let docs = [{},{},{}]
    // 可能得到错误的结果
    docs.forEach(async function(doc){
        await db.post(doc)
    })
}
// 正确的做法是使用for循环
for(let doc of docs){
    await db.post(doc)
}
```

+ 如果希望多个请求并发执行,可以使用 `Promise.all`

```javascript
async function dbFunc(db){
    let docs = [{},{},{}]
    let promises = docs.map(doc=>{
        db.post(doc)
    })
    let result = await Promise.all(promises)
    console.log(result)
}

// 或者使用下面
async function dbFunc(db){
    let docs = [{},{},{}]
    let Promises = docs.map(doc=>{
        doc.post(doc)
    })
    let result = []
    for(let promise of promises){
        result.push(await promise)
    }
    console.log(result)
}
```
