---
tags: [Nginx]
---
### 正向代理和反向代理

> 正向代理
>
> 就是正常的客户端和服务端之间利用一部代理服务器来进行转发数据和缓存。但是这样有一个问题，就是服务端不知道请求是来自哪里？只有客户端知道。

> 反向代理
>
> 反向代理可以解决上述问题，服务器部分包括用于做反向代理的服务器和业务服务器，这样业务服务器就可以知道请求是来自代理服务器的，但是客户端不知道响应是来自哪里。

![nginx2](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202109261655203.png)

#### `nginx`解决跨域的原理

例如：

- 前端server的域名为：`fe.server.com`
- 后端服务的域名为：`dev.server.com`

现在我在 `fe.server.com`对 `dev.server.com`发起请求一定会出现跨域。

现在我们只需要启动一个 `nginx`服务器，将 `server_name`设置为 `fe.server.com`,然后设置相应的 `location`以拦截前端需要跨域的请求，最后将请求代理回 `dev.server.com`。如下面的配置：

```text
server {
        listen       80;
        server_name  fe.server.com;
        location / {
                proxy_pass dev.server.com;
        }
}
```

这样可以完美绕过浏览器的同源策略：`fe.server.com`访问 `nginx`的 `fe.server.com`属于同源访问，而 `nginx`对服务端转发的请求不会触发浏览器的同源策略。

### `nginx`开启 `gzip`代理

前端在打包的时候，一般不需要再 `webpack`中配置 `gzip`,让后端开启 `gzip`压缩，浏览器得到压缩后的文件，自动解压缩。

### 负载均衡

负载均衡的意思就是让客户端的请求合理的分配到各个服务器上面，负载均衡在 `nginx`中开启，还可以选择负载均衡的策略。后端还可以专门配一个虚拟服务器用来做静态资源服务器。

> 具体的 `nginx`配置可以参考
>
> `http://www.conardli.top/blog/article/前端工程化/前端开发者必备的nginx知识.html#负载均衡`
