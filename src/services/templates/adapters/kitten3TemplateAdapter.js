import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'

import { copyTemplateToConvertHome, updatePackageJson } from '../templateWorkspaceService.js'

export const prepareKitten3Template = async (projectInfo) => {
  const home = await copyTemplateToConvertHome('kitten3')

  await updatePackageJson(home, (contents) => {
    contents.name = projectInfo.name
  })

  await writeTextFile(await join(home, 'resource.bcm'), JSON.stringify(projectInfo.data), {
    dir: BaseDirectory.Home
  })
}
