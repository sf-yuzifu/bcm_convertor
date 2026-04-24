import { join } from '@tauri-apps/api/path'

import { copyDirectory, copyResourceDirectory, getBuildPaths } from '../../../functions/env.js'

export const packageForMacOS = async (projectInfo) => {
  const { home, desktopDirPath } = await getBuildPaths()

  await copyDirectory(home, await join(home, 'tmp'))
  await copyResourceDirectory(['convert', 'mac', 'bcm.app'], home)
  await copyDirectory(await join(home, 'tmp'), await join(home, 'bcm.app', 'Contents', 'Resources', 'app'))
  await copyDirectory(await join(home, 'bcm.app'), await join(desktopDirPath, `${projectInfo.name}.app`))
}
