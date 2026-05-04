import { readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs'
import { join } from '@tauri-apps/api/path'

import { copyTemplateToConvertHome, updatePackageJson } from '../templateWorkspaceService.js'

const DEFAULT_WINDOW_WIDTH = 620
const DEFAULT_WINDOW_HEIGHT = 900
const PROJECT_DATA_BASE64_PLACEHOLDER = '__KITTEN4_PROJECT_DATA_BASE64__'

const normalizeWindowDimension = (value, fallback) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return fallback
  }

  return Math.max(240, Math.round(numericValue))
}

const encodeBase64Utf8 = (value) => {
  const bytes = new TextEncoder().encode(String(value || ''))
  const chunkSize = 0x8000
  let binary = ''

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, offset + chunkSize)
    binary += String.fromCharCode(...chunk)
  }

  return btoa(binary)
}

export const prepareKitten4Template = async (projectInfo) => {
  const home = await copyTemplateToConvertHome('kitten4')
  const projectSize = projectInfo?.data?.size || {}
  const windowWidth = normalizeWindowDimension(projectSize.width, DEFAULT_WINDOW_WIDTH)
  const windowHeight = normalizeWindowDimension(projectSize.height, DEFAULT_WINDOW_HEIGHT)
  const encodedProjectData = encodeBase64Utf8(JSON.stringify(projectInfo.data))

  await updatePackageJson(home, (contents) => {
    contents.author = projectInfo.data['author_nickname']
    contents.name = projectInfo.name
  })

  let contents = await readTextFile(await join(home, 'main', 'preload.js'), {
    dir: BaseDirectory.Home
  })
  contents = contents.replace(PROJECT_DATA_BASE64_PLACEHOLDER, encodedProjectData)

  await writeTextFile(await join(home, 'main', 'preload.js'), contents, {
    dir: BaseDirectory.Home
  })

  let mainContents = await readTextFile(await join(home, 'main', 'index.js'), {
    dir: BaseDirectory.Home
  })
  mainContents = mainContents
    .replace('__KITTEN4_WINDOW_WIDTH__', String(windowWidth))
    .replace('__KITTEN4_WINDOW_HEIGHT__', String(windowHeight))

  await writeTextFile(await join(home, 'main', 'index.js'), mainContents, {
    dir: BaseDirectory.Home
  })
}
