import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, parse, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const RESULT_MARKER = '__BCM_BUILDER_RESULT__='
const DEFAULT_ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/'
const DEFAULT_ELECTRON_BUILDER_BINARIES_MIRROR =
  'https://npmmirror.com/mirrors/electron-builder-binaries/'
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

const getElectronVersion = (root) => {
  const packageJson = readJson(join(root, 'package.json'))
  const version =
    packageJson.devDependencies?.electron ||
    packageJson.dependencies?.electron ||
    packageJson.optionalDependencies?.electron

  if (!version) {
    throw new Error(`找不到 electron 版本声明: ${root}`)
  }

  return String(version).replace(/^[^\d]*/, '')
}

const createTargetConfig = (context) => {
  if (context.platform === 'linux') {
    return { linux: { target: [context.target] } }
  }

  if (context.platform === 'macos') {
    return { mac: { target: [context.target] } }
  }

  return {
    win: {
      target: [context.target],
      signAndEditExecutable: false,
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

const getCacheRoot = (context) =>
  process.env.BCM_BUILDER_CACHE_ROOT || join(dirname(context.outputDir), '.builder-cache')

const buildApp = async (context) => {
  const toolchainRoot = getToolchainRoot()
  const toolchainRequire = getRequire(toolchainRoot)
  const { build } = toolchainRequire('electron-builder')
  const electronVersion = getElectronVersion(toolchainRoot)
  const artifactName = createArtifactName(context)
  const cacheRoot = getCacheRoot(context)

  normalizeAppPackageJson(context)
  mkdirSync(cacheRoot, { recursive: true })
  applyDownloadMirrors()
  process.env.ELECTRON_BUILDER_CACHE = join(cacheRoot, 'electron-builder')
  process.env.ELECTRON_CACHE = join(cacheRoot, 'electron')

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
    ...createTargetConfig(context)
  }

  const results = await build({
    projectDir: toolchainRoot,
    config,
    publish: 'never'
  })

  const artifactPath =
    results.find((entry) => !entry.endsWith('.blockmap')) ||
    results[0]

  if (!artifactPath) {
    throw new Error('electron-builder 没有生成可用产物')
  }

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
  console.log(`${RESULT_MARKER}${JSON.stringify(result)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
