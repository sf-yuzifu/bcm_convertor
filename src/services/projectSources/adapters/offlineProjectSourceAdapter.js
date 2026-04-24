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

  const contents = JSON.parse(await readTextFile(file, { dir: BaseDirectory.AppConfig }))
  return { name: contents['project_name'], data: contents }
}
