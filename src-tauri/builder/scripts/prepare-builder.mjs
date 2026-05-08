import { existsSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const builderDir = resolve(scriptDir, '..')
const toolchainDir = join(builderDir, 'toolchain')
const toolchainMarker = join(toolchainDir, 'node_modules', 'electron-builder', 'out', 'index.js')
const electronModuleDir = join(toolchainDir, 'node_modules', 'electron')
const appBuilderBinDir = join(toolchainDir, 'node_modules', 'app-builder-bin')
const npmCommand = process.platform === 'win32' ? 'npm' : 'npm'

const hasRequiredAppBuilderBin = () => {
  if (!existsSync(appBuilderBinDir)) {
    return false
  }

  if (process.platform === 'win32') {
    return (
      existsSync(join(appBuilderBinDir, 'win', 'x64', 'app-builder.exe')) &&
      existsSync(join(appBuilderBinDir, 'win', 'ia32', 'app-builder.exe'))
    )
  }

  if (process.platform === 'linux') {
    return existsSync(join(appBuilderBinDir, 'linux', process.arch, 'app-builder'))
  }

  if (process.platform === 'darwin') {
    const binaryName = process.arch === 'arm64' ? 'app-builder_arm64' : 'app-builder_amd64'
    return existsSync(join(appBuilderBinDir, 'mac', binaryName))
  }

  return true
}

const ensureBundledToolchain = () => {
  const hasToolchain = existsSync(toolchainMarker)

  if (hasToolchain && hasRequiredAppBuilderBin()) {
    return
  }

  if (hasToolchain) {
    removeIfExists(appBuilderBinDir)
  }

  const result = spawnSync(npmCommand, ['install'], {
    cwd: toolchainDir,
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32'
  })

  if (result.error) {
    throw new Error(`初始化内置 electron-builder 工具链失败: ${result.error.message}`)
  }

  if (result.status !== 0) {
    throw new Error(`初始化内置 electron-builder 工具链失败，退出码: ${result.status}`)
  }
}

const removeIfExists = (targetPath) => {
  if (existsSync(targetPath)) {
    rmSync(targetPath, { recursive: true, force: true })
  }
}

const pruneAppBuilderBin = () => {
  if (!existsSync(appBuilderBinDir)) {
    return
  }

  if (process.platform === 'win32') {
    removeIfExists(join(appBuilderBinDir, 'linux'))
    removeIfExists(join(appBuilderBinDir, 'mac'))
    return
  }

  if (process.platform === 'linux') {
    removeIfExists(join(appBuilderBinDir, 'mac'))
    removeIfExists(join(appBuilderBinDir, 'win'))

    if (process.arch === 'x64') {
      removeIfExists(join(appBuilderBinDir, 'linux', 'arm'))
      removeIfExists(join(appBuilderBinDir, 'linux', 'arm64'))
      removeIfExists(join(appBuilderBinDir, 'linux', 'ia32'))
    }

    return
  }

  if (process.platform === 'darwin') {
    removeIfExists(join(appBuilderBinDir, 'linux'))
    removeIfExists(join(appBuilderBinDir, 'win'))

    if (process.arch === 'arm64') {
      removeIfExists(join(appBuilderBinDir, 'mac', 'app-builder_amd64'))
    }

    if (process.arch === 'x64') {
      removeIfExists(join(appBuilderBinDir, 'mac', 'app-builder_arm64'))
    }
  }
}

const pruneBundledToolchain = () => {
  removeIfExists(electronModuleDir)
  pruneAppBuilderBin()
}

const main = () => {
  ensureBundledToolchain()
  pruneBundledToolchain()
}

main()
