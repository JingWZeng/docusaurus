---
tags: [Promise]
---

本文参考:[看了就会，手写 Promise 原理，最通俗易懂的版本！！！](https://juejin.cn/post/6994594642280857630#heading-8)

```javascript
/*
1、执行了resolve，Promise状态会变成fulfilled
2、执行了reject，Promise状态会变成rejected
3、Promise只以第一次为准，第一次成功就永久为fulfilled，第一次失败就永远状态为rejected
4、Promise中有throw的话，就相当于执行了reject
*/

/**
then接收两个回调，一个是成功回调，一个是失败回调
当Promise状态为fulfilled执行成功回调，为rejected执行失败回调
如resolve或reject在定时器里，则定时器结束后再执行then
then支持链式调用，下一次then执行受上一次then返回值的影响
 */

/*
1、then方法本身会返回一个新的Promise对象
2、如果返回值是promise对象，返回值为成功，新promise就是成功
3、如果返回值是promise对象，返回值为失败，新promise就是失败
4、如果返回值非promise对象，新promise对象就是成功，值为此返回值
*/
class myPromise {
  constructor(fn) {
    // 初始化值
    this.initVal();
    // 初始化this的指向  这是为了resolve和reject的this指向永远指向当前的MyPromise实例，防止随着函数执行环境的改变而改变
    this.initBind();
    // 执行传进来的函数
    try {
      fn(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }
  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  initVal() {
    this.PromiseRes = null; //终值
    this.PromiseState = "pending"; // 状态
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
  }
  resolve(val) {
    if (this.PromiseState !== "pending") return false; // state是不可变的
    this.PromiseState = "fulfilled";
    this.PromiseRes = val; // 终值等于传进来的
    // 执行保存的成功回调
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseRes);
    }
  }
  reject(reason) {
    if (this.PromiseState !== "pending") return false;
    this.PromiseState = "rejected";
    this.PromiseRes = reason;
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseRes);
    }
  }
  then(onFulfilled, onRejected) {
    // 接收两个回调 onFulfilled, onRejected
    // 参数校验，确保一定是函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    var thenPromise = new myPromise((resolve, reject) => {
      const resolvePromise = (cb) => {
        setTimeout(() => {
          try {
            const x = cb(this.PromiseRes);
            if (x === thenPromise) {
              // 不能返回自身
              throw new Error("不能返回自身");
            }
            if (x instanceof myPromise) {
              // 如果返回值是Promise
              // 如果返回值是promise对象，返回值为成功，新promise就是成功
              // 如果返回值是promise对象，返回值为失败，新promise就是失败
              // 谁知道返回的promise是失败成功？只有then知道
              x.then(resolve, reject);
            } else {
              // 非Promise直接返回
              resolve(x);
            }
          } catch (err) {
            reject(err);
          }
        });
      };

      if (this.PromiseState === "fulfilled") {
        // 如果当前为成功状态，执行第一个回调
        resolvePromise(onFulfilled);
      } else if (this.PromiseState === "rejected") {
        // 如果当前为失败状态，执行第二个回
        resolvePromise(onRejected);
      } else if (this.PromiseState === "pending") {
        // 如果状态为待定状态，暂时保存两个回调
        this.onFulfilledCallbacks.push(resolvePromise.bind(this));
        this.onRejectedCallbacks.push(resolvePromise.bind(this));
      }
    });

    // 返回这个包装的Promise
    return thenPromise;
  }
  /*
接收一个Promise数组，数组中如有非Promise项，则此项当做成功
如果所有Promise都成功，则返回成功结果数组
如果有一个Promise失败，则返回这个失败结果
  */
  static all(promises) {
    const res = [];
    let count = 0;
    return new myPromise((resolve, reject) => {
      const addData = (index, val) => {
        res[index] = val;
        count++;
        count === promises.length && resolve(res);
      };
      promises.forEach((promise, index) => {
        if (promise instanceof myPromise) {
          promise.then(
            (res) => {
              addData(index, res);
            },
            (err) => reject(err)
          );
        } else {
          addData(index, promise);
        }
      });
    });
  }
  /*
接收一个Promise数组，数组中如有非Promise项，则此项当做成功
哪个Promise最快得到结果，就返回那个结果，无论成功失败
  */
  static race(promises) {
    return new myPromise((resolve, reject) => {
      promises.forEach((promise) => {
        if (promise instanceof myPromise) {
          promise,
            then(
              (res) => {
                resolve(res);
              },
              (err) => {
                reject(err);
              }
            );
        } else {
          resolve(promise);
        }
      });
    });
  }
  /*
any与all相反
接收一个Promise数组，数组中如有非Promise项，则此项当做成功
如果有一个Promise成功，则返回这个成功结果
如果所有Promise都失败，则报错
  */
  static any(promises) {
    return new myPromise((resolve, reject) => {
      let count = 0;
      promises,
        forEach((promise) => {
          promise.then(
            (val) => {
              resolve(val);
            },
            (err) => {
              count++;
              count === promises.length &&
                reject(new Error("All promises were rejected"));
            }
          );
        });
    });
  }
  /*
接收一个Promise数组，数组中如有非Promise项，则此项当做成功
把每一个Promise的结果，集合成数组，返回
   */
  static allSettled(promises) {
    return new myPromise((resolve, reject) => {
      const res = [];
      let count = 0;
      const addData = (state, val, i) => {
        res[i] = {
          state,
          val,
        };
        count++;
        count === promises.length && resolve(res);
      };
      promises.forEach((promise, i) => {
        if (promise instanceof myPromise) {
          promise.then(
            (res) => {
              addData("fulfilled", res, i);
            },
            (err) => {
              addData("rejected", res, i);
            }
          );
        } else {
          addData("fulfilled", promise, i);
        }
      });
    });
  }
}

// const test1 = new myPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("成功");
//   }, 2000);
// }).then(
//   (res) => console.log(res),
//   (err) => console.log(err)
// );
// console.log({ test1 });

// const test2 = new myPromise((resolve, reject) => {
//   reject("失败");
// });
// console.log({ test2 });

// const test3 = new myPromise((resolve, reject) => {
//   // resolve(100); 200
//   reject(100); // 300
// })
//   .then(
//     (res) => 2 * res,
//     (err) => 3 * err
//   )
//   .then(
//     (res) => console.log(res),
//     (err) => console.log(err)
//   );

const test4 = new myPromise((resolve, reject) => {
  resolve(1);
}).then(
  (res) => console.log(res),
  (err) => console.log(err)
);

console.log(2); // 2 1
```
