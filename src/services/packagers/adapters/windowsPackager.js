import { copyFile } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'

import {
  getBuildPaths,
  getCopyPath,
  copyResourceDirectory,
  SECONDARY_WORKSPACE_NAME
} from '../../workspace/pathService.js'
import { copyDirectory } from '../../files/fileTransferService.js'
import { invokeBackendCommand } from '../../system/backendCommandService.js'

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
  await invokeBackendCommand(
    'winrar_packager',
    {
      home: homeDirPath
    },
    {
      title: 'Windows 打包失败',
      text: '请确认 WinRAR 已安装且可正常调用'
    }
  )
  await copyFile(
    await join(homeDirPath, SECONDARY_WORKSPACE_NAME, 'bcm.exe'),
    await join(desktopDirPath, `${projectInfo.name}.exe`)
  )
}
