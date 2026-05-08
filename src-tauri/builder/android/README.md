# Android 打包工具链

此目录仅包含微小文件。JRE、Node.js 运行时、签名密钥在首次打包时自动下载/生成到应用数据目录（`%LOCALAPPDATA%/bcm-convertor/runtimes/`），无需随安装包分发。

## 工具清单

| 工具       | 文件             | 来源                            | 大小  | 用途                    |
| ---------- | ---------------- | ------------------------------- | ----- | ----------------------- |
| Apktool    | apktool.jar      | 内置（仓库管理）                | ~23MB | 反编译/重打包 APK       |
| APK 签名器 | apksigner.jar    | Android SDK Build-Tools         | ~1MB  | 签名 APK                |
| 签名密钥   | release.keystore | 首次打包自动生成（PKCS12）      | ~3KB  | Release 签名            |
| 内置 JRE   | (app data)       | Eclipse Temurin（首次按需下载） | ~80MB | Java 运行时             |
| Node.js    | (app data)       | Node.js 官方（首次按需下载）    | ~50MB | Electron Builder 运行时 |

## 运行时下载策略

首次触发对应平台打包时自动下载，后续直接使用缓存：

```
%LOCALAPPDATA%/bcm-convertor/runtimes/
├── node.exe              # Electron Builder 打包时下载
├── jre/                   # Android 打包时下载
│   ├── bin/java.exe
│   └── lib/...
└── release.keystore      # Android 打包时自动生成
```

## 密钥信息

签名密钥由首次 Android 打包时自动生成。

- **密钥库**: release.keystore（PKCS12，自动生成）
- **密钥库密码**: bcmconvertor
- **别名**: bcmkey
- **密钥密码**: bcmconvertor
- **证书有效期**: 30 年
- **签名方式**: Release 签名，手机可直接安装

## 打包流程

1. 首次使用自动下载 JRE 到应用数据目录
2. 自动生成签名密钥
3. 内置 JRE 运行 apktool 反编译 base.apk
4. 修改 AndroidManifest.xml（包名、应用名、版本号）
5. 替换图标资源和作品文件
6. 内置 JRE 运行 apktool 重打包 APK
7. 内置 JRE 运行 apksigner 签名 APK
