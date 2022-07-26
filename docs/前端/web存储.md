---
tags: [web]
---

`Cookie`是S端发送C端的一个小数据,下次请求的时候C端带上该数据,S端确认是不是同一个浏览器发送过来的数据。

**用处**

1. 保持登录的状态
2. 个性化设置(主题)
3. 浏览器的行为跟踪
   缺点: Cookie会造成额外的性能开销,每次请求的时候会携带

S端收到http请求的时候,S端在响应报文首部添加一个set-cookie的选项, C端收到之后会保存下Cookie,之后的C端每次请求通过请求头部将Cookie信息携带上

`set-Cookie:<cookie名>=<cookie值>`

**cookie的分类**

+ 会话期的cookie(浏览器关闭之后就没有了,不需要设置过期的时间)

+ 持久性的cookie(有一个过期时间,设定的时间只跟C端有关,和S端无关的)

+ 第三方的cookie(cookie是同源的,第三方的cookie就是域和页面的域不同,只用于广告追踪)

**cookie的属性**

1. secure:表示cookie只可以通过https进行传输,不可以使用http进行
2. httpOnly:避免xss攻击的,就是该cookie设置了httpOnly的话,JavaScript脚本是不可以对该cookie进行调用的,只可以发送给服务器
3. 作用域属性:规定哪些页面可以使用该cookie.通过domian和path属性来设置。domain包含子域名也可以得到该cookle
   path的话指定主机的路径哪些可以接受cookie(指定根路径之后,下面的子路径也可以拿到)
```js
path = /docs
则以下可以拿到cookie
/docs/web/
/docs/web/http/
```

4. `SameSite cookleSameSite=Strict`

可以取下面3个值

+ None没有做设置
+ Strict只发送给相同站点请求的cookle(就是当前页面的URL与请求目标的URL完全一致)如果请求来自的网址和当前的location的地址不一样,则该cookie不会被发送
+ Lax默认的

5. 过期时间

+ session: 表示会话性cookie

set-cookie 响应头是服务器返回的响应头,用来在浏范器中种下cookie,一旦被种下,当浏范器访问符合条件的url地址的时候,会自动带上这个cookie

**Session待定**

**token待定**

**CSRF攻击**

勾引用户进入第三方的网站,在第三方的网站中,向被攻击的网站发送跨站清求,利用用户在被攻击的网站的登凭证cookie,绕过了后台的用户验证,达到冒充用户访问被攻击的网站进行相关的操作。

1. CSRF通常是第二方的网站发起
2. CSRF攻击者不可以获取到cookle等信息,只是使用而已

**防护策略**

1. 阻止不明外域的访问

+ 同源策略
+ Samesite Cookle

2. 提交时要求附加本域才能获取信息

+ SCRF Token
+ 双重的Cookie认证

**Token解释**

1. 将Token输入到页面中,不能存在Cookie中,否则样被冒充,只能放在服务器的session中
2. 页面请求携带这个Token
3. 服务器会验证Token是否正确
