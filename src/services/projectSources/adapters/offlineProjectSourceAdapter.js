import { open } from '@tauri-apps/plugin-dialog'

import { invokeBackendCommand } from '../../system/backendCommandService.js'

export const loadOfflineKitten3ProjectFromFile = async (filePath) =>
  invokeBackendCommand(
    'read_bcm_project',
    { path: filePath },
    {
      code: 'OFFLINE_BCM_READ_FAILED',
      title: '读取 bcm 文件失败',
      text: '无法读取所选 bcm 文件，请确认文件内容完整且格式正确',
      stage: 'load-project',
      retryable: true
    }
  )

export const loadOfflineKitten3Project = async () => {
  const file = await open({
    filters: [
      {
        name: 'bcm文件',
        extensions: ['bcm']
      }
    ]
  })

  if (file === null) {
    return null
  }

  return loadOfflineKitten3ProjectFromFile(file)
}
