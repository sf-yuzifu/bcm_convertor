import { type } from '@tauri-apps/plugin-os'

import { packageForLinux } from './adapters/linuxPackager.js'
import { packageForMacOS } from './adapters/macosPackager.js'
import { packageForWindows } from './adapters/windowsPackager.js'

const MACOS = 'macos'
const LINUX = 'linux'

export const packageProject = async (projectInfo) => {
  const osType = await type()

  if (osType === MACOS) {
    return packageForMacOS(projectInfo)
  }

  if (osType === LINUX) {
    return packageForLinux(projectInfo)
  }

  return packageForWindows(projectInfo)
}
