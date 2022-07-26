---
tags: [Class]
---
### 类基本使用

> 下个的项目需要用到 ts 的 class。本文总结下 class 的用法。

ES6 引进来的 class 只是一个语法糖。

例子：ES5 生成的实例对象是通过构造函数生成的。有些人觉得不好哇，虽然我不觉得(应该是自己见识少 🤔)。

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype.toString = function () {
  console.log(`${this.x} + ${this.y}`); // 1+2
};

let p = new Point(1, 2);
p.toString();
```

如果用 ES6 的 class 来实现的话：其实 ES6，就是构造函数的另外一种写法。

```js
class Point {
  constructor(x, y) {
    // 构造函数  construction是类的默认方法，如果不显式写出来，就会默认添加空的该方法。默认返回return this。可以显示的改变返回。例如return Object.create(null) 指向空
    this.x = x; // this就是指生成的实例
    this.y = y;
  }
  toString() {
    // 在原型上面的方法,方法都定义在了原型上面了
    console.log(`${this.x} + ${this.y}`); // 1+2
  }
}
let p = new Point(1, 2);
p.toString();
console.log(typeof Point); //function
console.log(Point === Point.prototype.constructor); // true
console.log((p.constructor = Point.prototype.constructor)); // true  p上面没有construction，它去原型链上去找的
```

由于类的方法都定义在 `prototype`上面,所以可以利用 `Object.assign()`方法一次性添加多个方法。

```js
Object.assign(Point.prototype,{
    toString(){},
    toValue(){},
    ...
})
```

类的内部定义的方法，都是不可枚举的。但是可以利用 `Object.getOwnPropertyNames`得到。但是 ES5 中是可以枚举的。

```js
Object.keys(Point.prototype); //[]
Object.getOwnPropertyNames(Point.prototype); // ["toString","toValue"]
```

实例的属性除非显式定义在其本身（this 上），否则都是定义在原型上(class 上)。

```js
point.hasOwnProperty("x"); //true
point.hasOwnProperty("y"); //true
point.hasOwnProperty("toString"); // false 定义在原型上（class)
point.hasOwnProperty("toValue"); // false 定义在原型上（class)
point.__proto__.hasOwnProperty("toString"); //true
```

`Object.getPrototypeOf(实例)`获得实例对象的原型。

取值函数（`getter`）和存值函数（`setter`）与 ES5 一致。

类的属性名，可以采用表达式的形式。

```js
let name = 'getName'
class Point(){
    [name](){
        //
    }
}
```

> 注意
>
> - 类的内部采用的都是严格模式，不用显式的指出
> - 类不存在变量提升。跟继承有关，因为必须要有父亲，儿子才可以继承
> - 
> - name 属性，返回紧跟在 class 关键字后面的类名
>
> ```js
> Point.name; // Point
> ```

### 实例属性的新写法

实例属性除了可以写在 `constructor`里面之外，也可以写在类的最上面。是一样的。

```js
class Count {
  _count = 0; // 这时候是不需要加this关键字的 推荐写法，比较简洁
  get value() {
    return this._count;
  }
  increment() {
    this._count++;
  }
}
// 与下面的作用相同-------------------------------------
class Count {
  constructor() {
    this._count = 0;
  }
  get value() {
    return this._count;
  }
  increment() {
    this._count++;
  }
}
```

### 静态方法

静态方法就是在方法名字面前加关键字 `static`。表示该方法不会被实例继承。就是实例不能调用，只可以让类自己调用。**_静态方法中的 `this`指的是类本身，而不是实例。_**

```js
class Foo {
  static myMethod() {
    console.log("xxx");
    this.bar();
  }
  bar() {
    console.log("yyy");
  }
}
Foo.myMethod(); // xxx yyy
let foo = new Foo();
console.log(foo.myMethod()); //报错❌
```

父类的静态方法是可以被子类继承的

```js
class Foo(){
    static myMehod(){
        console.log('xxx')
    }
}
class Bar extends Foo{

}
Bar.myMethod()// xxx
```

也可以在 `super`对象上调用

```js
class Bar extends Foo {
  static youMethod() {
    return super.myMethod() + "yyy";
  }
}
Bar.youMethod(); // xxxyyy
```

### 静态属性

静态属性就是类本身的属性，而不是定义在实例对象（this 上）的属性。

```js
class Foo {}
// 老写法
Foo.name = "zjw";
// 新写法 推荐
class Foo {
  static name = "zjw";
}
```

### 私有方法和私有属性

因为 ES6 没有提供相应的方法，只能自己封装。私有方法和私有属性只能在类的内部访问，外部是不能访问的。

> 需要注意静态方法和私有方法的区别啊：
>
> - 静态方法只可以是类自身调用，**类的实例（也就是 new 出来的对象)**是不可以调用的。但是它是可以继承的。不过感觉这种方法没啥用。
> - 私有方法是在类的内部才可以调用，外部不行。

私有方法

```js
class Widget {
  foo(baz) {
    bar.call(this, baz);
  }

  // ...
}

function bar(baz) {
  return (this.snaf = baz);
}
```

私有属性

```js
提案：利用#[变量名|方法名]
```

### new.target 属性

它返回的是 new 命令作用于的那个构造函数，如果构造函数不是通过 new 命令或者 Reflect.construct()调用的话，new.target 返回 undefined。所以这个属性可以用来判断构造函数是不是通过 new 方法调用的。

一个很好的应用就是：可以写出不能独立使用，必须继承之后才可以使用的类(因为子类继承父类的时候呢，new.target 返回的是子类)

```js
class Shape {
  constructor() {
    if (new.target === Shape) {
      // new.target这里返回的是Rectangle。如果是自己new Shape()调用的话，那就是返回Shape
      throw new Error("本类不能实例化");
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape(); // 报错
var y = new Rectangle(3, 4); // 正确
```

### super()

- 第一种情况就是，super 当成函数调用，如果子类定义了 constructor，那么必须在子类的 constructor 里面调用 super()函数，这样才可以把父类的 this 指向子类，相当于调用父类的 constructor，可以传递参数过去。

这里，super 虽然是代表着父类 A 的构造函数，但是返回的是子类 B 的实例。也就是说 super 内部的 this 指向的 B 的实例。相当于 `A.prototype.constructor.call(this)`

```js
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A(); // A
new B(); // B  这个也恰恰说明了new.target在子类继承父类的时候，指向的其实是子类的构造函数B
```

> 作为函数的时候，只可以用在 constructor 对象里面。其他地方都会报错。

- 第二种情况就是，super()当成对象调用，如果子类的方法是普通方法，super 只能调用父亲原型（propotype）上的方法。super 还跟上下文环境有关。如果子类的方法是静态方法，那么 super 相当于祖先的构造函数，指向的就是父类，而不是父类的原型对象。

```js
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```

> - 注意指向的是父类的原型对象，这就说明只可以调用原型上面的方法（prototype 上），父类实例上的方法或者属性（class 上），是没办法拿到的。
> - ES6 规定，在子类普通方法中通过 `super`调用父类的方法时，方法内部的 `this`指向当前的子类实例。
> - 在子类的静态方法中通过 `super`调用父类的方法时，方法内部的 `this`指向当前的子类，而不是子类的实例。

### 类的继承

ES5 可以利用原型链实现继承，ES6 的 class 可以利用 extends 关键字来实现。这里先说下 ES5 的继承是怎么回事，实质上是先创造子类的实例对象 this,然后再将父类的方法添加到 this 上面 `Parent.apply(this)`。ES6 的与它不同（流程相反），实质上先将父类的实例对象的属性和方法先放到 this 上面（利用的是 super 方法，这也就是为啥必须在子类的 constructor 中调用 super 方法的原因），然后再用子类的构造函数修改 this。

```js
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用的是父类的constructor(x,y)
    this.color = color; // this指向的是ColorPoint的实例对象
  }
  toString() {
    // 重写父类的方法
    return this.color + super.toString(); //调用父类的toString()
  }
}

let cp = new ColorPoint();
```

如果写了 constructor 但是没有显式调用 super 方法，会报错

```js
class ColorPoint extends Point {
  constructor() {}
}

//因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。
let cp = new ColorPoint(); //报错❌
// 注意
class ColorPoint extends Point {
  // 没有显式写出constructor方法的话，会默认调用
  /* 等同于
      constructor(...args){ // args就是父类的constructor的参数
      super(...args)
      }
    */
}

let cp = new ColorPoint(); //正确✅
```

> 注意：
>
> 上面的一堆东西都是在强调一句话：在子类的构造函数中，只有先使用 super，才有 this。因为子类实例的构建，基于父类实例，只有 super 方法才能调用父类实例。

> 前面也提到静态方法是可以被继承的。

**ES5 的继承和 ES6 的继承区别**

不做过多的文字说明，ES6 的 class 继承参考[[ECMAScript 6 入门-Class 继承](https://es6.ruanyifeng.com/)](https://es6.ruanyifeng.com/#docs/class-extends)

**_ES5_**

![image-20211030115516007](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202110301155117.png)

**_ES6_**

![image-20211030115606459](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202110301156500.png)

### Object.getPrototypeOf()

判断一个类是否继承了另一个类（知道就行）

`Object.getPrototypeOf`方法可以用来从子类上获取父类。

```js
Object.getPrototypeOf(ColorPoint) === Point; // true
```

### 原生构造函数的继承

ES5 和 ES6 的继承机制(见本文的 Class 继承一节)决定了 ES5 是无法去继承原生的 JS 构造函数的。而 ES6 却可以做到。(这个解释了解就行)。

重点看 ES6 是如何去是实现这种继承的。

### mixin 模式

Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。将多个类合并成一个大类

```js
function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if (key !== "constructor" && key !== "prototype" && key !== "name") {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
// 码的mix函数，可以将多个对象合成为一个类。使用的时候，只要继承这个类即可。
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
```
