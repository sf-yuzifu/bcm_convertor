import { invoke } from '@tauri-apps/api/core'
import { desktopDir, homeDir, join } from '@tauri-apps/api/path'
import { remove } from '@tauri-apps/plugin-fs'
import { type } from '@tauri-apps/plugin-os'

const WINDOWS_OS = 'Windows_NT'
const PRIMARY_WORKSPACE = 'convert_tmp'
const SECONDARY_WORKSPACE = 'convert_tmp2'

const removeDirectoryIfExists = async (path) => {
  try {
    await remove(path, { recursive: true })
  } catch (_) {}
}

export const cleanupBeforeConvert = async () => {
  const osType = await type()

  if (osType !== WINDOWS_OS) {
    return
  }

  const homeDirPath = await homeDir()
  await removeDirectoryIfExists(await join(homeDirPath, SECONDARY_WORKSPACE))
}

export const cleanupAfterConvert = async () => {
  const osType = await type()
  const homeDirPath = await homeDir()

  await removeDirectoryIfExists(await join(homeDirPath, PRIMARY_WORKSPACE))

  if (osType === WINDOWS_OS) {
    await removeDirectoryIfExists(await join(homeDirPath, SECONDARY_WORKSPACE))
  }
}

export const revealOutputDirectory = async () => {
  await invoke('open_file', { path: await desktopDir() })
}
