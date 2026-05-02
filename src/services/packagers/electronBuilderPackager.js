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
const WINDOWS_DIRECT_ICON_MIME_TYPES = new Set(['image/png', 'image/x-icon'])

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

const extractMimeType = (response) => {
  const contentType = response.headers.get('content-type') || ''
  return contentType.split(';')[0].trim().toLowerCase()
}

const blobToUint8Array = async (blob) => new Uint8Array(await blob.arrayBuffer())

const getFileExtension = (value) => {
  const matched = String(value || '')
    .toLowerCase()
    .match(/(\.[a-z0-9]+)$/)

  return matched?.[1] || ''
}

const convertImageBytesToPng = async (bytes, mimeType) => {
  const sourceBlob = new Blob([bytes], { type: mimeType || 'application/octet-stream' })
  const imageBitmap = await createImageBitmap(sourceBlob)
  const canvas = document.createElement('canvas')

  canvas.width = imageBitmap.width
  canvas.height = imageBitmap.height
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('无法创建图标转换画布')
  }

  context.drawImage(imageBitmap, 0, 0)
  imageBitmap.close()

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

const downloadFetchedIcon = async (workspaceDir, fetchedIcon, osType) => {
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
  const mimeType = extractMimeType(response)
  const pngBytes = await convertImageBytesToPng(bytes, mimeType)
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

const normalizeLocalProjectIconPath = async (workspaceDir, localIconPath, osType) => {
  if (!localIconPath || osType !== WINDOWS) {
    return localIconPath
  }

  const sourceExtension = getFileExtension(localIconPath)
  const iconBytes = await readFile(localIconPath)
  const detectedFormat = detectImageFormat(iconBytes, localIconPath)

  if (WINDOWS_DIRECT_ICON_MIME_TYPES.has(detectedFormat.mimeType) && sourceExtension === detectedFormat.extension) {
    return localIconPath
  }

  if (WINDOWS_DIRECT_ICON_MIME_TYPES.has(detectedFormat.mimeType)) {
    const normalizedExtension =
      detectedFormat.extension || (detectedFormat.mimeType === 'image/x-icon' ? '.ico' : '.png')
    const { assetDir, iconPath } = await getLocalNormalizedIconAssetPath(workspaceDir, normalizedExtension)

    await mkdir(assetDir, { recursive: true })
    await writeFile(iconPath, iconBytes)
    return iconPath
  }

  const pngBytes = await convertImageBytesToPng(iconBytes, detectedFormat.mimeType)
  const { assetDir, iconPath } = await getLocalConvertedIconAssetPath(workspaceDir)

  await mkdir(assetDir, { recursive: true })
  await writeFile(iconPath, pngBytes)
  return iconPath
}

const resolveProjectIconPath = async (projectInfo, workspaceDir, osType) => {
  const localIconPath = normalizeOptionalPath(projectInfo.packageConfig?.projectIcon)
  if (localIconPath) {
    return normalizeLocalProjectIconPath(workspaceDir, localIconPath, osType)
  }

  return downloadFetchedIcon(workspaceDir, projectInfo.packageConfig?.fetchedIcon, osType)
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
    outputDirectory: buildContext.exportDir
  }
}
