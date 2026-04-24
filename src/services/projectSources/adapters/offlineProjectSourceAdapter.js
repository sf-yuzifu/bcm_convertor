import { open } from '@tauri-apps/plugin-dialog'
import { readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs'

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

  const projectData = JSON.parse(await readTextFile(file, { dir: BaseDirectory.AppConfig }))
  return { name: projectData['project_name'], data: projectData }
}
