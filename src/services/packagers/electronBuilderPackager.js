import { basename, join } from '@tauri-apps/api/path'
import { mkdir, readFile, writeFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { fetch } from '@tauri-apps/plugin-http'
import { type } from '@tauri-apps/plugin-os'

import { copyPath } from '../files/fileTransferService.js'
import { detectImageFormat } from '../packageConfig/packageConfigService.js'
import { invokeBackendCommand } from '../system/backendCommandService.js'
import { getEnv } from '../system/runtimeService.js'
import { getConvertHome } from '../workspace/pathService.js'

const WINDOWS = 'windows'
const LINUX = 'linux'
const MACOS = 'macos'
const CONTEXT_FILE_NAME = '.bcm-builder-context.json'

const PLATFORM_CONFIG = {
  [WINDOWS]: {
    target: 'portable',
    code: 'WINDOWS_PACKAGE_FAILED',
    title: 'Windows 打包失败',
    text: '内置 electron-builder 执行失败，请检查内置工具链是否完整',
    stage: 'package'
  },
  [LINUX]: {
    target: 'AppImage',
    code: 'LINUX_PACKAGE_FAILED',
    title: 'Linux 打包失败',
    text: '内置 electron-builder 执行失败，请检查 AppImage 工具链是否完整',
    stage: 'package'
  },
  [MACOS]: {
    target: 'dir',
    code: 'MACOS_PACKAGE_FAILED',
    title: 'macOS 打包失败',
    text: '内置 electron-builder 执行失败，请检查内置工具链是否完整',
    stage: 'package'
  }
}

const sanitizeArtifactName = (value) => {
  const sanitized = String(value || '')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    .replace(/[. ]+$/g, '')
    .trim()

  return sanitized.slice(0, 120) || 'bcm-project'
}

const sanitizePackageName = (value) => {
  const normalized = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'bcm-project'
}

const normalizeOptionalPath = (value) => {
  const normalized = String(value || '').trim()
  return normalized || undefined
}

const isRemoteHttpUrl = (value) => /^https?:\/\//i.test(String(value || '').trim())

const blobToUint8Array = async (blob) => new Uint8Array(await blob.arrayBuffer())

const getFileExtension = (value) => {
  const matched = String(value || '')
    .toLowerCase()
    .match(/(\.[a-z0-9]+)$/)

  return matched?.[1] || ''
}

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
    throw new Error('无法创建图标转换画布')
  }

  context.drawImage(source, 0, 0, width, height)
  return canvas
}

const normalizeCanvasToSquare = (canvas) => {
  const width = canvas.width
  const height = canvas.height
  if (width === height) {
    return canvas
  }

  const size = Math.max(width, height)
  const squareCanvas = document.createElement('canvas')
  squareCanvas.width = size
  squareCanvas.height = size
  const context = squareCanvas.getContext('2d')
  if (!context) {
    throw new Error('无法创建图标转换画布')
  }

  const offsetX = Math.round((size - width) / 2)
  const offsetY = Math.round((size - height) / 2)
  context.drawImage(canvas, offsetX, offsetY)
  return squareCanvas
}

const applyRoundedRectMask = (context, width, height, radius) => {
  const safeRadius = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.moveTo(safeRadius, 0)
  context.lineTo(width - safeRadius, 0)
  context.arcTo(width, 0, width, safeRadius, safeRadius)
  context.lineTo(width, height - safeRadius)
  context.arcTo(width, height, width - safeRadius, height, safeRadius)
  context.lineTo(safeRadius, height)
  context.arcTo(0, height, 0, height - safeRadius, safeRadius)
  context.lineTo(0, safeRadius)
  context.arcTo(0, 0, safeRadius, 0, safeRadius)
  context.closePath()
}

const applyRoundedMask = (canvas, radiusPercent = 0) => {
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('无法创建图标转换画布')
  }

  const width = canvas.width
  const height = canvas.height
  const radiusRatio = Math.min(0.5, Math.max(0, Number(radiusPercent || 0) / 100))
  const radius = Math.max(1, Math.round(Math.min(width, height) * radiusRatio))
  const snapshot = document.createElement('canvas')
  snapshot.width = width
  snapshot.height = height
  const snapshotContext = snapshot.getContext('2d')
  if (!snapshotContext) {
    throw new Error('无法创建图标转换画布')
  }

  snapshotContext.drawImage(canvas, 0, 0)
  context.clearRect(0, 0, width, height)
  context.save()
  applyRoundedRectMask(context, width, height, radius)
  context.clip()
  context.drawImage(snapshot, 0, 0)
  context.restore()
  return canvas
}

const convertImageBytesToPng = async (bytes, mimeType, options = {}) => {
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
    } catch (error) {
      const image = await loadImageElementFromBlob(sourceBlob)
      canvas = drawSourceToCanvas(image)
    }
  }

  if (options.squareIcon) {
    canvas = normalizeCanvasToSquare(canvas)
  }

  if (options.roundedIcon) {
    canvas = applyRoundedMask(canvas, options.roundedIconRadius)
  }

  const pngBlob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('远程图标转换 PNG 失败'))
          return
        }
        resolve(blob)
      },
      'image/png',
      1
    )
  })

  return blobToUint8Array(pngBlob)
}

const getRemoteIconAssetPath = async (workspaceDir, osType) => {
  const assetDir = await join(workspaceDir, '.builder-assets')
  const fileName = osType === MACOS ? 'remote-project-icon.icns' : 'remote-project-icon.png'
  return {
    assetDir,
    iconPath: await join(assetDir, fileName)
  }
}

const downloadFetchedIcon = async (workspaceDir, fetchedIcon, osType, options = {}) => {
  if (!isRemoteHttpUrl(fetchedIcon)) {
    return undefined
  }

  if (osType === MACOS) {
    return undefined
  }

  const response = await fetch(fetchedIcon, { method: 'GET' })
  if (!response.ok) {
    throw new Error(`下载远程封面图失败: ${response.status} ${response.statusText}`)
  }

  const bytes = new Uint8Array(await response.arrayBuffer())
  const { mimeType } = detectImageFormat(bytes, fetchedIcon)
  const pngBytes = await convertImageBytesToPng(bytes, mimeType, options)
  const { assetDir, iconPath } = await getRemoteIconAssetPath(workspaceDir, osType)

  await mkdir(assetDir, { recursive: true })
  await writeFile(iconPath, pngBytes)

  return iconPath
}

const getLocalConvertedIconAssetPath = async (workspaceDir) => {
  const assetDir = await join(workspaceDir, '.builder-assets')
  return {
    assetDir,
    iconPath: await join(assetDir, 'local-project-icon.png')
  }
}

const getLocalNormalizedIconAssetPath = async (workspaceDir, extension) => {
  const assetDir = await join(workspaceDir, '.builder-assets')
  return {
    assetDir,
    iconPath: await join(assetDir, `local-project-icon${extension}`)
  }
}

const normalizeLocalProjectIconPath = async (workspaceDir, localIconPath, osType, options = {}) => {
  if (!localIconPath || osType !== WINDOWS) {
    return localIconPath
  }

  const sourceExtension = getFileExtension(localIconPath)
  const iconBytes = await readFile(localIconPath)
  const detectedFormat = detectImageFormat(iconBytes, localIconPath)

  if (
    !options.roundedIcon &&
    detectedFormat.mimeType === 'image/x-icon' &&
    sourceExtension === detectedFormat.extension
  ) {
    return localIconPath
  }

  if (!options.roundedIcon && detectedFormat.mimeType === 'image/x-icon') {
    const normalizedExtension =
      detectedFormat.extension || (detectedFormat.mimeType === 'image/x-icon' ? '.ico' : '.png')
    const { assetDir, iconPath } = await getLocalNormalizedIconAssetPath(workspaceDir, normalizedExtension)

    await mkdir(assetDir, { recursive: true })
    await writeFile(iconPath, iconBytes)
    return iconPath
  }

  const pngBytes = await convertImageBytesToPng(iconBytes, detectedFormat.mimeType, options)
  const { assetDir, iconPath } = await getLocalConvertedIconAssetPath(workspaceDir)

  await mkdir(assetDir, { recursive: true })
  await writeFile(iconPath, pngBytes)
  return iconPath
}

const resolveProjectIconPath = async (projectInfo, workspaceDir, osType) => {
  const roundedIconRadius = Number(projectInfo.packageConfig?.roundedIconRadius || 22)
  const squareIcon = osType === WINDOWS
  const roundedIcon = osType === WINDOWS && Number.isFinite(roundedIconRadius) && roundedIconRadius > 0
  const localIconPath = normalizeOptionalPath(projectInfo.packageConfig?.projectIcon)
  if (localIconPath) {
    return normalizeLocalProjectIconPath(workspaceDir, localIconPath, osType, {
      squareIcon,
      roundedIcon,
      roundedIconRadius
    })
  }

  return downloadFetchedIcon(workspaceDir, projectInfo.packageConfig?.fetchedIcon, osType, {
    squareIcon,
    roundedIcon,
    roundedIconRadius
  })
}

const createBuildContext = async (projectInfo, osType) => {
  const { home: workspaceDir } = await getConvertHome()
  const { desktopDirPath } = await getEnv()
  const platformConfig = PLATFORM_CONFIG[osType] || PLATFORM_CONFIG[WINDOWS]
  const artifactBaseName = sanitizeArtifactName(projectInfo.name)
  const exportDir = projectInfo.packageConfig?.exportPath?.trim() || desktopDirPath
  const iconPath = await resolveProjectIconPath(projectInfo, workspaceDir, osType)

  return {
    workspaceDir,
    outputDir: await join(workspaceDir, 'dist'),
    exportDir,
    target: platformConfig.target,
    platform: osType,
    productName: projectInfo.name,
    artifactBaseName,
    safePackageName: sanitizePackageName(projectInfo.name),
    version: '1.0.0',
    iconPath
  }
}

export const packageWithElectronBuilder = async (projectInfo, { onProgress } = {}) => {
  const osType = await type()
  const buildContext = await createBuildContext(projectInfo, osType)
  const contextPath = await join(buildContext.workspaceDir, CONTEXT_FILE_NAME)

  await writeTextFile(contextPath, JSON.stringify(buildContext, null, 2))

  const { code, title, text, stage } = PLATFORM_CONFIG[osType] || PLATFORM_CONFIG[WINDOWS]
  const result = await invokeBackendCommand('run_electron_builder', { contextPath }, { code, title, text, stage })

  onProgress?.({ stage: 'postprocess', message: '正在复制安装包到导出目录', percent: 90 })
  const artifactName = await basename(result.artifactPath)
  const exportedArtifactPath = await join(buildContext.exportDir, artifactName)
  await copyPath(result.artifactPath, exportedArtifactPath)
  onProgress?.({
    stage: 'postprocess',
    message: '正在整理输出文件',
    percent: 96,
    detail: exportedArtifactPath
  })

  return {
    ...result,
    outputDirectory: buildContext.exportDir,
    outputPath: exportedArtifactPath
  }
}
