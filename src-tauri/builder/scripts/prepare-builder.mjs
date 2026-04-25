import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const builderDir = resolve(scriptDir, '..')
const toolchainDir = join(builderDir, 'toolchain')
const toolchainMarker = join(toolchainDir, 'node_modules', 'electron-builder', 'out', 'index.js')

const getBundledRuntimeTarget = () => {
  if (process.platform === 'win32' && process.arch === 'x64') {
    return {
      runtimeDir: join(builderDir, 'runtimes', 'windows-x64'),
      binaryName: 'node.exe'
    }
  }

  if (process.platform === 'linux' && process.arch === 'x64') {
    return {
      runtimeDir: join(builderDir, 'runtimes', 'linux-x64'),
      binaryName: 'node'
    }
  }

  if (process.platform === 'darwin' && process.arch === 'arm64') {
    return {
      runtimeDir: join(builderDir, 'runtimes', 'macos-arm64'),
      binaryName: 'node'
    }
  }

  if (process.platform === 'darwin' && process.arch === 'x64') {
    return {
      runtimeDir: join(builderDir, 'runtimes', 'macos-x64'),
      binaryName: 'node'
    }
  }

  return null
}

const ensureBundledNodeRuntime = () => {
  const runtimeTarget = getBundledRuntimeTarget()

  if (!runtimeTarget) {
    return
  }

  const sourceNodePath = resolve(process.execPath)
  const targetNodePath = join(runtimeTarget.runtimeDir, runtimeTarget.binaryName)

  mkdirSync(runtimeTarget.runtimeDir, { recursive: true })

  if (existsSync(targetNodePath)) {
    const sourceStat = statSync(sourceNodePath)
    const targetStat = statSync(targetNodePath)
    if (sourceStat.size === targetStat.size) {
      return
    }
  }

  copyFileSync(sourceNodePath, targetNodePath)
}

const ensureBundledToolchain = () => {
  if (existsSync(toolchainMarker)) {
    return
  }

  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const result = spawnSync(npmCommand, ['install'], {
    cwd: toolchainDir,
    stdio: 'inherit',
    env: process.env
  })

  if (result.status !== 0) {
    throw new Error(`初始化内置 electron-builder 工具链失败，退出码: ${result.status ?? 'unknown'}`)
  }
}

const main = () => {
  ensureBundledNodeRuntime()
  ensureBundledToolchain()
}

main()
