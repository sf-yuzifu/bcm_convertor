import { desktopDir, homeDir, join } from '@tauri-apps/api/path'
import { exists, remove } from '@tauri-apps/plugin-fs'
import { type } from '@tauri-apps/plugin-os'

import { invokeBackendCommand } from '../system/backendCommandService.js'
import {
  PRIMARY_WORKSPACE_NAME,
  SECONDARY_WORKSPACE_NAME
} from './pathService.js'

const WINDOWS_OS = 'windows'

const removeDirectoryIfExists = async (path) => {
  const existsBeforeRemove = await exists(path)
  console.log('[workspace] remove attempt', { path, existsBeforeRemove })

  if (!existsBeforeRemove) {
    console.log('[workspace] skip remove', { path })
    return
  }

  try {
    await remove(path, { recursive: true })
    const existsAfterRemove = await exists(path)
    console.log('[workspace] remove finished', { path, existsAfterRemove })
  } catch (error) {
    console.error(`[workspace] failed to remove ${path}`, error)
  }
}

export const cleanupBeforeConvert = async () => {
  const osType = await type()
  const homeDirPath = await homeDir()
  console.log('[workspace] cleanupBeforeConvert', { osType })

  const primaryWorkspacePath = await join(homeDirPath, PRIMARY_WORKSPACE_NAME)
  await removeDirectoryIfExists(primaryWorkspacePath)

  if (osType !== WINDOWS_OS) {
    return
  }

  const secondaryWorkspacePath = await join(homeDirPath, SECONDARY_WORKSPACE_NAME)
  await removeDirectoryIfExists(secondaryWorkspacePath)
}

export const cleanupAfterConvert = async () => {
  const osType = await type()
  const homeDirPath = await homeDir()
  console.log('[workspace] cleanupAfterConvert', { osType })

  const primaryWorkspacePath = await join(homeDirPath, PRIMARY_WORKSPACE_NAME)
  await removeDirectoryIfExists(primaryWorkspacePath)

  if (osType === WINDOWS_OS) {
    const secondaryWorkspacePath = await join(homeDirPath, SECONDARY_WORKSPACE_NAME)
    await removeDirectoryIfExists(secondaryWorkspacePath)
  }
}

export const revealOutputDirectory = async () => {
  await invokeBackendCommand('open_file', { path: await desktopDir() }, {
    title: '打开输出目录失败',
    text: '已完成打包，但无法自动打开输出目录，请手动前往桌面查看'
  })
}
