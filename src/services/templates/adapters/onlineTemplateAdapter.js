import { readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'

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

const resolveProjectWindowSize = (projectData = {}) => {
  const size = projectData?.size || {}

  return {
    width: size.width ?? projectData?.width,
    height: size.height ?? projectData?.height
  }
}

export const prepareOnlineTemplate = async (projectInfo) => {
  const home = await copyTemplateToConvertHome('online')
  const projectSize = resolveProjectWindowSize(projectInfo?.data)
  const windowWidth = normalizeWindowDimension(projectSize.width, DEFAULT_WINDOW_WIDTH)
  const windowHeight = normalizeWindowDimension(projectSize.height, DEFAULT_WINDOW_HEIGHT)

  await updatePackageJson(home, (contents) => {
    contents.name = projectInfo.name
    contents.author = projectInfo.data['author_nickname']
  })

  let contents = await readTextFile(await join(home, 'index.js'), { dir: BaseDirectory.Home })
  contents = contents
    .replace('thisisaplacewhichshouldbereplace', `https://player.codemao.cn/we/${projectInfo.id}`)
    .replace('__ONLINE_WINDOW_WIDTH__', String(windowWidth))
    .replace('__ONLINE_WINDOW_HEIGHT__', String(windowHeight))

  await writeTextFile(await join(home, 'index.js'), contents, { dir: BaseDirectory.Home })
}
