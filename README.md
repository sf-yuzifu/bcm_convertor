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

**作者：小鱼yuzifu** [(编程猫id：438403)](https://shequ.codemao.cn/user/438403)

### 简介

支持 Kitten 3 / Kitten 4 / Kitten N，一键将作品打包为 Windows / macOS / Linux 桌面应用或 Android APK。

### 功能特点

| 特性               | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| **多平台打包**     | Windows EXE、macOS App、Linux AppImage、Android APK          |
| **多版本支持**     | Kitten 3（.bcm）、Kitten 4、Kitten N 作品                    |
| **离线作品**       | 选择本地 .bcm 文件直接打包                                   |
| **在线作品**       | 输入作品 ID 在线拉取，支持云变量                             |
| **自定义配置**     | 应用名称、图标（本地上传或自动获取封面）、图标圆角、导出路径 |
| **智能适配**       | 根据作品宽高自动设置横屏/竖屏                                |
| **沉浸式状态栏**   | Android 端透明状态栏 + 实时颜色同步                          |
| **独立签名**       | 每个包名自动生成独立签名密钥，多个 APK 安装无冲突            |
| **构建日志**       | 全程日志落盘，方便排查问题                                   |
| **作品体积无限制** | 不受官方 30MB 限制                                           |

### 与旧版（Electron）的对比

- 基于 Tauri 2 封装，安装包体积更小，运行更快
- 新增 Android APK 打包能力
- 新增 Kitten N 作品支持

### 安装方式

#### 1. 直接下载（推荐）

- **GitHub**：[https://github.com/sf-yuzifu/bcm_convertor/releases/latest](https://github.com/sf-yuzifu/bcm_convertor/releases/latest)
- **Gitee**：[https://gitee.com/sf-yuzifu/bcm_convertor/releases/latest](https://gitee.com/sf-yuzifu/bcm_convertor/releases/latest)

#### 2. 应用商店（Linux）

- 星火应用商店
- UOS 应用商店

#### 3. 从源代码运行

确保安装 Node.js（推荐最新版本）

```bash
git clone https://gitee.com/sf-yuzifu/bcm_convertor.git
cd bcm_convertor
yarn install
yarn tauri dev
```

构建安装包：

```bash
yarn tauri build
```

### 使用说明

1. 启动应用，选择作品版本（Kitten 3 / Kitten 4 / Kitten N）
2. **离线作品**：选择本地 .bcm 文件或者输入作品 ID；**在线作品**：输入作品 ID
3. 进入打包配置页面，填写应用名称、选择图标、选择目标平台
4. 点击打包，等待构建完成

> **注意**：首次打包 Android APK 时，工具链会自动下载 Java 运行时（约 80MB），请耐心等待。桌面端首次打包会自动下载 Node.js 运行时（约 50MB）。

### 技术栈

- [Tauri 2](https://github.com/tauri-apps/tauri) — 跨平台应用框架
- [Electron](https://github.com/electron/electron) — 桌面端作品运行时
- [Apktool](https://github.com/iBotPeaches/Apktool) — Android APK 反编译/重打包
- React + Ant Design — 前端界面
- Rust — 后端打包逻辑

### 感谢名单

1. 各个技术喵喵！（转换源文件提供）
2. [Tauri](https://github.com/tauri-apps/tauri) 开源项目（跨平台封装工具）
3. [Electron](https://github.com/electron/electron) 开源项目（网页封装工具）
4. [Electron Builder](https://github.com/electron-userland/electron-builder) 开源项目（桌面端应用打包工具）
5. [Apktool](https://github.com/iBotPeaches/Apktool) 开源项目（APK 反编译/重打包工具）
6. [海藻酸钠](https://gitee.com/sodiumcode)（三大系统下特色风格图标绘制）

### 开源协议

[GPL-3.0](LICENSE)
