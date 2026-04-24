import { join } from '@tauri-apps/api/path'

import { copyDirectory } from '../files/fileTransferService.js'
import { getEnv } from '../system/runtimeService.js'

const WINDOWS_OS = 'windows'

export const getCopyPath = (path, osType) => (osType === WINDOWS_OS ? `${path}\\` : path)

export const getConvertHome = async () => {
  const { osType, homeDirPath } = await getEnv()
  const baseHome = await join(homeDirPath, 'convert_tmp')

  return {
    osType,
    home: getCopyPath(baseHome, osType),
    baseHome
  }
}

export const getBuildPaths = async () => {
  const env = await getEnv()
  const home = await join(env.homeDirPath, 'convert_tmp')
  const secondaryHome = await join(env.homeDirPath, 'convert_tmp2')

  return {
    ...env,
    home,
    secondaryHomeCopyPath: getCopyPath(secondaryHome, env.osType)
  }
}

export const copyResourceDirectory = async (resourceParts, targetPath) => {
  const { resourceDirPath } = await getEnv()
  await copyDirectory(await join(resourceDirPath, ...resourceParts), targetPath)
}
