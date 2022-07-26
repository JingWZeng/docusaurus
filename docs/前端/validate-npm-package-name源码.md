---
tags: [包源码系列]
---
#### 作用: 校验npm包的名字是不是可用的。

```js
var validate = require("validate-npm-package-name")

validate("some-package")
validate("example.com")
validate("under_score")
validate("123numeric")
validate("@npm/thingy")
validate("@jane/foo.js")
```

```js
// 输出结果为一个对象
{
  validForNewPackages: true,
  validForOldPackages: true
}
```

#### builtins包

可以看到，`validate-npm-package-name`源码首先就引进该包，那么这个包有啥作用呢？其实它的作用是 `nodeJS`的内置的模块module的列表清单。就是 `nodeJS`的有每个不同版本有啥模板功能。比如常见的 `fs`、`http`等。

```js
'use strict'

var semver = require('semver')

module.exports = function (version) {
  // 获取node版本
  version = version || process.version

  var coreModules = [
    'assert',
    'buffer',
    'child_process',
    'cluster',
    'console',
    'constants',
    'crypto',
    'dgram',
    'dns',
    'domain',
    'events',
    'fs',
    'http',
    'https',
    'module',
    'net',
    'os',
    'path',
    'punycode',
    'querystring',
    'readline',
    'repl',
    'stream',
    'string_decoder',
    'sys',
    'timers',
    'tls',
    'tty',
    'url',
    'util',
    'vm',
    'zlib'
  ]

  if (semver.lt(version, '6.0.0')) coreModules.push('freelist')
  if (semver.gte(version, '1.0.0')) coreModules.push('v8')
  if (semver.gte(version, '1.1.0')) coreModules.push('process')
  if (semver.gte(version, '8.1.0')) coreModules.push('async_hooks')
  if (semver.gte(version, '8.4.0')) coreModules.push('http2')
  if (semver.gte(version, '8.5.0')) coreModules.push('perf_hooks')

  return coreModules
}
```

#### validate-npm-package-name

```js
'use strict'

var scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$')
var builtins = require('builtins') // nodeJS的模块列表

// 黑色的列表，黑名单
var blacklist = [
  'node_modules',
  'favicon.ico'
]

var validate = module.exports = function (name) {  // commonJS的导出方式，导出一个函数
  var warnings = [] // 以前符合，但是现在不符合的包名规则
  var errors = [] // 不符合的包名校验规则

  // 包名的格式校验
  
  // 不能为空
  if (name === null) {
    errors.push('name cannot be null')
    return done(warnings, errors)
  }
  
  // 不能为undefined
  if (name === undefined) {
    errors.push('name cannot be undefined')
    return done(warnings, errors)
  }
  
  // 必须是字符串
  if (typeof name !== 'string') {
    errors.push('name must be a string')
    return done(warnings, errors)
  }
  // 字符串需要有长度，也就是说不能是空字符串
  if (!name.length) {
    errors.push('name length must be greater than zero')
  }
  // 不能以点开头
  if (name.match(/^\./)) {
    errors.push('name cannot start with a period')
  }
   // 不能以_开头
  if (name.match(/^_/)) {
    errors.push('name cannot start with an underscore')
  }
  // 不能含有空格在头尾
  if (name.trim() !== name) {
    errors.push('name cannot contain leading or trailing spaces')
  }

  // 黑名单里面的'node_modules','favicon.ico'中任何一个字母大写也是不行的，也就是不能是黑名单里面的
  blacklist.forEach(function (blacklistedName) {
    if (name.toLowerCase() === blacklistedName) {
      errors.push(blacklistedName + ' is a blacklisted name')
    }
  })

  // Generate warnings for stuff that used to be allowed

  // 检查包名是否是node内置的module的名字，给出警告
  builtins.forEach(function (builtin) {
    if (name.toLowerCase() === builtin) {
      warnings.push(builtin + ' is a core module name')
    }
  })
  // 包名的最大长度
  if (name.length > 214) {
    warnings.push('name can no longer contain more than 214 characters')
  }

  // 包名必须是小写
  if (name.toLowerCase() !== name) {
    warnings.push('name can no longer contain capital letters')
  }
  // 不可以包含特殊字符（~\'!()*）
  // name.split('/').slice(-1)[0] => 获取包名、之所以要这样处理是因为
  // name.split('/') 处理 npm package scope场景
  // slice(-1)[0] 保证永远截取包名正确
  // 'koa'.split('/').slice(-1)[0] // 'koa'
  // '@babel/core'.split('/').slice(-1)[0] // 'core'
  // /[~'!()*]/.test('@babel/core'.split('/').slice(-1)) // false
  // /[~'!()*]/.test('@babel/co*re'.split('/').slice(-1)) // true
  if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
    warnings.push('name can no longer contain special characters ("~\'!()*")')
  }
 // 包名不能包含non-url-safe字符
  if (encodeURIComponent(name) !== name) {
      // 这里主要处理 scope package name 比如 @babel/core
    var nameMatch = name.match(scopedPackagePattern)
    if (nameMatch) {
      var user = nameMatch[1] // babel
      var pkg = nameMatch[2] // core
       // 如果没有异常 直接返回
      if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
        return done(warnings, errors)
      }
    }

    errors.push('name can only contain URL-friendly characters')
  }

  return done(warnings, errors)
}

validate.scopedPackagePattern = scopedPackagePattern

// 返回结果的方法
var done = function (warnings, errors) {
  var result = {
    // 判断包名是否合法
    validForNewPackages: errors.length === 0 && warnings.length === 0,
    // 兼容以前的包名，只判断了error
    validForOldPackages: errors.length === 0,
    warnings: warnings,
    errors: errors
  }
  // 如果resule.warnings是空数组，就把这个属性删除掉
  if (!result.warnings.length) delete result.warnings
  if (!result.errors.length) delete result.errors
  return result
}
```

split将一个字符串分割成一个数组。string.split(separator,limit)。需要注意的是参数为/ 的时候和为空格的时候是不一样的。slice是提取字符串或者数组的某个部分， string.slice(start,end)，正数的话表示从头部开始，为0开始，负数的话表示从尾巴开始，为-1开始。会返回一个新数组。相当于浅拷贝。

```js
name.split('/').slice(-1)[0] 
// 
'koa'.split('/') // ['koa']
['koa'].slice(-1) // ['koa'] 新数组
['koa'][0] // 'koa'
// 如果有斜杆，可以取得最后一个斜杆后的字符串，如果没有，取当前字符串
name.split('/') @a/b=> ['a','b']	b=>['b'] 
```

在使用 `URL`传参的时候，如果参数中有空格等特殊字符，浏览器可能只会读取到空格面前的内容，导部分致数据丢失。
可以使用 `encodeURIComponent()`方法，将这些特殊字符进行转义，这样就可以正常读取了。
语法：
`encodeURIComponent(URIstring)`
参数：
`URIstring`必需。一个字符串，含有 URI 组件或其他要编码的文本。
返回值：
`URIstring`的副本，其中的某些字符将被十六进制的转义序列进行替换。
