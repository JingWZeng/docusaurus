---
tags: [git]
---
### ﻿GIT 命令

#### git basics

| git init`<directory>`        | 在指定的⽬录下创建⼀个空的 git repo。不带参数将在当前⽬录下创建⼀个 git repo。                        |
| :----------------------------- | ----------------------------------------------------------------------------------------------------- |
| git clone`<repo>`            | 克隆⼀个指定 repo 到本地。指定的 repo 可 以是本地⽂件系统或者由 HTTP 或 SSH 指 定的远程路径。         |
| git config user.name`<name>` | 针对当前 repo 配置⽤户名。使⽤ --global 参数将配置全局⽤户名。                                        |
| git add`<directory>`         | 将指定目录的所有修改加⼊到下⼀次 commit 中。把`<directory>`替换成 `<file>`将 添加指定文件的修改。 |
| git commit -m "`<message>`"  | 提交暂存区的修改，使用指定的`<message>`作为提交信息，而不是打开文本编辑器输⼊提交信息。             |
| git status                     | 显示哪些⽂件已被 staged、未被 staged 以及未跟踪 (untracked)。                                         |
| git log                        | 以缺省格式显示全部 commit 历史。更多自定义参数请参考后续部分。                                        |

#### git diff

| git diff          | ⽐较⼯作区和暂存区的修改。           |
| ----------------- | ------------------------------------ |
| git diff HEAD     | ⽐较工作区和上⼀次 commit 后的修改。 |
| git diff --cached | ⽐较暂存区和上⼀次 commit 后的修改。 |

#### undoing change

| git revert`<commit>` | 对指定`<commit>`创建⼀个 undo 的 commit，并应⽤到当前分⽀。                 |
| :--------------------- | :---------------------------------------------------------------------------- |
| git reset`<file>`    | 将`<file>`从暂存区移除，但保持⼯作区不 变。此操作不会修改⼯作区的任何⽂件。 |

#### rewaiting git history

| git commit -m`<message>` --amend | 将当前 staged 修改合并到最近⼀次的 commit 中。                                                        |
| :--------------------------------- | :---------------------------------------------------------------------------------------------------- |
| git rebase`<base>`               | 基于`<base>`对当前分⽀进⾏ rebase。`<base>`可以是 commit、分⽀名称、tag 或相对于 HEAD 的 commit。 |
| git reflog                         | 显示本地 repo 的所有 commit ⽇志。                                                                    |

#### git branches

| git branch                | 显示本地 repo 的所有分⽀。                                                    |
| ------------------------- | ----------------------------------------------------------------------------- |
| git switch -c`<branch>` | 创建并切换到⼀个新的名为`<branch>`的分⽀。去掉-c 参数将切换到⼀个已有分⽀。 |
| git merge`<branch>`     | 将指定`<branch>`分⽀合并到当前分⽀。                                        |

#### remote repositories

| git remote add`<name>` `<url>` | 添加⼀个新的远程连接。添加后可使用`<name>`作为指定 `<url>`远程连接的名称。                               |
| :--------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| git fetch`<remote>` `<branch>` | 从指定`<remote>`抓取指定`<branch>`的所有 commit 到本地 repo。去掉 `<branch>`将抓取远程所有分⽀的修改。 |
| git pull`<remote>`               | 从指定`<remote>`抓取所有分⽀的 commit 并⽴刻合并到本地 repo。                                              |
| git push`<remote>` `<branch>`  | 将本地指定`<branch>`推送到指定远程`<remote>`。如果远程没有对应的分⽀，将⾃动在远程创建此分⽀。           |

#### git config

| git config -- global user.name`<name>`                      | 配置当前用户名，使⽤--global 参数将针对当前系统登录用户生效。                                                                    |
| :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------- |
| git config -- global user.email`<email>`                    | 配置当前⽤户 Email。                                                                                                             |
| git config -- global alias.`<alias-name>` `<git-command>` | 配置⼀个 git 命令的快捷⽅式。例如：配置 ”alias.glog log --graph --oneline”使 ”git glog”相当于 ”git log --graph --oneline”. |
| git config -- system core.editor`<editor>`                  | 配置⽂本编辑器，例如 vi，在必要时⾃动打开此⽂本编辑器。                                                                          |
| git config -- global --edit                                   | 打开当前⽤户的 git 全局配置并编辑。                                                                                              |

#### git log

| git log -`<limit>`             | 限制 log 的显示数量。例如：”git log -5”仅 显示最新 5 条 commit。                |
| -------------------------------- | :-------------------------------------------------------------------------------- |
| git log --oneline                | 每⾏显示⼀条 commit。                                                             |
| git log --author "`<pattern>`" | 按提交者名字搜索并显示 commit。                                                   |
| git log --grep "`<pattern>`"   | 按指定内容搜索并显示 commit。                                                     |
| git log`<since>`..`<until>`  | 显示指定范围的 commit。范围参数可以是 commit ID、分⽀名称、HEAD 或任意相对 位置。 |
| git log --`<file>`             | 仅显示包含指定⽂件修改的 commit。                                                 |
| git log --graph                  | 使⽤--graph 参数显示图形化的 branch 信 息。                                       |

#### git reset

| git reset                    | 移除所有暂存区的修改，但不会修改⼯作区。                                         |
| ---------------------------- | :------------------------------------------------------------------------------- |
| git reset --hard             | 移除所有暂存区的修改，并强制删除所有⼯作区的修改。                               |
| git reset`<commit>`        | 将当前分⽀回滚到指定`<commit>`，清除暂存区的修改，但保持⼯作区状态不变。       |
| git reset`<commit>` --hard | 将当前分⽀回滚到指定`<commit>`，清除暂存区的修改，并强制删除所有⼯作区的修改。 |

#### git rebase

| git rebase -i`<base>` | 以交互模式对当前分支做 rebase |
| ----------------------- | :---------------------------- |

#### git pull

| git pull --rebase`<remote>` | 抓取所有的远程分支，并以 rebase 模式并入本地的 repo 而不是 merge |
| :---------------------------- | :--------------------------------------------------------------- |

#### git push

| git push`<remote>` --force | 将本地分⽀推送到远程。不要使⽤--force 参数，除⾮你完全明⽩此操作的后果。                     |
| :--------------------------- | :------------------------------------------------------------------------------------------- |
| git push`<remote>` --tags  | 使⽤ push 命令并不会⾃动将本地 tag 推送 到远程。加上--tags 参数会将所有本地 tag 推送到远程。 |
