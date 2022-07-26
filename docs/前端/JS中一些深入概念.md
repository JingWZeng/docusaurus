---
tags: [js深入]
---
## 原型

原型对象(`Person.prototype`) 是通过 `Object`构造函数生成的，而实例的 `__proto__`指向构造函数的 `prototype`。这就是为啥原型链中最后指向的是 `Object`。`null`代表没有对象，也就是 `null`在此处表明无原型。蓝色的线就是所谓的原型链

![prototype5](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202109151017423.png)

***注意***

- `constructor`

```javascript
function Person() {

}
var person = new Person();
console.log(person.constructor === Person); // true
```

当获取 `person.constructor `时，其实 `person `中并没有 `constructor`属性,当不能读取到 `constructor` 属性时，会从 `person`的原型也就是 `Person.prototype` 中读取，正好原型中有该属性，所以：

```javascript
person.constructor === Person.prototype.constructor
```

- `__proto__`

绝大部分浏览器都支持这个非标准的方法访问原型，然而它并不存在于 `Person.prototype` 中，实际上，它是来自于 ` Object.prototype` ，与其说是一个属性，不如说是一个 `getter/setter`，当使用 ` obj.__proto__`时，可以理解成返回了 `Object.getPrototypeOf(obj)`。

- 继承实质

每一个对象都会从原型"继承"属性，引用《你不知道的JavaScript》中的话:

> 继承意味着复制操作，然而 `JavaScript`默认并不会复制对象的属性，相反，`JavaScript` 只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些。

## 词法作用域

啥叫作用域？作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。

`JavaScript`采用词法作用域，也就是静态作用域：函数的作用域在函数定义的时候就决定了。

**动态作用域是在函数调用的时候才决定的**

这个点是经常知道但是又经常搞错的地方，时刻记住函数在哪里调用并不重要，重要的函数定义在哪里。

```javascript
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();

// 结果是 ??? 1
```

假设 `JavaScript`采用静态作用域，让我们分析下执行过程：

执行 ` foo` 函数，先从 ` foo` 函数内部查找是否有局部变量 ` value`，如果没有，就根据书写的位置，查找上面一层的代码，也就是 `value` 等于 1，所以结果会打印 1。

假设JavaScript采用动态作用域，让我们分析下执行过程：

执行 `foo` 函数，依然是从 `foo` 函数内部查找是否有局部变量 ` value`。如果没有，就从调用函数的作用域，也就是 ` bar` 函数内部查找 ` value` 变量，所以结果会打印 2。

前面我们已经说了，`JavaScript`采用的是静态作用域，所以这个例子的结果是 1。

## 执行上下文栈

**`JavaScript`永远都不是简单的顺序执行的**。当执行一个函数的时候，就会创建一个执行上下文，并且把该执行上下文压入执行上下文栈。`JavaScript`创建一个执行上下文栈来管理所有的执行上下文。顾名思义，栈数据结构先进后出。不过，首先做的是把所有的全局变量压入栈底，当函数调用结束的时候，该全局变量依旧还在栈中。

## 变量对象

每个执行上下文，都有三个重要属性：

+ 变量对象(Variable Object,VO)
+ 作用域链(Scope chain)
+ `this`

变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。包括全局上下文的变量对象和函数上下文的变量对象。全局上下文的变量对象没啥好说的。

**函数上下文变量对象**

执行上下文的执行过程分为两个部分

1. 进入执行上下文
2. 代码执行

在函数上下文中，未进入执行阶段之前，变量对象(`VO`)中的属性都不能访问！但是进入执行阶段之后，变量对象(`VO`)转变为了活动对象(`AO`)，里面的属性都能被访问了，然后开始进行执行阶段的操作。它们其实都是同一个对象，只是处于执行上下文的不同生命周期。

```javascript
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```

进入执行上下文后，这时候的 `OA`只包括 `Arguments`对象，就是函数的参数。

```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```

执行代码的时候，会按顺序执行，根据代码，修改变量对象的值

```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```

**经典例题**

```javascript
console.log(foo) // 执行代码之前，先进入执行上下文
function foo(){  
}
var foo= 1
// 打印函数，而不是undefined
```

> 因为在进入执行上下文时，首先会处理函数声明，其次会处理变量声明，如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性。

```javascript
VO = {
    foo: reference to function foo(){},
    ~foo:undefined// 此处疑问: 此处变量声明的foo是否保存在VO中;以何种形式保存
}
```

 执行代码 `console.log(foo)`，查找到了 `VO`中的 `foo`，输出结果。接着执行 `foo=1`,执行后

```javascript
VO={    foo:1}
```

## 参数按值传递

> `ECMAScript`中所有的函数的参数都是按值传递的

 啥叫按值传递呢？

> 也就是说，把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另外一个变量一样

举个简单的例子：

```javascript
var value = 1;function foo(v) {    v = 2;    console.log(v); //2}foo(value);console.log(value) // 1
```

很好理解，当传递 `value`到函数 `foo`中，相当于拷贝了一份 `value`，假设拷贝的这份叫 `_value`，函数中修改的都是 `_value`的值，而不会影响原来的 `value `值。

疑问：难道对象也是按值传递的吗？对象不应该是引用传递吗？通过传递一个指向该对象的指针(地址)，外部修改和函数内部修改都可以直接影响到该对象值的变化？答案是错误的，对象也是按值传递。不过这种"按值传递''是特殊的,也是特殊的引用传递，叫做共享传递。**引用传递是传递对象的引用，但是共享传递是传递对象的引用的副本**，拷贝一份引用出来给参数。这样在函数里面修改该参数的属性值，并不会改变源对象里面的属性值。

```javascript
var obj = {    value: 1};function foo(o) {    o = 2;    console.log(o); //2}foo(obj);console.log(obj.value) // 1
```

## 类数组

**类数组不可以使用数组的方法**。注意数组方法 `splice`和 `slice`,`splice`改变原数组，`slice`不改变原数组

> 间接调用数方法

```javas
var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }

Array.prototype.join.call(arrayLike, '&'); // name&age&sex

Array.prototype.slice.call(arrayLike, 0); // ["name", "age", "sex"] 
// slice可以做到类数组转数组

Array.prototype.map.call(arrayLike, function(item){
    return item.toUpperCase();
}); 
// ["NAME", "AGE", "SEX"]
```

> 类数组转数组

```javascript
var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }
// 1. slice
Array.prototype.slice.call(arrayLike); // ["name", "age", "sex"] 
// 2. splice
Array.prototype.splice.call(arrayLike, 0); // ["name", "age", "sex"] 
// 3. ES6 Array.from
Array.from(arrayLike); // ["name", "age", "sex"] 
// 4. apply
Array.prototype.concat.apply([], arrayLike)
// 5.es6的...
function func(...arguments) {
    console.log(arguments); // [1, 2, 3]
}
func(1, 2, 3);
```

`arguments`对象的 `length`属性值的是实参的长度，而不是形参的长度。`callee`属性可以调用函数自身。

```javascript
var data = [];
for (var i = 0; i < 3; i++) {
    (
     data[i] =  
     function () {
       console.log(arguments.callee.xxx) 
    })
    .xxx = i;
}
data[0]();
data[1]();
data[2]();
// 0
// 1
// 2
```
