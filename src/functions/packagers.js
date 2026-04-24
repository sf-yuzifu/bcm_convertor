import { mkdir, copyFile } from '@tauri-apps/plugin-fs'
import { invoke } from '@tauri-apps/api/core'
import { join } from '@tauri-apps/api/path'

import { copyDirectory } from '../services/files/fileTransferService.js'
import { copyResourceDirectory, getBuildPaths, getCopyPath } from '../services/workspace/pathService.js'

export const macos = async (info) => {
  const { home, desktopDirPath } = await getBuildPaths()
  await copyDirectory(home, await join(home, 'tmp'))
  await copyResourceDirectory(['convert', 'mac', 'bcm.app'], home)
  await copyDirectory(await join(home, 'tmp'), await join(home, 'bcm.app', 'Contents', 'Resources', 'app'))
  await copyDirectory(await join(home, 'bcm.app'), await join(desktopDirPath, info.name + '.app'))
}

export const linux = async (info) => {
  const { home, desktopDirPath } = await getBuildPaths()
  await copyDirectory(home, await join(home, 'tmp'))
  await copyDirectory(await join(home, 'package.json'), await join(home, 'tmp'))
  await copyResourceDirectory(['convert', 'linux'], home)
  await mkdir(await join(home, 'linux', 'AppDir', 'usr', 'bin', 'resources'), {
    recursive: true
  })
  await copyDirectory(await join(home, 'tmp'), await join(home, 'linux', 'AppDir', 'usr', 'bin', 'resources', 'app'))
  await invoke('appimage_packager', { home })
  await copyDirectory(await join(home, 'bcm.AppImage'), await join(desktopDirPath, info.name + '.Appimage'))
}

export const windows = async (info) => {
  const { home, homeDirPath, desktopDirPath, secondaryHomeCopyPath, osType } = await getBuildPaths()
  await copyResourceDirectory(['convert', 'windows'], secondaryHomeCopyPath)
  await copyDirectory(home, getCopyPath(await join(homeDirPath, 'convert_tmp2', 'bcm_file', 'resources', 'app'), osType))
  await invoke('winrar_packager', {
    home: homeDirPath
  })
  await copyFile(
    await join(homeDirPath, 'convert_tmp2', 'bcm.exe'),
    await join(desktopDirPath, info.name + '.exe')
  )
}
