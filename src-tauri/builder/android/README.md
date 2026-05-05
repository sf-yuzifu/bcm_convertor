# Android 打包工具链

此目录包含 BCM 作品打包为 Android APK 所需的工具链。

## 工具清单

| 工具       | 文件                      | 大小  | 用途                      |
| ---------- | ------------------------- | ----- | ------------------------- |
| Apktool    | apktool.jar + apktool.bat | ~23MB | 反编译/重打包 APK         |
| 调试密钥   | debug.keystore            | ~3KB  | 签名 APK（调试用途）      |
| APK 签名器 | apksigner.bat             | ~1KB  | 调用 Android SDK 签名工具 |

## 使用方法

### 1. 反编译 APK

```bash
apktool d base.apk -o output/
```

### 2. 修改资源

- 修改 `output/AndroidManifest.xml` - 包名、应用名、版本号
- 替换 `output/res/mipmap-*/` - 图标资源
- 修改 `output/res/values/strings.xml` - 字符串资源
- 复制作品到 `output/assets/works/` - 作品资源

### 3. 重打包 APK

```bash
apktool b output/ -o unsigned.apk
```

### 4. 签名 APK

```bash
apksigner sign --ks debug.keystore --ks-pass pass:android --key-pass pass:android unsigned.apk
```

## 密钥信息

- **密钥库**: debug.keystore
- **密钥库密码**: android
- **别名**: androiddebugkey
- **密钥密码**: android

**注意**: 这是调试密钥，仅用于开发测试。发布到应用商店时需要使用正式签名密钥。

## 依赖要求

- Java 8 或更高版本
- Android SDK Build-Tools 33.0.1+（用于 apksigner）
