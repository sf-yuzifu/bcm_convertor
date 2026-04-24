import { mkdir } from '@tauri-apps/plugin-fs'
import { invoke } from '@tauri-apps/api/core'
import { join } from '@tauri-apps/api/path'

import { copyDirectory, copyResourceDirectory, getBuildPaths } from '../../../functions/env.js'

export const packageForLinux = async (projectInfo) => {
  const { home, desktopDirPath } = await getBuildPaths()

  await copyDirectory(home, await join(home, 'tmp'))
  await copyDirectory(await join(home, 'package.json'), await join(home, 'tmp'))
  await copyResourceDirectory(['convert', 'linux'], home)
  await mkdir(await join(home, 'linux', 'AppDir', 'usr', 'bin', 'resources'), {
    recursive: true
  })
  await copyDirectory(await join(home, 'tmp'), await join(home, 'linux', 'AppDir', 'usr', 'bin', 'resources', 'app'))
  await invoke('appimage_packager', { home })
  await copyDirectory(await join(home, 'bcm.AppImage'), await join(desktopDirPath, `${projectInfo.name}.Appimage`))
}
