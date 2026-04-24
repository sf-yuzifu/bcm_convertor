import { copyFile } from '@tauri-apps/plugin-fs'
import { invoke } from '@tauri-apps/api/core'
import { join } from '@tauri-apps/api/path'

import {
  getBuildPaths,
  getCopyPath,
  copyResourceDirectory,
  SECONDARY_WORKSPACE_NAME
} from '../../workspace/pathService.js'
import { copyDirectory } from '../../files/fileTransferService.js'

export const packageForWindows = async (projectInfo) => {
  const { home, homeDirPath, desktopDirPath, secondaryHomeCopyPath, osType } = await getBuildPaths()

  await copyResourceDirectory(['convert', 'windows'], secondaryHomeCopyPath)
  await copyDirectory(
    home,
    getCopyPath(
      await join(homeDirPath, SECONDARY_WORKSPACE_NAME, 'bcm_file', 'resources', 'app'),
      osType
    )
  )
  await invoke('winrar_packager', {
    home: homeDirPath
  })
  await copyFile(
    await join(homeDirPath, SECONDARY_WORKSPACE_NAME, 'bcm.exe'),
    await join(desktopDirPath, `${projectInfo.name}.exe`)
  )
}
