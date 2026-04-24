import { readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'

import { copyTemplateToConvertHome, updatePackageJson } from './env.js'

export const online = async (info) => {
  const home = await copyTemplateToConvertHome('online')
  await updatePackageJson(home, (contents) => {
    contents.name = info.name
    contents.author = info.data['author_nickname']
  })

  let contents = await readTextFile(await join(home, 'index.js'), { dir: BaseDirectory.Home })
  contents = contents.replace(
    'thisisaplacewhichshouldbereplace',
    'https://player.codemao.cn/we/' + info.id
  )
  await writeTextFile(await join(home, 'index.js'), contents, { dir: BaseDirectory.Home })
}

export const kitten3 = async (info) => {
  const home = await copyTemplateToConvertHome('kitten3')
  await updatePackageJson(home, (contents) => {
    contents.name = info.name
  })
  await writeTextFile(await join(home, 'resource.bcm'), JSON.stringify(info.data), { dir: BaseDirectory.Home })
}

export const kitten4 = async (info) => {
  const home = await copyTemplateToConvertHome('kitten4')
  await updatePackageJson(home, (contents) => {
    contents.author = info.data['author_nickname']
    contents.name = info.name
  })

  let contents = await readTextFile(await join(home, 'main', 'preload.js'), { dir: BaseDirectory.Home })
  contents = contents.replace('thisisaplacewhichshouldbereplace', JSON.stringify(info.data))
  await writeTextFile(await join(home, 'main', 'preload.js'), contents, { dir: BaseDirectory.Home })
}
