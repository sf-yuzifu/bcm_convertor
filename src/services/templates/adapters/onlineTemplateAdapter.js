import { readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'

import { copyTemplateToConvertHome, updatePackageJson } from '../templateWorkspaceService.js'

const DEFAULT_ONLINE_WINDOW_WIDTH = 620
const DEFAULT_ONLINE_WINDOW_HEIGHT = 900
const DEFAULT_KITTENN_WINDOW_WIDTH = 562
const DEFAULT_KITTENN_WINDOW_HEIGHT = 900

const normalizeWindowDimension = (value, fallback) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return fallback
  }

  return Math.max(240, Math.round(numericValue))
}

const resolveProjectWindowSize = (projectData = {}, isKittenN = false) => {
  if (isKittenN) {
    const stageSize = projectData?.stageSize || {}
    return {
      width: stageSize.width ?? projectData?.width,
      height: stageSize.height ?? projectData?.height
    }
  }

  const size = projectData?.size || {}
  return {
    width: size.width ?? projectData?.width,
    height: size.height ?? projectData?.height
  }
}

export const prepareOnlineTemplate = async (projectInfo, version = 'kitten4') => {
  const isKittenN = version === 'kittenN'
  const home = await copyTemplateToConvertHome('online')
  const projectSize = resolveProjectWindowSize(projectInfo?.data, isKittenN)
  const defaultWidth = isKittenN ? DEFAULT_KITTENN_WINDOW_WIDTH : DEFAULT_ONLINE_WINDOW_WIDTH
  const defaultHeight = isKittenN ? DEFAULT_KITTENN_WINDOW_HEIGHT : DEFAULT_ONLINE_WINDOW_HEIGHT
  const windowWidth = normalizeWindowDimension(projectSize.width, defaultWidth)
  const windowHeight = normalizeWindowDimension(projectSize.height, defaultHeight)

  await updatePackageJson(home, (contents) => {
    contents.name = projectInfo.name
    contents.author = isKittenN ? projectInfo.data?.author_nickname || '编程猫' : projectInfo.data['author_nickname']
  })

  let contents = await readTextFile(await join(home, 'index.js'), { dir: BaseDirectory.Home })

  const playerUrl = isKittenN
    ? `https://kn.codemao.cn/player?type=2&workId=${projectInfo.id}`
    : `https://player.codemao.cn/we/${projectInfo.id}`

  contents = contents
    .replace('thisisaplacewhichshouldbereplace', playerUrl)
    .replace('__ONLINE_WINDOW_WIDTH__', String(windowWidth))
    .replace('__ONLINE_WINDOW_HEIGHT__', String(windowHeight))

  await writeTextFile(await join(home, 'index.js'), contents, { dir: BaseDirectory.Home })

  if (isKittenN) {
    let preloadContents = await readTextFile(await join(home, 'preload.js'), { dir: BaseDirectory.Home })
    preloadContents = preloadContents.replace('__PLAYER_URL__', playerUrl).replace('__APP_NAME__', projectInfo.name)
    await writeTextFile(await join(home, 'preload.js'), preloadContents, { dir: BaseDirectory.Home })
  }
}
