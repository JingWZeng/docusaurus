---
tags: [oh my zsh]
---
#### 方法

利用 `git bash`进行改装，设置打开 `git bash`之后默认就是 `zsh`

#### 步骤

1. 安装 `git`,自行 `google`
2. 下载 `zsh for wsl`

[下载地址](https://packages.msys2.org/package/zsh?repo=msys&variant=x86_64)

![image-20211207102845739](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202112071028775.png)

3. 解压到 `git`的根目录里面，就可以啦。可以利用[peazip](https://peazip.github.io/)进行解压，解压之后会自动往 `git`的 `usr/bin`里面注入这些东西，之后去随便打开一个 `git bash`,敲一下 `zsh`命令(貌似会出现一大堆东西，不过没关系，不用理它，这个时候一般都是成功安装啦。)![image-20211207103147290](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202112071031327.png)
4. 敲一下 `zsh`之后，安装 `oh my zsh`,[命令行地址](https://ohmyz.sh/#install)

```
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

#### 配置 `oh my zsh`

1. 配置 `git bash`默认启动为 `zsh`。之后打开新的 `git bash`就是 `zsh`啦。

修改 `~/.bashrc`,追加以下内容

```
# Launch Zsh
if [ -t 1 ]; then
exec zsh
fi
```

2. 配主题

![](https://cdn.jsdelivr.net/gh/JingWZeng/markdownImg/img/202112061641695.png)

主体推荐：[powerlevel10k](https://github.com/romkatv/powerlevel10k)

p10k 需要对应的字体图标才不会显示乱码：我用的字体是[MesloLGMDZ Nerd Font Mono](https://www.nerdfonts.com/#downloads),其他的字体没去了解。下载字体之后安装到电脑上面，然后在 `git bash`里面选择该字体使用，`VSCode`里面也需要设置成改字体，`webStorme`里面也是一样。

这样就不会出现乱码啦。

3. 插件

zsh-autosuggestions：输入的命令的时候，会出现历史命令建议

**安装**

克隆项目

```
git clone git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
```

在 `~/.zshrc` 中配置

```
plugins=(其他的插件 zsh-autosuggestions)
```

更新配置文件，使配置生效

```
source ~/.zshrc
```

zsh-syntax-highlighting：用处就是平常用的 `ls`、`cd` 等命令输入正确会绿色高亮显示，输入错误会显示其他的颜色（默认红色）。

**安装**

克隆项目

```
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

在 `~/.zshrc` 中配置

```
plugins=(其他的插件 zsh-syntax-highlighting)
```

更新配置文件，使配置生效

```
source ~/.zshrc
```

目前插件我就装了这 2 个，还没有仔细的玩，待补充
