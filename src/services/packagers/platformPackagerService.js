import { type } from '@tauri-apps/plugin-os'

import { linux, macos, windows } from '../../functions/convert.js'

export const packageProject = async (projectInfo) => {
  const osType = await type()

  if (osType === 'Darwin') {
    return macos(projectInfo)
  }

  if (osType === 'Linux') {
    return linux(projectInfo)
  }

  return windows(projectInfo)
}
