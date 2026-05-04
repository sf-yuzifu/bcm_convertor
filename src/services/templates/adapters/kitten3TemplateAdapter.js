import { readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'

import { copyPath } from '../../files/fileTransferService.js'
import { copyTemplateToConvertHome, updatePackageJson } from '../templateWorkspaceService.js'

const DEFAULT_WINDOW_WIDTH = 620
const DEFAULT_WINDOW_HEIGHT = 900

const normalizeWindowDimension = (value, fallback) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return fallback
  }

  return Math.max(240, Math.round(numericValue))
}

export const prepareKitten3Template = async (projectInfo) => {
  const home = await copyTemplateToConvertHome('kitten3')
  const windowWidth = normalizeWindowDimension(projectInfo.width, DEFAULT_WINDOW_WIDTH)
  const windowHeight = normalizeWindowDimension(projectInfo.height, DEFAULT_WINDOW_HEIGHT)

  await updatePackageJson(home, (contents) => {
    contents.name = projectInfo.name
  })

  // 替换index.js中的窗口尺寸占位符
  let indexContents = await readTextFile(await join(home, 'index.js'), {
    dir: BaseDirectory.Home
  })
  indexContents = indexContents
    .replace('__KITTEN3_WINDOW_WIDTH__', String(windowWidth))
    .replace('__KITTEN3_WINDOW_HEIGHT__', String(windowHeight))

  await writeTextFile(await join(home, 'index.js'), indexContents, {
    dir: BaseDirectory.Home
  })

  await copyPath(projectInfo.path, await join(home, 'resource.bcm'))
}
