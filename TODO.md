# TODO

## P0

- [x] 统一 Windows 端错误结构，约定 `code / title / text / detail / stage / retryable / logPath` 字段，并收口前后端传递方式
- [x] 建立 Windows 常见错误映射表，覆盖下载失败、打包失败、复制失败、打开目录失败、图标无效、权限不足、磁盘空间不足、作品数据异常等场景
- [x] 收敛 Windows 用户提示文案，界面只展示简短可执行提示，原始异常、命令输出和堆栈统一保留到日志
- [x] 统一失败后的界面动作，明确哪些场景提供重试、打开日志、打开导出目录，并补齐对应按钮和跳转逻辑
- [x] 统一构建日志落盘格式，补充时间、阶段、项目名、输出目录、缓存目录、错误码和关键 stdout/stderr 摘要
- [x] 明确日志写入与清理策略，约定成功/失败是否落盘、日志目录、命名规则、保留数量和清理方式
- [x] 确认前端暂不整体重写，维持当前单页流程；后续仅在新增功能明显推高维护成本时，再按需拆分状态和组件边界

## P1

- [ ] 如后续新增功能明显推高维护成本，再补主流程信息架构图，重点覆盖搜索、配置、进度、错误提示和完成页切换
- [x] 确认 Node 与打包工具链策略：发布版继续内置 Node 与 electron-builder，开发态保留系统 node 兜底，并精简根目录重复依赖
- [x] 整理 Windows 打包链路手工验收清单，覆盖正常作品、资源较大作品、异常输入三类场景，发版前确认产物生成、导出复制、输出打开和日志落盘都稳定；见 `docs/windows-release-checklist.md`
- [ ] 梳理并调整 Linux 端的 Tauri 配置，确认 bundle targets、窗口参数和平台差异策略
- [ ] 为 Linux 降级窗口效果，评估透明、无边框、阴影和自定义标题栏在不同桌面环境下的兼容性
- [ ] 补齐 Linux 所需的内置 Node 与 electron-builder 工具链资源，确认 `linux-x64` 运行时随包发布
- [ ] 验证 Linux 下的转换与打包主链路，重点确认 AppImage 生成、产物复制和打开输出目录流程
- [ ] 整理 Linux 构建前置依赖与环境文档，包括 WebKitGTK、appindicator、librsvg、patchelf 等

## P2

- [ ] 补充 Windows 发布与使用说明，记录产物位置、缓存行为、常见问题和处理方式
- [x] 模板文件优化时处理大体积 bcm 文本的内存峰值问题，优先改为路径直拷或后端读写，避免前端整段 parse/stringify
- [ ] 补一份 Linux 发版验收清单，覆盖正常流程、异常输入、日志落盘和缓存复用场景

## Android APK 打包功能（新增）

### 方案确定

采用**预编译壳应用 + Apktool 反编译/重打包**方案：

- 无需 Android SDK 和 Gradle，内置工具链仅约 20MB
- 支持修改：图标、包名、应用名、作者、版本号
- 构建速度快（10-30秒）
- 使用 Apktool 反编译 → 修改资源 → 重打包 → 签名

### Phase 1: 壳应用开发 ✅

- [x] 创建 Android 壳项目（WebView 加载本地作品）
- [x] 实现 kitten3/kitten4 渲染支持（WebView 加载运行时）
- [x] 配置壳应用基础信息（默认包名、图标、权限）
- [x] 添加默认图标资源（ic_launcher.png，使用 kitten3_player_icon.png）
- [x] 编译并导出壳 APK 模板（base.apk，约 4.5MB）

### Phase 2: 工具链集成 ✅

- [x] 下载并内置 Apktool 2.9.3（约 23MB）
- [x] 配置 apktool 工作目录结构（src-tauri/builder/android/）
- [x] 准备调试签名密钥（debug.keystore）
- [x] 创建 apksigner 包装脚本
- [x] 验证工具链完整流程（反编译 → 重打包 → 签名）

### Phase 3: 打包服务实现

- [ ] 创建 `src/services/packagers/androidPackager.js`
- [ ] 实现 APK 反编译功能（调用 apktool d）
- [ ] 实现资源替换逻辑：
  - [ ] 修改 AndroidManifest.xml（包名、应用名、版本号）
  - [ ] 替换 res/mipmap-\* 图标资源
  - [ ] 修改 res/values/strings.xml（作者等信息）
  - [ ] 复制作品资源到 assets/works/ 目录
- [ ] 实现 APK 重打包（调用 apktool b）
- [ ] 实现 APK 签名（使用 apksigner 或 jarsigner）
- [ ] 添加 Rust 后端命令 `run_android_packaging`

### Phase 4: 前端集成

- [ ] 在版本选择器中添加 "Android APK" 选项
- [ ] 添加 APK 打包配置面板：
  - [ ] 包名输入（反向域名格式，如 moe.yuzifu.myapp）
  - [ ] 应用名称输入
  - [ ] 版本号设置（versionCode + versionName）
  - [ ] 图标选择（支持自适应图标）
  - [ ] 作者信息
- [ ] 适配进度显示，支持 Android 打包阶段：
  - [ ] 反编译壳 APK
  - [ ] 修改配置信息
  - [ ] 复制作品资源
  - [ ] 重打包 APK
  - [ ] 签名 APK
- [ ] 添加 Android 平台错误码和错误处理

### Phase 5: 测试与优化

- [ ] 验证 kitten3 作品 APK 打包
- [ ] 验证 kitten4 作品 APK 打包
- [ ] 验证在线作品 APK 打包
- [ ] 测试不同 Android 版本兼容性（Android 5.0+）
- [ ] 测试不同设备屏幕尺寸适配
- [ ] 优化 APK 体积（资源压缩、WebView 缓存策略）

### Phase 6: 发版准备

- [ ] 更新 README，添加 Android 打包说明
- [ ] 创建 Android 打包验收清单
- [ ] 添加用户文档（如何安装 APK、常见问题）
- [ ] 配置壳应用自动更新机制（可选）
