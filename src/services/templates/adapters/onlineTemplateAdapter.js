import { readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'

import { copyTemplateToConvertHome, updatePackageJson } from '../../../functions/env.js'

export const prepareOnlineTemplate = async (projectInfo) => {
  const home = await copyTemplateToConvertHome('online')

  await updatePackageJson(home, (contents) => {
    contents.name = projectInfo.name
    contents.author = projectInfo.data['author_nickname']
  })

  let contents = await readTextFile(await join(home, 'index.js'), { dir: BaseDirectory.Home })
  contents = contents.replace(
    'thisisaplacewhichshouldbereplace',
    `https://player.codemao.cn/we/${projectInfo.id}`
  )

  await writeTextFile(await join(home, 'index.js'), contents, { dir: BaseDirectory.Home })
}
