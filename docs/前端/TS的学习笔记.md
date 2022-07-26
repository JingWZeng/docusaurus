---
tags: [typeScript]
---
## 基础

### 啥是 TS？

我是这样解释的，JS 是一门的动态的语言，也就是说它没有编译阶段，这样就会导致等到运行的时候才会发现本应该在编译期间就知道的错误，比如说语法错误。TS 就不一样了，它是一门静态的语言，所以它会有编译的阶段，先编译成 JS，这个过程就可以知道很多错误的地方，因此 TS 会比 typescript 更加强大。

> TS 依旧是 typescript 一样是弱类型的语言，也就是说它兼容所有的 typescript 特性，强弱类型的区别特征是会不会进行类型的隐形转换，JS 会，TS 兼容 typescript 的所有特征，所以也会，但是可以通过手段来限制。

### 原始数据类型

#### 布尔值

需要注意的是，通过构造函数 `Boolean`创造的对象不是布尔值，而是 `Boolean`对象。其他的基本类型也是一样，除了 `null`和 `undefined`

```typescript
let isDone: boolean = false; // ✅
let isDone: Boolean = new Boolean(1); // ✅
let isDone: boolean = new Boolean(1); // ❌
```

#### 数值

```typescript
let a: number = 4;
let b: number = 0b1010; // 不管几进制的数字都是一样的
let c: number = NaN;
let d: number = Infinity;
```

#### 字符串

```typescript
let name: string = "zengxpang";
let nickName: string = `zjingw${name}`; //模板字符串也一样
```

#### 空值

TS 特有的概念空值 `void`,表示函数没有任何返回值。

```typescript
function alertAge(): void {
  alert("My name is zengxpang");
}
```

或者 void 类型的变量只有 `null`或 `undefined`，不建议用 🤯

```typescript
let a: void = null;
let b: void = undefined;
```

#### null 和 undefined

```typescript
let a: undefined = undefined;
let b: null = null;
```

它们与 `void`的区别就是,`null`和 `undefined`是所有类型的子类型，也就是说所有的类型都可以是它们。比如

```typescript
let a: number = undefined; // ✅ 严格模式下会报错
```

但是 `void`不行。不过都不建议用啦。知道就好啦~~~因为貌似现在都会报错 🤯

```typescript
let a:number = void //❌
```

#### 任意值 和 类型推导

任意值 `any`就是可以表示成任何值，此时和 typescript 差不多。

```typescript
let name: any = "zengxpang";
name = 8888;
```

如果变量不声明类型，默认也是 `any`类型

```typescript
let something;
something = "zengxpang"; // 因为这里不是声明即赋值，所有是没有类型推导的，不会保错
something = 1;
// 等同于
let something: any;
something = "zengxpang";
something = 1;
// 如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查：
```

注意

```typescript
let something = "zengxpang";
something = 7; //❌ 因为TS的类型推导，相当于let something:string = 'zengxpang'

// 还有一种写法比较容易混
let something: string;
something = 7; //❌ 已经有定义类型啦
something = "zengxpang"; // ✅
```

### 联合类型

就是取值可以为多种选择，多种类型中的一种。

```typescript
let manyId: string | number;
manyId = "zengxpang";
manyId = 8888;
```

注意

访问联合类型里面的属性或者方法，如果不确定是变量到底是联合类型中的那一个，那么只能访问此联合类型的公告属性和方法。

```typescript
function getLength(something: string | number): number {
  return something.length;
} //❌
// 因为number是没有length属性的
function getLength(something: string | number): string {
  return something.toString();
} //✅
// number 和string都有toString方法
```

一旦确定了变量被赋值的时候的类型，那就可以用啦

```typescript
let a: string | number;
a = "zengxpang";
console.log(a.length); // 9
a = 8;
console.log(a.length); //❌
```

### 接口

接口是对行为的抽象，用类去实现。在使用接口的时候呢，使用者需要与接口的形状保持一致，类比现实中电脑接口。

```typescript
interface Person{
    name:string;
    age:number;
    sex?:string; // ?表示可选
}
let zengxpang :Person={
    name:'zengxpang',
    age:number
}，
// zengxpang的形状就跟接口Person的一致啦，这是必须的。多属性不行；少属性也是不行的，除非属性是可选的
```

接口中加任意属性

```typescript
interface Person {
  name: string;
  age: number;
  [propName: string]: any;
}
let zengxpang: Person = {
  name: "zengxpang",
  age: 23,
  speaker: "chinese",
};
// 使用[propName:string]定义了属性名是任意的字符串就行
```

注意

**一旦接口中有任意类型存在的话，那么确定属性和可选属性的类型必须是它的类型的子集。** 这个概念可能是有点超出认知的。

```typescript
interface Person {
  name: string;
  age?: number; //❌
  [propName: string]: string;
}
// 因为任意属性的类型都要求是string类型的，但是age的属性类型居然是number，所以会报错。解决办法是使用联合类型或者any(见上面)
interface Person {
  name: string;
  age?: number;
  [propName: string]: string | number;
} //✅
```

只读属性

```typescript
interface Person{
    readonly idCard:number;
}
let zengxpang:Person{
    idCard:9527; // 必须给该属性赋值，不然也会报错哦，和确定属性一样
}
zengxpang.idCard = 9999 //❌ 无法修改，它是只读属性来的
```

### 数组

表示方法有三种：

1. 类型+[]

```typescript
let a: number[] = [1, 2, 3, 4, 5];
```

2. 泛型

```typescript
let a: Array<number> = [1, 2, 3, 4, 5];
```

3. 接口表示

```typescript
interface a {
  [index: number]: number;
}
// 表示如果索引是数字的话，那么值必须也是number
let b: a = [1, 2, 3, 4, 5];
```

正常情况下不会用这种方式表示，太麻烦，但是它需要用在类数组中。类数组只能用接口的方式来表示。

```typescript
function sum() {
  let args: number[] = arguments; //❌ 类数组不能使用普通数组的表示方法，而应该用接口
}
```

```typescript
function sum() {
  let args: {
    [index: number]: number;
    length: number;
    callee: Function;
  } = arguments;
}
/*
需要注意的是参考啥上节接口部分:一旦接口中有任意类型存在的话，那么确定属性和可选属性的类型必须是它的类型的子集。
有一个前提，任意属性的类型为string时，那么确定属性和可选属性的类型都必须为它的类型的子集，这个例子是number类型，所以没有报错，把任意属性类型换成string就会
也就是[index:number],index是number类型，不会检测其他非number类型的key
*/

function sum() {
  let args: {
    [index: number]: string;
    length: number;
    callee: Function;
  } = arguments;
}
/*
这里也是不会报错
*/
```

`any`在数组中的作用就是表示数组中可以出现任意的类型

```typescript
let list: any[] = [1, 2, false, "zengxpang", { a: 9527 }];
```

### 函数

TS 中的函数需要考虑到输入和输出

```typescript
function sum(x: number, y: number): number {
  return x + y;
}
// 输入的参数多余的或者缺少的都不可以
```

函数表示式

```typescript
ley sum = function(x:number,y:number):number{
    return x+y
}
// 编译可以通过，但是其实左边是通过类型推导的，完整的写法是
let sum:(x:number,y:number)=>number = function(x:number,y:number):number{
    return x+y
}
//此=>与ES6的=>箭头函数不同，TS里面的箭头是用来表示函数的定义，左边是输入类型，右边是输出类型
```

接口定义函数的形状

```typescript
interface func {
  (a: string, b: string): boolean;
}
let myFunc: func;
myFunc = function (a: string, b: string) {
  return a.length === b.length;
};
```

可选参数

```typescript
function func(a: string, b?: string) {
  return b ? a + b : a;
}
let zengxpang = func("aaa", "bbb");
let lx = func("aaa");
/*
可选参数必须放在必选参数的后面
*/
function func(b?: string, a: string) {
  //❌
  return b ? a + b : a;
}
```

参数的默认值：TS 的函数的默认值会被自动当成是可选的参数

```typescript
function func(a: string, b: string = "cat") {
  return a + b;
}
let zengxpang = func("aaa", "bbb");
let lx = func("aaa");
/*
此时不用遵守该规则：可选参数必须放在必选参数的后面
*/
function func(b: string = "cat", a: string) {
  //✅
  return a + b;
}
```

剩余参数，其实就是一个数组

```typescript
function func(arrData: any[], ...items: any[]) {
  items.forEach((item) => {
    arrData.push(item);
  });
}
let a = [];
func(a, 1, 2, 3);
// rest 参数只能是最后一个参数
```

重载：让函数接受不同数量或者类型的参数，然后做不同的处理

用联合类型实现:不够精确，应该是输入为数字的时候，输出也为之对应为数字。

```typescript
function reverse(x: number | string): number | string | void {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else if (typeof x === "string") {
    return x.split("").reverse().join("");
  }
}
```

用重载实现：

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else if (typeof x === "string") {
    return x.split("").reverse().join("");
  }
}
// 重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现。
// TS会优先从最前面的函数定义开始匹配,所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。
```

### 类型断言

断言就是手动指定一个值的类型。

语法

```typescript
值 as 类型;
```

用途

**1.将一个联合类型断言为其中一个类型**

联合类型那节提起过，使用联合类型的时候，当 TS 不确定变量是哪个类型的话，只能访问此联合类型的公共属性和方法。有的时候，我们需要在不确定类型的时候就访问其中一个类型特有的属性或者方法的时候，就可以使用断言。

```typescript
interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}
//❌ 因为不确定此时的类型
function isFish(animal: Cat | Fish) {
  if (typeof animal.swim === "function") {
    return true;
  }
  return false;
}
//✅
function isFish(animal: Cat | Fish) {
  if (typeof (animal as Fish).swim === "function") {
    return true;
  }
  return false;
}
```

断言是欺骗 TS 的编译器的。特别容易出错，所以还是少用好点。比如：

```typescript
interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}

function swim(animal: Cat | Fish) {
  (animal as Fish).swim();
}

const tom: Cat = {
  name: "Tom",
  run() {
    console.log("run");
  },
};
swim(tom);
```

编译的时候不会报错，但是执行的时候会。因为 animal 可以有两种类型，但是 Cat 类型是没有 swim 的方法的。

**2.将一个父类断言为更加具体的子类**

类之间的继承关系的时候

```typescript
class A extends Error {
  code: number = 0;
}
class B extends Error {
  statusCode: number = 0;
}
function whichError(error: Error) {
  if (typeof (error as A).code === "number") {
    return true;
  }
  return false;
}
// 这里可以利用instanceof来判断，判断是不是在原型上嘛 error instanceof A。但是更多的情况是A、B不是一个真正的类，而是一个TS的接口。接口是没办法使用instanceof方法的。所以此时就只能用as断言啦
```

**3.将任何一个类型断言为 any **

理解这个作用之前，需要清楚的是：TS 当我们引用一个在此类型上不存在的属性或者方法的时候，会报错

```typescript
const foo: number = 1;
foo.length = 1; //❌
```

设想这样的场景：确定这段代码不会出错:往 window 上加一个属性，TS 编译会报错，提示我们 `window` 上不存在 `foo` 属性。

```
window.foo = 1   //❌
(window as any).foo = 1  //✅ 因为在any类型的变量上，任何属性都是可以被访问的
```

**4.将 any 断言为一个具有的类型 **

就是亡羊补牢，防止滋生更多的 any。第三方包或者以前的旧代码。

```typescript
function getCacheData(key: string): any {
  return (window as any).cache[key];
}
interface Cat {
  name: string;
  run(): void;
}
const tom = getCaCheData("tom") as Cat; // 返回值从any断言为Cat类型。就可以明确tom的类型啦。之后就不会一直any下去
tom.run();
```

#### 断言的限制

**要使得 `A` 能够被断言为 `B`，只需要 `A` 兼容 `B` 或 `B` 兼容 `A` 即可**

#### 双重断言

**除非迫不得已，千万别用双重断言。**

#### 断言 VS 类型转换

断言只会影响 TS 编译时的类型，编译完成之后就会被删除掉。所以断言是不会影响变量的类型的。

#### 断言 VS 类型声明

```typescript
function getCacheData(key: string): any {
  return (window as any).cache[key];
}

interface Cat {
  name: string;
  run(): void;
}
// 断言
const tom = getCacheData("tom") as Cat;
tom.run();
// 类型声明
const tom: Cat = getCacheData("tom");
tom.run();
```

区别是：

```typescript
interface Animal {
  name: string;
}
interface Cat {
  name: string;
  run(): void;
}

const animal: Animal = {
  name: "tom",
};
// 断言
let tom = animal as Cat; //✅  父类可以被断言为具体的子类
// 类型声明
let tom: Cat = animal; //❌
```

`Animal` 可以看作是 `Cat` 的父类，当然不能将父类的实例赋值给类型为子类的变量。

它们核心区别就在于：

- `animal` 断言为 `Cat`，只需要满足 `Animal` 兼容 `Cat` 或 `Cat` 兼容 `Animal` 即可
- `animal` 赋值给 `tom`，需要满足 `Cat` 兼容 `Animal` 才行

但是 `Cat` 并不兼容 `Animal`。

`getCacheData('tom')` 是 `any` 类型，`any` 兼容 `Cat`，`Cat` 也兼容 `any`。故

```typescript
const tom = getCacheData("tom") as Cat;
```

等价于

```typescript
const tom: Cat = getCacheData("tom");
```

知道了它们的核心区别，就知道了类型声明是比类型断言更加严格的。

所以为了增加代码的质量，我们最好优先使用类型声明，这也比类型断言的 `as` 语法更加优雅。

#### 断言 VS 泛型

利用泛型实现上面的例子

```typescript
function getCacheData<T>(key: string): T {
  return (window as any).cache[key];
}
interface Cat {
  name: string;
  run(): void;
}
const tom = getCacheData<Cat>("tom");
tom.run();
```

通过给 `getCacheData` 函数添加了一个泛型 `<T>`，我们可以更加规范的实现对 `getCacheData` 返回值的约束，这也同时去除掉了代码中的 `any`，是最优的一个解决方案。

### 内置对象

typescript 的内置对象，TS 已经定义好了类型

```typescript
//ECMAScript的内置对象
let b: Boolean = new Boolean(1);
let e: Error = new Error("Error occurred");
let d: Date = new Date();
let r: RegExp = /[a-z]/;
// DOM与BOM
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll("div");
document.addEventListener("click", function (e: MouseEvent) {
  // Do something
});
```

```typescript
Math.pow(10, "2"); //❌
//内部定义是
interface Math {
  /**
   * Returns the value of a base expression taken to a specified power.
   * @param x The base value of the expression.
   * @param y The exponent value of the expression.
   */
  pow(x: number, y: number): number;
}
```

## 进阶

### 类型的别名

类型别名用来给一个类型起个新名字。利用 `type`关键字，经常用在联合类型上。

```typeScript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```

### 字面量类型

就是用来约束取值只能是规定的其中一个，**跟类型的别名一样都是用 type**

```typescript
type a ='click' | 'scroll' |'mousrmove'
function handleEvent(ele:element,event:a){
    ...
}
handleEvent(document.getElementById('app'), 'dblclick'); //❌，event 不能为 'dblclick'
```

### 元组

元组和数组差不多，只不过 TS 里面的数组的元素都是相同类型的，而元组可以是不同类型的。其实元组也比较少用，先了解。

```typescript
let zengxpang: [string, number] = ["a", 123];
```

### 枚举

枚举类型用在取值被限定在一定的范围，比如一个星期只有固定的 7 天。

```typescript
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
```

互相映射，跟数组一样，也是从 0 开始递增，但是还可以根据枚举名反向映射

```typescript
Days[0] = "Sun"; // true
Days[6] = "Sat"; // true
Day["Sun"] = 0; // true
Day["Sat"] = 6; // true
```

手动赋值：是可以进行手动赋值，并且这种手动赋值如果与递增之后的值重复了，TS 也不会察觉

```typescript
enum Days {
  Sun = 7,
  Mon = 1,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
} // 7 1 2 3 4 5 6
enum Days {
  Sun = 3,
  Mon = 1,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
} // 3 1 2 3 4 5 6
// 手动赋值的枚举项可以不是数字
enum Days {
  Sun = 7,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat = "S",
}
// 手动赋值的枚举项也可以为小数或负数，此时后续未手动赋值的项的递增步长仍为 1
enum Days {
  Sun = 7,
  Mon = 1.5,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
} // 7 1.5 2.5 3.5 4.5 5.5 6.5
```

枚举项有两种类型：常数项和计算所得项

上面的都是常数项，计算所得项如下

```typescript
enum Color {
  Red,
  Green,
  Blue = "blue".length,
}
// 如果计算计算所得项后面有未手动赋值的项，就报错
enum Color {
  Red = "red".length,
  Green,
  Blue,
} //❌
```

#### 常数枚举

不能包含计算所得项，否则报错

```typescript
const enum Directions {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Directions.Up,
  Directions.Down,
  Directions.Left,
  Directions.Right,
];

// 编译得到
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
//❌
const enum Color {
  Red,
  Green,
  Blue = "blue".length,
}
```

#### 外部枚举

使用 `declare enum` 定义的枚举类型。

`declare` 定义的类型只会用于编译时的检查，编译结果中会被删除。

```typescript
declare enum Directions {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Directions.Up,
  Directions.Down,
  Directions.Left,
  Directions.Right,
];
// 编译得到
var directions = [
  Directions.Up,
  Directions.Down,
  Directions.Left,
  Directions.Right,
];
// 外部枚举与声明语句一样，常出现在声明文件中。同时使用 declare 和 const 也是可以的：
declare const enum Directions {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Directions.Up,
  Directions.Down,
  Directions.Left,
  Directions.Right,
];
// 编译得到
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

### 类

TS 除了实现 ES6 中类的功能之外，还增加了一些新的用法。

#### TS 增加的用法

**public/private/protected**

- `public` 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 `public` 的
- `private` 修饰的属性或方法是私有的，不能在声明它的类的外部访问。① 子类中也不能访问、② 当构造函数 `constructor`为 `private`时候，该类不能被继承或者实例化
- `protected` 修饰的属性或方法是受保护的，它和 `private` 类似，区别是它在子类中也是允许被访问的。

  ① 子类中可以访问、② 当构造函数 `constructor`为 `protected`时候，只能被继承不能被实例化

##### 参数属性：修饰符和 `readonly`还可以使用在构造函数参数中，等同于类中定义该属性同时给该属性赋值，使代码更简洁。

```typescript
class Animal {
  public constructor(public name: any) {}
}
// 编译得到
class Animal {
  constructor(name) {
    this.name = name;
  }
}
```

**readonly**

只允许出现在属性声明或索引签名或构造函数中。

```typescript
class Animal {
  readonly name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal("Jack");
console.log(a.name); // Jack
a.name = "Tom"; //❌ 只读属性
```

注意如果 `readonly` 和其他访问修饰符同时存在的话，需要写在其后面。

```typescript
class Animal {
  public constructor(public readonly name: any) {}
}
// 编译得到
class Animal {
  constructor(name) {
    this.name = name;
  }
}
```

**抽象类**

抽象类不能被实例化，子类中必须实现抽象类中的抽象方法。

**类的类型**

给实例加累的类型，跟接口一样

```typescript
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  sayHi(): string {
    return `My name is ${this.name}`;
  }
}

let a: Animal = new Animal("Jack");
```

#### 类与接口

这节是讨论接口的另一个用途，对类的一部分行为进行抽象。注意是一部分。

**类实现接口**

继承的话一个类只能继承一个类，而有些类之间是公共的特性，可以把这些公共的特征提取成接口。

举例来说，门是一个类，防盗门是门的子类。如果防盗门有一个报警器的功能，我们可以简单的给防盗门添加一个报警方法。这时候如果有另一个类，车，也有报警器的功能，就可以考虑把报警器提取出来，作为一个接口，防盗门和车都去实现它：

```typescript
interface Alarm {
  alert(): void;
}

class Door {}

class SecurityDoor extends Door implements Alarm {
  alert() {
    console.log("SecurityDoor alert");
  }
}

class Car implements Alarm {
  alert() {
    console.log("Car alert");
  }
}
```

一个类可以实现多个接口：`Car` 实现了 `Alarm` 和 `Light` 接口，既能报警，也能开关车灯。

```typescript
interface Alarm {
  alert(): void;
}

interface Light {
  lightOn(): void;
  lightOff(): void;
}

class Car implements Alarm, Light {
  alert() {
    console.log("Car alert");
  }
  lightOn() {
    console.log("Car light on");
  }
  lightOff() {
    console.log("Car light off");
  }
}
```

**接口继承接口**

接口与接口之间可以是继承关系：`LightableAlarm` 继承了 `Alarm`，除了拥有 `alert` 方法之外，还拥有两个新方法 `lightOn` 和 `lightOff`。

```typescript
interface Alarm {
  alert(): void;
}

interface LightableAlarm extends Alarm {
  lightOn(): void;
  lightOff(): void;
}
```

**接口继承类**

这是 TS 中特有的。Java 中不能做到。

```typescript
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

interface Point3d extends Point {
  z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
```

解释：在声明 class Point 的时候，除了创建一个名为 Point 的类的时候，同时也创建了一个名为 Point 的类型。那么它是类型的话，就可以这样用：

```typescript
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

function printPoint(p: Point) {
  console.log(p.x, p.y);
}

printPoint(new Point(1, 2));
// 这样看不太熟悉，其实它是等价于下面的
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

interface PointInstanceType {
  // 新声明的 PointInstanceType ，其实与class Point的时候创建的Point的类型是等价的
  /*
注意看:这里并不包括constructor。因为创建类型是不包括构造函数、也不包括静态属性和方法
只包括实例属性和实例方法。在接口继承类的时候，也只会继承它的实例属性和实例方法。如下个例子
*/
  x: number;
  y: number;
}

function printPoint(p: PointInstanceType) {
  console.log(p.x, p.y);
}

printPoint(new Point(1, 2));
```

```typescript
class Point {
  /** 静态属性，坐标系原点 */
  static origin = new Point(0, 0);
  /** 静态方法，计算与原点距离 */
  static distanceToOrigin(p: Point) {
    return Math.sqrt(p.x * p.x + p.y * p.y);
  }
  /** 实例属性，x 轴的值 */
  x: number;
  /** 实例属性，y 轴的值 */
  y: number;
  /** 构造函数 */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  /** 实例方法，打印此点 */
  printPoint() {
    console.log(this.x, this.y);
  }
}

interface PointInstanceType {
  x: number;
  y: number;
  printPoint(): void;
}

let p1: Point;
let p2: PointInstanceType;
```

### 泛型

泛型是指在定义函数、接口、类的时候，不预先指定具体的类型，等到使用的时候再指定类型的一种特性。

注意：在函数名字后面添加 `<T>`,其中 `T`代表任意输入的类型，在后面的输入 `value:T`和输出 `Array<T>`才可以使用。在调用的时候指定类型 `<string>`或者不指定让 TS 的类型推导来做。

```typescript
function creatArr<T>(length: number, value: T): Array<T> {
  let res: T[] = [];
  for (let i = 0; i < length; i++) {
    res[i] = value;
  }
  return res;
}
creatArr<string>(3, "a"); // ['a','a','a']
```

多个类型参数

```typescript
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

swap([7, "seven"]); // ['seven', 7]
```

**泛型约束**

在使用泛型的时候，因为不知道它会使用哪种类型，所以有些属于特定类型的方法或者属性就不能用。比如数字中是没有 length 属性的

```typescript
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);
  return arg;
} //❌
```

所以这个时候就可以进行约束，只允许这个函数传入那些包含 `length` 属性的变量。

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

多个参数之间互相约束:要求 `T` 继承 `U`，这样就保证了 `U` 上不会出现 `T` 中不存在的字段。

```typescript
function copyFields<T extends U, U>(target: T, source: U): T {
  for (let id in source) {
    target[id] = (<T>source)[id];
  }
  return target;
}
let x = { a: 1, b: 2, c: 3, d: 4 };
copyFields(x, { b: 10, d: 20 });
```

**泛型接口**

利用含有泛型的接口定义函数的形状

```typescript
interface CreateArrayFunc {
  <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function <T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
};

createArray(3, "x"); // ['x', 'x', 'x']
// 进一步，我们可以把泛型参数提前到接口名上：
interface CreateArrayFunc<T> {
  (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>; //此时在使用泛型接口的时候，需要定义泛型的类型。
createArray = function <T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
};

createArray(3, "x"); // ['x', 'x', 'x']
```

**泛型类**

与泛型接口类似，泛型也可以用于类的类型定义中：

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

**泛型参数的默认类型**

```typescript
function createArray<T = string>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}
```

### 声明合并

**函数的合并**

用重载

**接口的合并**

合并的属性的类型必须是唯一的

```typescript
interface Alarm {
  price: number;
}
interface Alarm {
  weight: number;
}
// 合并
interface Alarm {
  price: number;
  weight: number;
}
// 注意
interface Alarm {
  price: number;
}
interface Alarm {
  price: number; // 虽然重复了，但是类型都是 `number`，所以不会报错
  weight: number;
}
//❌
interface Alarm {
  price: number;
}
interface Alarm {
  price: string; // 类型不一致，会报错
  weight: number;
}
```

接口中方法的合并

```typescript
interface Alarm {
  price: number;
  alert(s: string): string;
}
interface Alarm {
  weight: number;
  alert(s: string, n: number): string;
}
// 合并
interface Alarm {
  price: number;
  weight: number;
  alert(s: string): string;
  alert(s: string, n: number): string;
}
```
