import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, parse, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const RESULT_MARKER = '__BCM_BUILDER_RESULT__='
const PROGRESS_MARKER = '__BCM_BUILDER_PROGRESS__='
const DEFAULT_ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/'
const DEFAULT_ELECTRON_BUILDER_BINARIES_MIRROR = 'https://npmmirror.com/mirrors/electron-builder-binaries/'
const scriptDir = dirname(fileURLToPath(import.meta.url))
const bundledToolchainRoot = resolve(scriptDir, '..', 'toolchain')

const readJson = (filePath) => JSON.parse(readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''))

const fileExists = (filePath) => existsSync(filePath)

const hasElectronBuilder = (root) =>
  fileExists(join(root, 'package.json')) &&
  fileExists(join(root, 'node_modules', 'electron-builder', 'out', 'index.js'))

const findAncestorToolchainRoot = (startDir) => {
  let current = resolve(startDir)
  const { root } = parse(current)

  while (true) {
    if (hasElectronBuilder(current)) {
      return current
    }

    if (current === root) {
      return null
    }

    current = dirname(current)
  }
}

const getToolchainRoot = () => {
  if (hasElectronBuilder(bundledToolchainRoot)) {
    return bundledToolchainRoot
  }

  const devToolchainRoot = findAncestorToolchainRoot(scriptDir)

  if (devToolchainRoot) {
    return devToolchainRoot
  }

  throw new Error('找不到可用的 electron-builder 工具链目录')
}

const getRequire = (root) => createRequire(pathToFileURL(join(root, 'package.json')))

const emitLog = (message) => {
  process.stdout.write(`[bcm-builder] ${message}\n`)
}

const formatCommandPart = (value) => {
  const text = String(value)
  if (/[\s"]/u.test(text)) {
    return JSON.stringify(text)
  }

  return text
}

const formatCommandLine = (parts) => parts.map((part) => formatCommandPart(part)).join(' ')

const mergeCsvEnvValue = (currentValue, nextValues) => {
  const merged = new Set(
    String(currentValue || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  )

  nextValues.forEach((item) => {
    if (item) {
      merged.add(item)
    }
  })

  return [...merged].join(',')
}

const emitProgress = ({ stage, message, percent, detail }) => {
  const payload = {
    stage,
    message,
    ...(typeof percent === 'number' ? { percent } : {}),
    ...(detail ? { detail } : {})
  }

  process.stdout.write(`${PROGRESS_MARKER}${JSON.stringify(payload)}\n`)
}

const clampPercent = (value) => Math.min(100, Math.max(0, value))

const formatBytes = (value) => {
  if (!Number.isFinite(value) || value <= 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  let size = value
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  const fractionDigits = unitIndex === 0 ? 0 : 1
  return `${size.toFixed(fractionDigits)} ${units[unitIndex]}`
}

const getDownloadLabel = (requestOptions, destination) => {
  if (destination) {
    return basename(destination)
  }

  const protocol = requestOptions.protocol || 'https:'
  const hostname = requestOptions.hostname || ''
  const requestPath = requestOptions.path || ''

  try {
    const url = new URL(`${protocol}//${hostname}${requestPath}`)
    const pathName = decodeURIComponent(url.pathname)
    return basename(pathName) || hostname || '打包依赖'
  } catch {
    return hostname || '打包依赖'
  }
}

const createDownloadDetail = (label, progress) => {
  const transferred = formatBytes(progress.transferred)
  const total = formatBytes(progress.total)
  const speed = formatBytes(progress.bytesPerSecond || 0)
  return `${label} ${transferred} / ${total}，${speed}/s`
}

const proxyReadableToStdStream = (readable, targetStream) => {
  if (!readable) {
    return
  }

  readable.on('data', (chunk) => {
    targetStream.write(chunk)
  })
}

const installAppBuilderOutputProxy = (root) => {
  const toolchainRequire = getRequire(root)
  const builderUtil = toolchainRequire('builder-util')

  if (builderUtil.__bcmOutputProxyInstalled) {
    return
  }

  const originalExecuteAppBuilder = builderUtil.executeAppBuilder
  builderUtil.executeAppBuilder = (args, childProcessConsumer, extraOptions, maxRetries) =>
    originalExecuteAppBuilder(
      args,
      (childProcess) => {
        proxyReadableToStdStream(childProcess.stdout, process.stdout)
        proxyReadableToStdStream(childProcess.stderr, process.stderr)
        childProcessConsumer?.(childProcess)
      },
      extraOptions,
      maxRetries
    )
  builderUtil.__bcmOutputProxyInstalled = true
}

const installDownloadProgressProxy = (root) => {
  const toolchainRequire = getRequire(root)
  const builderUtilRuntime = toolchainRequire('builder-util-runtime')
  const { HttpExecutor } = builderUtilRuntime

  if (HttpExecutor.prototype.__bcmDownloadProgressInstalled) {
    return
  }

  const originalDoDownload = HttpExecutor.prototype.doDownload
  HttpExecutor.prototype.doDownload = function patchedDoDownload(requestOptions, options, redirectCount) {
    if (options?.destination && options?.options && !options.options.__bcmProgressWrapped) {
      const label = getDownloadLabel(requestOptions, options.destination)
      const originalOnProgress = options.options.onProgress
      let started = false
      let lastPercent = -1

      options = {
        ...options,
        options: {
          ...options.options,
          __bcmProgressWrapped: true,
          onProgress: (progress) => {
            const rawPercent = Number(progress?.percent ?? 0)
            const percent = clampPercent(rawPercent)
            const roundedPercent = Math.round(percent)

            if (!started) {
              started = true
              emitProgress({
                stage: 'download',
                message: `正在下载 ${label}`,
                percent: 0,
                detail: createDownloadDetail(label, {
                  transferred: 0,
                  total: progress?.total || 0,
                  bytesPerSecond: 0
                })
              })
            }

            if (roundedPercent !== lastPercent) {
              lastPercent = roundedPercent
              emitProgress({
                stage: 'download',
                message: `正在下载 ${label} ${roundedPercent}%`,
                percent,
                detail: createDownloadDetail(label, progress)
              })
            }

            originalOnProgress?.(progress)
          }
        }
      }
    }

    return originalDoDownload.call(this, requestOptions, options, redirectCount)
  }

  HttpExecutor.prototype.__bcmDownloadProgressInstalled = true
}

const getElectronVersion = (root) => {
  const packageJson = readJson(join(root, 'package.json'))
  const version =
    packageJson.bcmBuilder?.electronVersion ||
    packageJson.devDependencies?.electron ||
    packageJson.dependencies?.electron ||
    packageJson.optionalDependencies?.electron

  if (!version) {
    throw new Error(`找不到 electron 版本声明: ${root}`)
  }

  return String(version).replace(/^[^\d]*/, '')
}

const getResolvedIconPath = (context) => {
  const iconPath = String(context.iconPath || '').trim()
  if (!iconPath) {
    return ''
  }

  const resolvedIconPath = resolve(iconPath)
  if (!fileExists(resolvedIconPath)) {
    throw new Error(`找不到自定义图标文件: ${resolvedIconPath}`)
  }

  return resolvedIconPath
}

const createGeneratedIconOutputPath = (context) => {
  const artifactBaseName = String(context.artifactBaseName || 'app-icon')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    .trim()
  return join(context.outputDir, '.builder-icons', `${artifactBaseName}.ico`)
}

const resolveBuilderIconPath = async (context, root) => {
  const iconPath = getResolvedIconPath(context)
  if (!iconPath) {
    emitLog('未提供自定义图标，继续使用默认图标配置')
    return ''
  }

  const extension = extname(iconPath).toLowerCase()
  if (context.platform === 'windows' && extension === '.png') {
    const toolchainRequire = getRequire(root)
    const pngToIco = toolchainRequire('png-to-ico')
    const outputPath = createGeneratedIconOutputPath(context)

    mkdirSync(dirname(outputPath), { recursive: true })
    emitProgress({ stage: 'prepare', message: '正在处理应用图标', percent: 45 })
    emitLog(`检测到 Windows PNG 图标，开始转换为 ICO`)
    emitLog(`图标转换: ${iconPath} -> ${outputPath}`)
    const iconBuffer = await pngToIco(iconPath)
    writeFileSync(outputPath, iconBuffer)
    emitProgress({ stage: 'prepare', message: '正在处理应用图标', percent: 70 })
    emitLog(`图标转换完成: ${outputPath}`)
    return outputPath
  }

  emitProgress({ stage: 'prepare', message: '正在处理应用图标', percent: 60 })
  emitLog(`使用自定义图标: ${iconPath}`)
  return iconPath
}

const validateIconExtension = (iconPath, platform) => {
  if (!iconPath) {
    return
  }

  const extension = extname(iconPath).toLowerCase()

  if (platform === 'windows' && !['.ico', '.png'].includes(extension)) {
    throw new Error('Windows 打包仅支持使用 .ico 或 .png 作为自定义图标')
  }

  if (platform === 'macos' && extension !== '.icns') {
    throw new Error('macOS 打包仅支持使用 .icns 作为自定义图标')
  }

  if (platform === 'linux' && !['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.icns'].includes(extension)) {
    throw new Error('Linux 打包仅支持 png/jpg/jpeg/webp/svg/ico/icns 作为自定义图标')
  }
}

const createTargetConfig = async (context, root) => {
  const iconPath = await resolveBuilderIconPath(context, root)
  validateIconExtension(iconPath, context.platform)

  if (context.platform === 'linux') {
    return { linux: { target: [context.target], ...(iconPath ? { icon: iconPath } : {}) } }
  }

  if (context.platform === 'macos') {
    return { mac: { target: [context.target], ...(iconPath ? { icon: iconPath } : {}) } }
  }

  return {
    win: {
      target: [context.target],
      ...(iconPath ? { icon: iconPath } : {}),
      signAndEditExecutable: true,
      verifyUpdateCodeSignature: false
    }
  }
}

const createArtifactName = (context) => {
  if (context.target === 'portable') {
    return `${context.artifactBaseName}.exe`
  }

  if (context.target === 'AppImage') {
    return `${context.artifactBaseName}.AppImage`
  }

  return undefined
}

const normalizeAppPackageJson = (context) => {
  const { workspaceDir, safePackageName, productName, version } = context
  const packageJsonPath = join(workspaceDir, 'package.json')
  const packageJson = readJson(packageJsonPath)

  // electron-builder 会先校验 package.json 的 name，这里必须保证它始终是安全包名。
  packageJson.name = safePackageName
  packageJson.productName = productName
  packageJson.version = version || packageJson.version || '1.0.0'

  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8')
}

const applyDownloadMirrors = () => {
  process.env.ELECTRON_MIRROR ||= DEFAULT_ELECTRON_MIRROR
  process.env.npm_config_electron_mirror ||= process.env.ELECTRON_MIRROR
  process.env.ELECTRON_BUILDER_BINARIES_MIRROR ||= DEFAULT_ELECTRON_BUILDER_BINARIES_MIRROR
}

const applyDebugLogging = () => {
  process.env.DEBUG = mergeCsvEnvValue(process.env.DEBUG, [
    'electron-builder',
    'electron-builder:*',
    'app-builder-lib',
    'app-builder-lib:*',
    'builder-util',
    'builder-util:*'
  ])
  process.env.DEBUG_COLORS ||= '0'
}

const getCacheRoot = (context) =>
  process.env.BCM_BUILDER_CACHE_ROOT || join(dirname(context.outputDir), '.builder-cache')

const buildApp = async (context) => {
  const toolchainRoot = getToolchainRoot()
  installAppBuilderOutputProxy(toolchainRoot)
  installDownloadProgressProxy(toolchainRoot)
  const toolchainRequire = getRequire(toolchainRoot)
  const { build } = toolchainRequire('electron-builder')
  const electronVersion = getElectronVersion(toolchainRoot)
  const artifactName = createArtifactName(context)
  const cacheRoot = getCacheRoot(context)

  emitProgress({ stage: 'prepare', message: '正在准备打包环境', percent: 10 })
  normalizeAppPackageJson(context)
  mkdirSync(cacheRoot, { recursive: true })
  applyDownloadMirrors()
  applyDebugLogging()
  process.env.ELECTRON_BUILDER_CACHE = join(cacheRoot, 'electron-builder')
  process.env.ELECTRON_CACHE = join(cacheRoot, 'electron')
  emitProgress({ stage: 'prepare', message: '正在准备打包环境', percent: 30 })
  emitLog(`工具链目录: ${toolchainRoot}`)
  emitLog(`工作目录: ${context.workspaceDir}`)
  emitLog(`输出目录: ${context.outputDir}`)
  emitLog(`缓存目录: ${cacheRoot}`)
  emitLog(`构建目标: ${context.platform}/${context.target}`)
  emitLog(`应用名称: ${context.productName}`)
  emitLog(`应用版本: ${context.version || '1.0.0'}`)
  emitLog(`Electron 版本: ${electronVersion}`)
  emitLog(`镜像地址: ${process.env.ELECTRON_MIRROR}`)
  emitLog(`DEBUG: ${process.env.DEBUG}`)
  emitLog(`DEBUG_COLORS: ${process.env.DEBUG_COLORS}`)
  emitLog(`builder 缓存: ${process.env.ELECTRON_BUILDER_CACHE}`)
  emitLog(`electron 缓存: ${process.env.ELECTRON_CACHE}`)

  const config = {
    appId: 'com.bcm-convertor.generated',
    productName: context.productName,
    asar: true,
    compression: 'normal',
    npmRebuild: false,
    buildDependenciesFromSource: false,
    electronVersion,
    directories: {
      app: context.workspaceDir,
      output: context.outputDir
    },
    files: ['**/*', '!dist{,/**}', '!package.json.example', '!.bcm-builder-context.json'],
    extraMetadata: {
      name: context.safePackageName,
      productName: context.productName,
      version: context.version || '1.0.0'
    },
    artifactName,
    ...(await createTargetConfig(context, toolchainRoot))
  }
  emitLog('electron-builder 配置摘要:')
  emitLog(
    JSON.stringify(
      {
        projectDir: toolchainRoot,
        publish: 'never',
        config
      },
      null,
      2
    )
  )
  emitLog(
    `等效命令: ${formatCommandLine([
      join(toolchainRoot, 'node_modules', '.bin', 'electron-builder'),
      '--projectDir',
      toolchainRoot,
      '--publish',
      'never'
    ])}`
  )

  emitProgress({ stage: 'prepare', message: '正在生成打包配置', percent: 85 })
  emitProgress({ stage: 'build', message: '正在启动打包引擎', percent: 10 })
  emitLog('开始执行 electron-builder')
  const results = await build({
    projectDir: toolchainRoot,
    config,
    publish: 'never'
  })
  emitLog('electron-builder 执行完成')
  emitLog(`输出产物: ${JSON.stringify(results, null, 2)}`)

  const artifactPath = results.find((entry) => !entry.endsWith('.blockmap')) || results[0]

  if (!artifactPath) {
    throw new Error('electron-builder 没有生成可用产物')
  }

  emitProgress({ stage: 'finalize', message: '正在整理打包产物', percent: 60 })
  return {
    artifactPath
  }
}

const main = async () => {
  const contextPath = process.argv[2]

  if (!contextPath) {
    throw new Error('缺少构建上下文路径')
  }

  const context = readJson(contextPath)
  const result = await buildApp(context)
  emitProgress({ stage: 'success', message: '打包任务已完成', percent: 100 })
  console.log(`${RESULT_MARKER}${JSON.stringify(result)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
