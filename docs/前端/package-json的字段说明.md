---
tags: [package.json]
---
> 英文版的 `package.json`介绍
>
> https://heynode.com/tutorial/what-packagejson/

##### `name`

`name`字段表示当前的文件名字，如果需要发布在 `npm`上的话，作为唯一的标识。

##### `version`

`version`当前项目的版本，决定了该版本的所有依赖的版本。

##### `license`

`license`许可证，发布在 `npm`的时候,许可证规定哪些人可以使用，哪些人不可以使用。

##### `author`和 `contributors`

```json
"author": "Jon Church jon@example.com https://www.osioslabs.com/#team",
"contributors": [{
	"name": "Amber Matz",
	"email": "example@example.com",
	"url": "https://www.osiolabs.com/#team"
}]
```

作者和共享者，拥有 `name` 、` email`、 ` url`字段。

##### `description`

发布在 `npm`上的时候对该包的描述说明。

##### `keywords`

作用跟 `description`差不多，就是用于搜索引擎的关键字，说明字段而已。

##### `main`

```json
"main":"src/index.js"
```

定义项目的启动入口。如果你安装了包 `foo-lib`，当你执行 `require('foo-lib')`,返回的结果就是该文件 `module.exports`暴露出来的属性。

##### `script`

定义 `npm run` 运行的脚本名字。

##### `repository`

它是仓库的意思，就是该项目放在了那个地方，例如 `git`,属性有 `type`、`url`

##### `dependencies`

生成依赖，它会下载到node_modules/文件夹中。 版本的符号关系如下

- `^`: 不改变最左边的非零数字的更新，即可以在次要版本或补丁版本中进行更改，但不能在主要版本中进行更改。如果你写 `^13.1.0`，运行时 `npm update`，它可以更新到 `13.2.0`，`13.3.0`甚至 `13.3.1`，`13.3.2`等等，但不能更新到 `14.0.0`或以上。限制的是最左边位置的数字。
- `~`：如果您 `~0.13.0`在运行时编写 `npm update`它可以更新到补丁版本：`0.13.1`可以，但 `0.14.0`不是。限制的是中间位置的数字。
- `>`：高于指定的版本的任何版本
- `>=`：等于或高于指定的版本的任何版本
- `<=`：等于或低于指定的版本的任何版本
- `<`：低于指定的版本的任何版本
- `=`: 确切的版本
- `-`: 范围。例子：`2.1.0 - 2.6.2`
- `||`: 组合。例子：`< 2.1 || > 2.6`

##### `devDependencies`

开发依赖，不会在生产模式中使用这些资源的。安装的时候用 `npm install --save-dev`

##### `.npmrc`文件

有些团队有自己的私有的 `npm`私有服,前端的话一些团队内的组件啦。如果想要拿到这里面的包的话就需要配置 `npm`的下载镜像地址啦。该文件就是用来设置镜像地址的。

比如

`@私有服:registry = https://npm.[私有服].cn/`

当然该文件还有其他的一些配置项啦。
