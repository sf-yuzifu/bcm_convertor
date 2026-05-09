# Android Shell APK

这是用于 BCM 作品打包的 Android 壳应用。

## 项目结构

```
shell/
├── build.gradle                    # 根构建配置
├── settings.gradle                 # 项目设置
├── gradle.properties              # Gradle 属性
├── README.md                       # 本文件
└── app/
    ├── build.gradle               # 应用构建配置
    └── src/main/
        ├── AndroidManifest.xml    # 应用清单
        ├── java/moe/yzf/bcm/shell/
        │   └── MainActivity.java  # 主活动
        ├── res/
        │   ├── layout/
        │   │   └── activity_main.xml
        │   ├── values/
        │   │   └── strings.xml
        │   └── mipmap-*/          # 图标资源目录
        └── assets/works/          # 作品资源目录（打包时填充）
```

## 打包流程

1. **编译壳 APK**
   ```bash
   $env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"; $env:PATH = "$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"; .\gradlew.bat assembleRelease
   ```
   输出: `app/build/outputs/apk/release/app-release-unsigned.apk`

2. **使用 Apktool 反编译**
   ```bash
   apktool d app-release-unsigned.apk -o output/
   ```

3. **修改资源**
   - 替换 `AndroidManifest.xml` 中的包名、应用名
   - 替换 `res/mipmap-*/` 中的图标
   - 替换 `res/values/strings.xml` 中的字符串
   - 复制作品资源到 `assets/works/`

4. **重打包**
   ```bash
   apktool b output/ -o new.apk
   ```

5. **签名**
   ```bash
   apksigner sign --ks mykey.jks new.apk
   ```

## 壳应用功能

- WebView 加载本地作品资源
- 支持 JavaScript、DOM Storage、数据库
- 自动点击 kitten4 播放按钮
- 处理本地资源请求（assets）
- 支持返回键导航

## 注意事项

- 壳应用默认包名: `moe.yzf.bcm.shell`
- 作品资源应放在 `assets/works/` 目录
- 入口文件应为 `assets/works/index.html`
