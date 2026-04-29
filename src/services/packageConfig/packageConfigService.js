import { open } from '@tauri-apps/plugin-dialog'
import { readFile } from '@tauri-apps/plugin-fs'
import { type } from '@tauri-apps/plugin-os'

import { loadProjectInfo } from '../projectSources/projectSourceService.js'
import { getEnv } from '../system/runtimeService.js'

const PROJECT_PREVIEW_KEYS = ['preview', 'preview_url', 'cover_url', 'cover', 'thumbnail', 'work_pic']

const pickFirstString = (source, keys) => {
  for (const key of keys) {
    const value = source?.[key]
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }

  return ''
}

export const resolveProjectPreview = (projectInfo) =>
  pickFirstString(projectInfo, PROJECT_PREVIEW_KEYS) || pickFirstString(projectInfo?.data, PROJECT_PREVIEW_KEYS)

const IMAGE_MIME_BY_EXTENSION = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  ico: 'image/x-icon',
  icns: 'image/icns'
}

const getImageMimeType = (path) => {
  const match = String(path || '')
    .toLowerCase()
    .match(/\.([a-z0-9]+)$/)
  if (!match) {
    return 'application/octet-stream'
  }

  return IMAGE_MIME_BY_EXTENSION[match[1]] || 'application/octet-stream'
}

const getProjectIconExtensions = (osType) => {
  if (osType === 'windows') {
    return ['png', 'ico']
  }

  if (osType === 'macos') {
    return ['icns']
  }

  return ['png', 'jpg', 'jpeg', 'webp', 'svg', 'ico', 'icns']
}

export const revokeObjectUrlIfNeeded = (url) => {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

export const loadPackageConfigDefaults = async ({ version, status, workId }) => {
  const projectInfo = await loadProjectInfo({ version, status, workId })
  if (projectInfo === null) {
    return null
  }

  const { desktopDirPath } = await getEnv()
  return {
    projectInfo,
    packageConfig: {
      projectName: projectInfo.name || '',
      projectIcon: '',
      projectIconPreview: '',
      exportPath: desktopDirPath,
      fetchedIcon: resolveProjectPreview(projectInfo)
    }
  }
}

export const chooseProjectIconFile = async () => {
  const osType = await type()
  const selected = await open({
    multiple: false,
    filters: [
      {
        name: '图片文件',
        extensions: getProjectIconExtensions(osType)
      }
    ]
  })

  if (typeof selected !== 'string' || !selected) {
    return null
  }

  const fileBytes = await readFile(selected)
  const blob = new Blob([fileBytes], { type: getImageMimeType(selected) })

  return {
    path: selected,
    previewUrl: URL.createObjectURL(blob)
  }
}
