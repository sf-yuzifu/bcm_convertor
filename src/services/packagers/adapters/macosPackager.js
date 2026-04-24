import { join } from '@tauri-apps/api/path'

import { copyDirectory } from '../../files/fileTransferService.js'
import { getBuildPaths, copyResourceDirectory } from '../../workspace/pathService.js'

export const packageForMacOS = async (projectInfo) => {
  const { home, desktopDirPath } = await getBuildPaths()

  await copyDirectory(home, await join(home, 'tmp'))
  await copyResourceDirectory(['convert', 'mac', 'bcm.app'], home)
  await copyDirectory(await join(home, 'tmp'), await join(home, 'bcm.app', 'Contents', 'Resources', 'app'))
  await copyDirectory(await join(home, 'bcm.app'), await join(desktopDirPath, `${projectInfo.name}.app`))
}
