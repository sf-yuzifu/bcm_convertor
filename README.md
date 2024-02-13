<h1 align="center">
    <br>
    编程猫格式工厂
    <br>
    <img width="128" alt="bcm_convertor" src="src-tauri/icons/bcm_convertor.png"/>
    <br>
    <a href='https://gitee.com/sf-yuzifu/bcm_convertor/stargazers'><img src='https://gitee.com/sf-yuzifu/bcm_convertor/badge/star.svg?theme=white' alt='Gitee stars' /></a>
    <a href='https://gitee.com/sf-yuzifu/bcm_convertor/members'><img src='https://gitee.com/sf-yuzifu/bcm_convertor/badge/fork.svg?theme=white' alt='Gitee forks' /></a>
    <a href='https://github.com/sf-yuzifu/bcm_convertor/stargazers'><img alt="GitHub stars" src="https://img.shields.io/github/stars/214545666/bcm_convertor?style=social"></a>
    <a href='https://github.com/sf-yuzifu/bcm_convertor/members'><img alt="GitHub forks" src="https://img.shields.io/github/forks/214545666/bcm_convertor?style=social"></a>
    <br>
</h1>
<br>

**作者：小鱼yuzifu**  [(编程猫id：438403)](https://shequ.codemao.cn/user/438403)

### 简单介绍

一个将Kitten3/4文件（.bcm/.bcm4）转换为应用程序的软件，能够帮助你将自己在Kitten3/4上的作品在Windows/Mac OS/Linux上快速打包成可执行程序！

#### 优点

* 文件大小不受限制（官方限制30MB）
* 使用Tauri封装，多平台支持
* 无次数限制
* 转换等待时间短
* 并入kitten3转换
* 支持在线作品转换（支持云变量呦～）
* 与Electron版本相比，体积更小，运行速度更快

#### 缺点
* 目前已知在转换过程中会卡顿

### 安装方式

#### 1. 通过各大商店下载（更新速度较慢）

> 更新时间：不定（通常与Github提供时间相同）

* 目前只提供Linux下星火应用商店和UOS应用商店下载

#### 2. 直接下载文件安装（更新速度较快）

> 更新时间：2024-2-13（Windows/Mac OS/Linux）

* Github：[https://github.com/sf-yuzifu/bcm_convertor/releases/latest](https://github.com/sf-yuzifu/bcm_convertor/releases/latest)
* Gitee：[https://gitee.com/sf-yuzifu/bcm_convertor/releases/latest](https://gitee.com/sf-yuzifu/bcm_convertor/releases/latest)

#### 3. 运行源代码（最快，可以实时获取更新）

> 更新时间：查看最近提交时间

你只需要简单的几行代码即可正常运行 (请确保安装的nodejs版本为最新)

```bash
git clone https://gitee.com/sf-yuzifu/bcm_convertor.git
cd bcm_convertor
yarn install
yarn tauri dev
```

打包也只需要下面的一行代码

```bash
yarn tauri build
```

### 感谢名单

1. 各个技术喵喵！(转换源文件提供)
2. [Tauri](https://github.com/tauri-apps/tauri)开源项目 (跨平台封装工具)
3. [Electron](https://github.com/electron/electron)开源项目 (网页封装工具)
4. [Appimage](https://github.com/AppImage/appimagekit)开源项目 (Linux下单文件打包工具)
5. [WinRAR](http://www.winrar.com.cn/) (Windows下单文件打包工具)
6. [海藻酸钠](https://gitee.com/sodiumcode) (三大系统下特色风格图标绘制)
