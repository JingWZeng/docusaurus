---
tags: [call/apply/bind/new模拟实现]
---
## call的模拟实现

**模拟思路**

1. `call`改变了 `this`的指向，指向到 `foo`
2. `bar`函数执行了

```javascript
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
```

上面可以用类似逻辑实现

1. 将函数设置为对象的属性
2. 执行该函数
3. 删除该属性(函数)

```javascript
Function.prototype.call2 = function(context) {
    // 首先要获取调用call的函数，用this可以获取，就是foo函数
    context.fn = this;
    context.fn();
    delete context.fn;
}

// 测试一下
var foo = {
    value: 1
};
function bar() {
    console.log(this.value);
}
bar.call2(foo); // 1
```

**最终版本**

加了三个东西：

+ 参数
+ `this`参数可以传 `null`, 此时指向的是 `window`
+ 函数可以有返回值的

```javascript
Function.prototype.call2 = function(context) {
    var context = context || window
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    //console.log(arguments[1]) // kevin 
    //将数组的多个元素作为参数放进函数的参数里面
    //eval 会把里面的字符串解析成JavaScript代码进行执行
    //相当于 eval('context.fn(arguments[1],arguments[2])')  ===> 解析成              		  	  //context.fn(arguments[1],arguments[2])
    //args 是数组，下面这个语句会自动调用 toString的方法
    //console.log(args.toString()) // 'arguments[1],arguments[2]'
    var result =   eval('context.fn(' + args +')') ; 
    //console.log(result) // { value: 1, name: 'kevin', age: 18 } 返回值
    delete context.fn;
    return result
}

// 测试一下
var foo = {
    value: 1
};
function bar(name, age) {
    console.log(this.value);
    return{
        value:this.value,
        name:name,
        age:age
    }
}
bar.call2(foo, 'kevin', 18); 
// kevin
// 18
// 1
```

## apply的模拟实现

`apply`和 `call`作用完全一样的，只不过传参数不同。`apply `方法传入两个参数：一个是作为函数上下文的对象，另外一个是作为函数参数所组成的数组。`call `方法第一个参数也是作为函数上下文的对象，但是后面传入的是一个参数列表，而不是单个数组。

```javascript
Function.prototype.apply2 = function (context, arr) {
    var context = Object(context) || window;
   // console.log(context) // {value:1} Object(context)->数组转成对象
    context.fn = this;
    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }
    // console.log(result) // { value: 1, name: 'k', age: 'e' } 返回值
    delete context.fn
    return result;
}

// 测试一下
var foo = {
    value: 1
};
function bar(name, age) {
    console.log(this.value);
    return{
        value:this.value,
        name:name,
        age:age
    }
}

bar.apply2(foo, 'kevin', 18); 
// kevin
// 18
// 1
```

## bind的模拟实现

+ 返回一个函数
+ 可以传入参数，`bind`绑定的时候可以传，返回的函数在 `bind`绑定参数的后面接着传
+ 当 `bind`返回的函数是构造函数的时候，`bind`指定的 `this`就会无效，但是传入的参数依旧有效

```javascript
Function.prototype.bind2 = function (context) {
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var self = this;
    //  绑定bind的时候，传进去的参数
    var args = Array.prototype.slice.call(arguments, 1);
    // console.log(args) // [ 'daisy', 'man' ]
    var fNOP = {}  // 中转 ，避免直接修改绑定函数的prototype

    var fBound = function () {
        // 这个时候的arguments是执行函数的时候传进去的参数
        // console.log(bindArgs) // [ '18' ]
        var bindArgs = Array.prototype.slice.call(arguments);
        // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
        // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
        // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    // 原：fBound.prototype = self.prototype;
    // 现
    fNOP.prototype = self.prototype
    fBound.prototype = new fNOP()
    return fBound;
}

var foo = {
    value: 1
};

function bar(name, age,sex) {
    // console.log(this.value);
    // console.log(name);
    // console.log(age);

}

var bindFoo = bar.bind2(foo, 'daisy','man');
bindFoo('18');
// 1
// daisy
// 18
```

## new模拟实现

```javascript
function Otaku (name, age) {
    this.name = name;
    this.age = age;
    this.habit = 'Games';
    return 'something'
}

Otaku.prototype.strength = 60;

Otaku.prototype.sayYourName = function () {
    console.log('I am ' + this.name);
}
function objectFactory() {
    var obj = new Object(),
    Constructor = [].shift.call(arguments);// shift 返回删除的数组第一个元素 也就是构造函数
    // console.log(arguments) // { '0': 'Kevin', '1': '18' }shift会修改原数组、
    // 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
    obj.__proto__ = Constructor.prototype;
    // 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
    // Constructor.apply(obj, arguments);
    // return obj;
    // +  构造函数有返回值的时候。判断返回的值是不是一个对象，如果是一个对象，我们就返回这个对象，如果没有，我们该返回什么就返回什么
    var ret = Constructor.apply(obj,arguments)
    // console.log(obj) // Otaku { name: 'Kevin', age: '18', habit: 'Games' }
    return typeof ret === 'object' ? ret : obj
};
var person = objectFactory(Otaku, 'Kevin', '18')
console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // 60
person.sayYourName(); // I am Kevin
```
