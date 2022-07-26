---
tags:
  - vue-admin
  - i18n
---

## 国际化(Vue+ElementUI)的实现

#### 安装

`npm install vue-i18n --save-dev`

#### 引入

```js
// src/main.js
import i18n from '@/lang/index.js'
Vue.use(ElementUI，{
        i18n:(key,value)=> i18n.t(key,value) // ElementUI默认只兼容vue-i18n的5.x版本。该行代码是为了兼容7.x甚至更新的版本
        })
new Vue({
  el: '#app',
  i18n,
  render: h => h(App)
})
```

```js
// src/lang/index.js
import Vue from "vue";
import VueI18n from "vue-i18n";
import Cookies from "js-cookie";
import elementEnLocale from "element-ui/lib/locale/lang/en"; // element-ui 的语言包
import elementZhLocale from "element-ui/lib/locale/lang/zh-CN"; // element-ui 的语言包
import enLocale from "./en";
import zhLocale from "./zh";

Vue.use(VueI18n);
const message = {
  en: {
    // 导入多个语言包
    ...enLocale,
    ...elementEnLocale,
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
  },
};

export function getLanguage() {
  const chooseLanguage = Cookies.get("language");
  if (chooseLanguage) return chooseLanguage;

  // if has not choose language
  const language = (
    navigator.language || navigator.browserLanguage
  ).toLowerCase(); // z-cn
  console.log(language);
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }
  return "zh"; // 默认返回的是中文
}

const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(), //  语言标识
  // set locale messages
  messages,
});

export default i18n;
```

```js
// ./zh
export default {
  route: {
    dashboard: '首页',
    documentation: '文档',
    guide: '引导页',
    permission: '权限测试页'
    ...
  },
  navbar: {
    dashboard: '首页',
    github: '项目地址',
    logOut: '退出登录',
    profile: '个人中心',
    theme: '换肤',
    size: '布局大小'
  },
   ...
}
```

#### vue-i18n 数据渲染的模板语法

模板语法暂时分为三种：

```vue
//vue组件模板的使用
<div>{{$t('navbar.github')}}</div>

//vue组件模板数据绑定的使用
<input :placeholder="$t('navbar.github')"></input>

//vue组件data中赋值的使用
data:{
   msg:this.$t('navbar.github');  // 在template模板中是不需要使用this来访问vue实例变量滴
}
```

#### 路由与面包屑国际化的语法问题

**面包屑**

![image-20211013164258567](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202110131642640.png)

![image-20211013164313694](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202110131643725.png)

通过`generateTitle`转成`route.[xxx]`的格式，即是访问`zh.js`中的`key`值格式。进而进行翻译转换。

**路由**

而该项目路由是通过动态路由加载菜单的形式生成的侧边栏。

![image-20211013164737019](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202110131647063.png)

#### i18n 的几个 api

```js
$t(key) -> 返回翻译后的结果
$te(key) -> 检查存在本地语言环境信息key，返回布尔值 例如`navbar.github`(整个是个`key`)
```
