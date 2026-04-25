import { basename, join } from '@tauri-apps/api/path'
import { writeTextFile } from '@tauri-apps/plugin-fs'
import { type } from '@tauri-apps/plugin-os'

import { copyPath } from '../files/fileTransferService.js'
import { invokeBackendCommand } from '../system/backendCommandService.js'
import { getEnv } from '../system/runtimeService.js'
import { getConvertHome } from '../workspace/pathService.js'

const WINDOWS = 'windows'
const LINUX = 'linux'
const MACOS = 'macos'
const CONTEXT_FILE_NAME = '.bcm-builder-context.json'

const PLATFORM_CONFIG = {
  [WINDOWS]: {
    target: 'portable',
    title: 'Windows 打包失败',
    text: '内置 electron-builder 执行失败，请检查内置工具链是否完整'
  },
  [LINUX]: {
    target: 'AppImage',
    title: 'Linux 打包失败',
    text: '内置 electron-builder 执行失败，请检查 AppImage 工具链是否完整'
  },
  [MACOS]: {
    target: 'dir',
    title: 'macOS 打包失败',
    text: '内置 electron-builder 执行失败，请检查内置工具链是否完整'
  }
}

const sanitizeArtifactName = (value) => {
  const sanitized = String(value || '')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    .replace(/[. ]+$/g, '')
    .trim()

  return sanitized.slice(0, 120) || 'bcm-project'
}

const sanitizePackageName = (value) => {
  const normalized = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'bcm-project'
}

const createBuildContext = async (projectInfo, osType) => {
  const { home: workspaceDir } = await getConvertHome()
  const { desktopDirPath } = await getEnv()
  const platformConfig = PLATFORM_CONFIG[osType] || PLATFORM_CONFIG[WINDOWS]
  const artifactBaseName = sanitizeArtifactName(projectInfo.name)

  return {
    workspaceDir,
    outputDir: await join(workspaceDir, 'dist'),
    desktopDirPath,
    target: platformConfig.target,
    platform: osType,
    productName: projectInfo.name,
    artifactBaseName,
    safePackageName: sanitizePackageName(projectInfo.name),
    version: '1.0.0'
  }
}

export const packageWithElectronBuilder = async (projectInfo) => {
  const osType = await type()
  const buildContext = await createBuildContext(projectInfo, osType)
  const contextPath = await join(buildContext.workspaceDir, CONTEXT_FILE_NAME)

  await writeTextFile(contextPath, JSON.stringify(buildContext, null, 2))

  const { title, text } = PLATFORM_CONFIG[osType] || PLATFORM_CONFIG[WINDOWS]
  const result = await invokeBackendCommand(
    'run_electron_builder',
    { contextPath },
    { title, text }
  )

  const artifactName = await basename(result.artifactPath)
  await copyPath(result.artifactPath, await join(buildContext.desktopDirPath, artifactName))

  return result
}
