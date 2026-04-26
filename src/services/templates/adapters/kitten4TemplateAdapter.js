import { readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'

import { copyTemplateToConvertHome, updatePackageJson } from '../templateWorkspaceService.js'

export const prepareKitten4Template = async (projectInfo) => {
  const home = await copyTemplateToConvertHome('kitten4')

  await updatePackageJson(home, (contents) => {
    contents.author = projectInfo.data['author_nickname']
    contents.name = projectInfo.name
  })

  let contents = await readTextFile(await join(home, 'main', 'preload.js'), {
    dir: BaseDirectory.Home
  })
  contents = contents.replace('thisisaplacewhichshouldbereplace', JSON.stringify(projectInfo.data))

  await writeTextFile(await join(home, 'main', 'preload.js'), contents, {
    dir: BaseDirectory.Home
  })
}
