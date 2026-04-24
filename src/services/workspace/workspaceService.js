import { invoke } from '@tauri-apps/api/core'
import { desktopDir, homeDir, join } from '@tauri-apps/api/path'
import { exists, remove } from '@tauri-apps/plugin-fs'
import { type } from '@tauri-apps/plugin-os'

const WINDOWS_OS = 'windows'
const PRIMARY_WORKSPACE = 'convert_tmp'
const SECONDARY_WORKSPACE = 'convert_tmp2'

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

  const primaryWorkspacePath = await join(homeDirPath, PRIMARY_WORKSPACE)
  await removeDirectoryIfExists(primaryWorkspacePath)

  if (osType !== WINDOWS_OS) {
    return
  }

  const secondaryWorkspacePath = await join(homeDirPath, SECONDARY_WORKSPACE)
  await removeDirectoryIfExists(secondaryWorkspacePath)
}

export const cleanupAfterConvert = async () => {
  const osType = await type()
  const homeDirPath = await homeDir()
  console.log('[workspace] cleanupAfterConvert', { osType })

  const primaryWorkspacePath = await join(homeDirPath, PRIMARY_WORKSPACE)
  await removeDirectoryIfExists(primaryWorkspacePath)

  if (osType === WINDOWS_OS) {
    const secondaryWorkspacePath = await join(homeDirPath, SECONDARY_WORKSPACE)
    await removeDirectoryIfExists(secondaryWorkspacePath)
  }
}

export const revealOutputDirectory = async () => {
  await invoke('open_file', { path: await desktopDir() })
}
