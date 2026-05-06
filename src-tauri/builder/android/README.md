# Android 打包工具链

此目录包含 BCM 作品打包为 Android APK 所需的工具链。JRE 和签名密钥首次使用时自动下载/生成。

## 工具清单

| 工具       | 文件             | 来源                                    | 大小  | 用途                         |
| ---------- | ---------------- | --------------------------------------- | ----- | ---------------------------- |
| Apktool    | apktool.jar      | 内置（仓库管理）                        | ~23MB | 反编译/重打包 APK            |
| APK 签名器 | apksigner.jar    | Android SDK Build-Tools（手动）         | ~1MB  | 签名 APK                     |
| 签名密钥   | release.keystore | 自动生成（PKCS12，30年有效）            | ~3KB  | Release 签名，手机可直接安装 |
| 内置 JRE   | jre/             | Eclipse Temurin + TUNA 镜像（自动下载） | ~80MB | Java 运行时                  |

## 快速开始

### 1. 准备工具链

```bash
# 一键下载 JRE + apktool.jar
yarn prepare:android
```

### 2. 获取 apksigner.jar

apksigner.jar 来自 Android SDK Build-Tools。获取方式：

**方式一：从已有 Android SDK 复制**

```bash
copy %ANDROID_HOME%\build-tools\34.0.0\lib\apksigner.jar src-tauri\builder\android\
```

**方式二：通过 Android SDK 命令行工具下载**

```bash
sdkmanager "build-tools;34.0.0"
# 然后复制 apksigner.jar
```

### 3. 打包 APK

打包时工具链会自动使用内置 JRE，**无需用户安装 Java**。

## 打包流程

1. 内置 JRE 运行 apktool 反编译 base.apk
2. 修改 AndroidManifest.xml（包名、应用名、版本号）
3. 替换图标资源和作品文件
4. 内置 JRE 运行 apktool 重打包 APK
5. 内置 JRE 运行 apksigner 签名 APK

## 密钥信息

签名密钥由 `prepare-android.mjs` 首次运行时自动生成，使用 PKCS12 格式（release.keystore）。

- **密钥库**: release.keystore（PKCS12，自动生成）
- **密钥库密码**: bcmconvertor
- **别名**: bcmkey
- **密钥密码**: bcmconvertor
- **证书有效期**: 30 年
- **签名方式**: Release 签名，手机可直接安装，无需额外操作
