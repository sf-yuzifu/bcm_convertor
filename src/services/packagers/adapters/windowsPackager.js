import { copyFile } from '@tauri-apps/plugin-fs'
import { invoke } from '@tauri-apps/api/core'
import { join } from '@tauri-apps/api/path'

import {
  copyDirectory,
  copyResourceDirectory,
  getBuildPaths,
  getCopyPath
} from '../../../functions/env.js'

export const packageForWindows = async (projectInfo) => {
  const { home, homeDirPath, desktopDirPath, secondaryHomeCopyPath, osType } = await getBuildPaths()

  await copyResourceDirectory(['convert', 'windows'], secondaryHomeCopyPath)
  await copyDirectory(
    home,
    getCopyPath(await join(homeDirPath, 'convert_tmp2', 'bcm_file', 'resources', 'app'), osType)
  )
  await invoke('winrar_packager', {
    home: homeDirPath
  })
  await copyFile(
    await join(homeDirPath, 'convert_tmp2', 'bcm.exe'),
    await join(desktopDirPath, `${projectInfo.name}.exe`)
  )
}
