import { appLocalDataDir, desktopDir, homeDir, resourceDir } from '@tauri-apps/api/path'
import { type } from '@tauri-apps/plugin-os'
import { join } from '@tauri-apps/api/path'

const TAURI_UNAVAILABLE_ERROR = 'not in tauri'

export const isTauri = () => Boolean(window?.__TAURI__ || window?.__TAURI_INTERNALS__)

let envPromise
export const getEnv = async () => {
  if (!envPromise) {
    envPromise = (async () => {
      if (!isTauri()) {
        throw new Error(TAURI_UNAVAILABLE_ERROR)
      }

      const osType = await type()
      const homeDirPath = await homeDir()
      const resourceDirPath = (await resourceDir()).replace('\\\\?\\\\', '')
      const desktopDirPath = await desktopDir()
      const appLocalDataDirPath = await appLocalDataDir()
      const appLogDirPath = await join(appLocalDataDirPath, 'logs')

      return { osType, homeDirPath, resourceDirPath, desktopDirPath, appLogDirPath }
    })()
  }

  return envPromise
}
