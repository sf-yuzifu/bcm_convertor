import { join } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'
import { readFile } from '@tauri-apps/plugin-fs'
import { fetch } from '@tauri-apps/plugin-http'
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
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  icns: 'image/icns'
}

const getImageMimeTypeByPath = (path) => {
  const match = String(path || '')
    .toLowerCase()
    .match(/\.([a-z0-9]+)$/)
  if (!match) {
    return 'application/octet-stream'
  }

  return IMAGE_MIME_BY_EXTENSION[match[1]] || 'application/octet-stream'
}

const startsWithBytes = (bytes, signature) => signature.every((value, index) => bytes[index] === value)

const decodePreviewText = (bytes) => {
  try {
    return new TextDecoder('utf-8').decode(bytes).trimStart()
  } catch {
    return ''
  }
}

export const detectImageFormat = (fileBytes, path) => {
  const bytes = fileBytes instanceof Uint8Array ? fileBytes : new Uint8Array(fileBytes || [])
  const previewBytes = bytes.slice(0, 512)
  const previewText = decodePreviewText(previewBytes).replace(/^\uFEFF/, '')

  if (bytes.length >= 8 && startsWithBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { mimeType: 'image/png', extension: '.png' }
  }

  if (bytes.length >= 3 && startsWithBytes(bytes, [0xff, 0xd8, 0xff])) {
    return { mimeType: 'image/jpeg', extension: '.jpg' }
  }

  if (
    bytes.length >= 6 &&
    (startsWithBytes(bytes, [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) ||
      startsWithBytes(bytes, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]))
  ) {
    return { mimeType: 'image/gif', extension: '.gif' }
  }

  if (
    bytes.length >= 12 &&
    startsWithBytes(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    startsWithBytes(bytes.slice(8, 12), [0x57, 0x45, 0x42, 0x50])
  ) {
    return { mimeType: 'image/webp', extension: '.webp' }
  }

  if (bytes.length >= 2 && startsWithBytes(bytes, [0x42, 0x4d])) {
    return { mimeType: 'image/bmp', extension: '.bmp' }
  }

  if (bytes.length >= 4 && startsWithBytes(bytes, [0x00, 0x00, 0x01, 0x00])) {
    return { mimeType: 'image/x-icon', extension: '.ico' }
  }

  if (bytes.length >= 4 && startsWithBytes(bytes, [0x69, 0x63, 0x6e, 0x73])) {
    return { mimeType: 'image/icns', extension: '.icns' }
  }

  if (previewText.startsWith('<svg') || previewText.startsWith('<?xml') || previewText.includes('<svg')) {
    return { mimeType: 'image/svg+xml', extension: '.svg' }
  }

  const fallbackMimeType = getImageMimeTypeByPath(path)
  const fallbackExtension =
    Object.entries(IMAGE_MIME_BY_EXTENSION).find(([, mimeType]) => mimeType === fallbackMimeType)?.[0] || ''

  return {
    mimeType: fallbackMimeType,
    extension: fallbackExtension ? `.${fallbackExtension}` : ''
  }
}

const getProjectIconExtensions = (osType) => {
  if (osType === 'windows') {
    return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico']
  }

  if (osType === 'macos') {
    return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'icns']
  }

  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico', 'icns']
}

const OFFLINE_KITTEN3_ICON_PREVIEW_URL = '/kitten3_player_icon.png'

export const revokeObjectUrlIfNeeded = (url) => {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

const isRemoteHttpUrl = (value) => /^https?:\/\//i.test(String(value || '').trim())

const loadImageElementFromBlob = async (blob) => {
  const objectUrl = URL.createObjectURL(blob)
  const image = new Image()

  try {
    image.decoding = 'async'
    image.src = objectUrl

    await new Promise((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('图标图片解码失败'))
    })

    return image
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

const drawSourceToCanvas = (source) => {
  const canvas = document.createElement('canvas')
  const width = Math.max(1, Math.round(source.width || source.naturalWidth || 0))
  const height = Math.max(1, Math.round(source.height || source.naturalHeight || 0))

  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('无法创建图标预览画布')
  }

  context.drawImage(source, 0, 0, width, height)
  return canvas
}

const convertImageBytesToPreviewPng = async (bytes, mimeType) => {
  const sourceBlob = new Blob([bytes], { type: mimeType || 'application/octet-stream' })
  let canvas

  if (mimeType === 'image/svg+xml' || mimeType === 'image/gif') {
    const image = await loadImageElementFromBlob(sourceBlob)
    canvas = drawSourceToCanvas(image)
  } else {
    try {
      const imageBitmap = await createImageBitmap(sourceBlob)
      canvas = drawSourceToCanvas(imageBitmap)
      imageBitmap.close()
    } catch {
      const image = await loadImageElementFromBlob(sourceBlob)
      canvas = drawSourceToCanvas(image)
    }
  }

  const pngBlob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('图标预览转换失败'))
          return
        }
        resolve(blob)
      },
      'image/png',
      1
    )
  })

  return URL.createObjectURL(pngBlob)
}

const resolvePreviewUrlFromBytes = async (bytes, mimeType) => {
  if (mimeType === 'image/gif') {
    return convertImageBytesToPreviewPng(bytes, mimeType)
  }

  return URL.createObjectURL(new Blob([bytes], { type: mimeType || 'application/octet-stream' }))
}

const resolveFetchedIconPreviewUrl = async (iconUrl) => {
  if (!isRemoteHttpUrl(iconUrl)) {
    return ''
  }

  try {
    const response = await fetch(iconUrl, { method: 'GET' })
    if (!response.ok) {
      return ''
    }

    const bytes = new Uint8Array(await response.arrayBuffer())
    const { mimeType } = detectImageFormat(bytes, iconUrl)
    return resolvePreviewUrlFromBytes(bytes, mimeType)
  } catch {
    return ''
  }
}

const resolveOfflineKitten3Icon = async ({ version, status, resourceDirPath }) => {
  if (!(status === 'offline' && version === 'kitten3')) {
    return null
  }

  const iconPath = await join(resourceDirPath, 'convert', 'kitten3', 'player_icon.png')
  return {
    path: iconPath,
    previewUrl: OFFLINE_KITTEN3_ICON_PREVIEW_URL
  }
}

export const loadPackageConfigDefaults = async ({ version, status, workId, sourceFilePath }) => {
  const projectInfo = await loadProjectInfo({ version, status, workId, sourceFilePath })
  if (projectInfo === null) {
    return null
  }

  const { desktopDirPath, resourceDirPath } = await getEnv()
  const offlineKitten3Icon = await resolveOfflineKitten3Icon({ version, status, resourceDirPath })
  const fetchedIcon = resolveProjectPreview(projectInfo)
  const fetchedIconPreview = await resolveFetchedIconPreviewUrl(fetchedIcon)

  return {
    projectInfo,
    packageConfig: {
      projectName: projectInfo.name || '',
      projectIcon: offlineKitten3Icon?.path || '',
      projectIconPreview: offlineKitten3Icon?.previewUrl || '',
      exportPath: desktopDirPath,
      fetchedIcon,
      fetchedIconPreview,
      roundedIconRadius: 22
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
  const { mimeType } = detectImageFormat(fileBytes, selected)

  return {
    path: selected,
    previewUrl: await resolvePreviewUrlFromBytes(fileBytes, mimeType)
  }
}
