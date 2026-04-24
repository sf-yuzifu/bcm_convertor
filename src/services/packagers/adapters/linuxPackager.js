import { mkdir } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'

import { copyDirectory } from '../../files/fileTransferService.js'
import { invokeBackendCommand } from '../../system/backendCommandService.js'
import { getBuildPaths, copyResourceDirectory } from '../../workspace/pathService.js'

export const packageForLinux = async (projectInfo) => {
  const { home, desktopDirPath } = await getBuildPaths()

  await copyDirectory(home, await join(home, 'tmp'))
  await copyDirectory(await join(home, 'package.json'), await join(home, 'tmp'))
  await copyResourceDirectory(['convert', 'linux'], home)
  await mkdir(await join(home, 'linux', 'AppDir', 'usr', 'bin', 'resources'), {
    recursive: true
  })
  await copyDirectory(await join(home, 'tmp'), await join(home, 'linux', 'AppDir', 'usr', 'bin', 'resources', 'app'))
  await invokeBackendCommand('appimage_packager', { home }, {
    title: 'Linux 打包失败',
    text: 'AppImage 打包命令执行失败，请检查当前运行环境'
  })
  await copyDirectory(await join(home, 'bcm.AppImage'), await join(desktopDirPath, `${projectInfo.name}.Appimage`))
}
