import { join } from '@tauri-apps/api/path'

import { copyDirectory } from '../files/fileTransferService.js'
import { getEnv } from '../system/runtimeService.js'

export const PRIMARY_WORKSPACE_NAME = 'convert_tmp'

export const getConvertHome = async () => {
  const { homeDirPath } = await getEnv()
  const home = await join(homeDirPath, PRIMARY_WORKSPACE_NAME)

  return {
    home
  }
}

export const copyResourceDirectory = async (resourceParts, targetPath) => {
  const { resourceDirPath } = await getEnv()
  await copyDirectory(await join(resourceDirPath, ...resourceParts), targetPath)
}
