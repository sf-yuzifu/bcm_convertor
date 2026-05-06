import { basename, join } from '@tauri-apps/api/path'
import { mkdir, readFile, readTextFile, writeFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { fetch } from '@tauri-apps/plugin-http'
import { type } from '@tauri-apps/plugin-os'
import pinyin from 'pinyin'

import { copyPath } from '../files/fileTransferService.js'
import { invokeBackendCommand } from '../system/backendCommandService.js'
import { getEnv } from '../system/runtimeService.js'
import { getConvertHome } from '../workspace/pathService.js'
import { detectImageFormat } from '../packageConfig/packageConfigService.js'
import { convertImageBytesToPng, isRemoteHttpUrl } from './electronBuilderPackager.js'

const ANDROID_CONTEXT_FILE_NAME = '.bcm-android-builder-context.json'

const ANDROID_PLATFORM_CONFIG = {
  code: 'ANDROID_PACKAGE_FAILED',
  title: 'Android 打包失败',
  text: 'APK 打包过程中发生错误，请检查日志',
  stage: 'package'
}

const sanitizeArtifactName = (value) => {
  const sanitized = String(value || '')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    .replace(/[. ]+$/g, '')
    .trim()

  return sanitized.slice(0, 120) || 'bcm-project'
}

const pinyinify = (value) => {
  const str = String(value || '')
  if (!str.trim()) return ''
  const result = pinyin(str, { style: pinyin.STYLE_NORMAL })
  return Array.isArray(result) ? result.flat().join('') : str
}

const generatePackageName = (projectInfo) => {
  const authorName = projectInfo.data?.author_nickname || projectInfo.data?.user_info?.nickname || 'bcm'
  const pinyinAuthor = pinyinify(authorName)
  const safeAuthor =
    String(pinyinAuthor || 'bcm')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .replace(/^-+|-+$/g, '') || 'bcm'

  const pinyinProject = pinyinify(projectInfo.name)
  const safeProject =
    String(pinyinProject || 'work')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .replace(/^-+|-+$/g, '') || 'work'

  return `com.${safeAuthor}.${safeProject}`
}

const generateVersionCode = () => Math.floor(Date.now() / 1000)

const generateVersionName = () => {
  const now = new Date()
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join(
    '-'
  )
}

const normalizeOptionalPath = (value) => {
  const normalized = String(value || '').trim()
  return normalized || undefined
}

const processAndroidIcon = async (projectInfo, workFilesDir) => {
  const iconPath = normalizeOptionalPath(projectInfo.packageConfig?.projectIcon)
  const fetchedIcon = projectInfo.packageConfig?.fetchedIcon

  try {
    if (iconPath) {
      const iconBytes = await readFile(iconPath)
      const detectedFormat = detectImageFormat(iconBytes, iconPath)
      const pngBytes = await convertImageBytesToPng(iconBytes, detectedFormat.mimeType, { squareIcon: true })
      const destPath = await join(workFilesDir, 'android-icon.png')
      await writeFile(destPath, pngBytes)
      return 'android-icon.png'
    }

    if (isRemoteHttpUrl(fetchedIcon)) {
      const response = await fetch(fetchedIcon, { method: 'GET' })
      if (!response.ok) {
        throw new Error(`下载封面图失败: ${response.status}`)
      }
      const bytes = new Uint8Array(await response.arrayBuffer())
      const { mimeType } = detectImageFormat(bytes, fetchedIcon)
      const pngBytes = await convertImageBytesToPng(bytes, mimeType, { squareIcon: true })
      const destPath = await join(workFilesDir, 'android-icon.png')
      await writeFile(destPath, pngBytes)
      return 'android-icon.png'
    }
  } catch (error) {
    console.warn('处理 Android 图标失败，将使用默认图标:', error)
  }

  return undefined
}

const prepareWorkFiles = async (projectInfo, workDir, resourceDir, status, version) => {
  console.log('prepareWorkFiles', projectInfo, workDir, resourceDir, status, version)

  if (status === 'online') {
    // online: create a simple loader with URL injected
    // kittenN uses different player URL
    const isKittenN = version === 'kittenN'
    const workUrl =
      projectInfo.playerUrl ||
      (isKittenN
        ? `https://kn.codemao.cn/player?type=2&workId=${projectInfo.id}`
        : `https://player.codemao.cn/we/${projectInfo.id}`)

    // Read loader template and replace URL
    const loaderSource = await join(
      resourceDir,
      'convert',
      'android',
      'shell',
      'app',
      'src',
      'main',
      'assets',
      'online_loader.html'
    )
    let loaderHtml = await readTextFile(loaderSource)
    loaderHtml = loaderHtml.replace('__ONLINE_WORK_URL__', workUrl)

    // For kittenN, also inject app name (like Electron's preload.js)
    if (isKittenN) {
      loaderHtml = loaderHtml.replace('__APP_NAME__', projectInfo.name || 'KittenN Work')
    }

    // Write modified loader
    const loaderDest = await join(workDir, 'player.html')
    await writeTextFile(loaderDest, loaderHtml)

    return ['player.html']
  } else if (status === 'offline' && version === 'kitten3') {
    // kitten3: copy entire kitten3 player directory
    const kitten3SourceDir = await join(resourceDir, 'convert', 'kitten3')
    const kitten3DestDir = await join(workDir, 'kitten3')

    // Copy kitten3 player files
    await copyPath(kitten3SourceDir, kitten3DestDir)

    // Replace resource.bcm with the actual work
    if (projectInfo.path) {
      const destBcmPath = await join(kitten3DestDir, 'resource.bcm')
      await copyPath(projectInfo.path, destBcmPath)
    }

    // Return the player directory name for assets copying
    return ['kitten3']
  } else if (status === 'offline' && (version === 'kitten4' || version === 'kittenN')) {
    // kitten4: copy entire kitten4 player directory
    const kitten4SourceDir = await join(resourceDir, 'convert', 'kitten4')
    const kitten4DestDir = await join(workDir, 'kitten4')

    // Copy kitten4 player files
    await copyPath(kitten4SourceDir, kitten4DestDir)

    // Save work data as work.json in renderer directory
    if (projectInfo.data) {
      const workJsonPath = await join(kitten4DestDir, 'renderer', 'work.json')
      await writeTextFile(workJsonPath, JSON.stringify(projectInfo.data))
    }

    // Modify index.html to inject work data directly (like Electron preload.js)
    const indexHtmlPath = await join(kitten4DestDir, 'renderer', 'index.html')
    let indexHtml = await readTextFile(indexHtmlPath)

    // Base64 encode the project data (same as Electron)
    const projectDataJson = JSON.stringify(projectInfo.data || {})
    const projectDataBase64 = btoa(unescape(encodeURIComponent(projectDataJson)))

    // Inject script to set window.kitten4_player before any other scripts
    // This mimics Electron's contextBridge.exposeInMainWorld
    const injectScript = `
  <script type="text/javascript">
    // Android preload - inject work data like Electron's preload.js
    (function() {
      'use strict'
      const PROJECT_DATA_BASE64 = '${projectDataBase64}'
      let projectData = ''
      try {
        if (PROJECT_DATA_BASE64) {
          const projectJsonText = decodeURIComponent(escape(atob(PROJECT_DATA_BASE64)))
          projectData = JSON.parse(projectJsonText)
        }
      } catch (e) {
        console.error('Failed to parse project data:', e)
        projectData = {}
      }
      window.kitten4_player = {
        bcmc_json: projectData ? JSON.stringify(projectData) : ''
      }
    })()
  </script>
  `

    // Insert as the first script in <head>
    if (indexHtml.includes('<head>')) {
      indexHtml = indexHtml.replace('<head>', '<head>' + injectScript)
    } else {
      indexHtml = injectScript + indexHtml
    }

    await writeTextFile(indexHtmlPath, indexHtml)

    // Return the player directory name for assets copying
    return ['kitten4']
  }

  return []
}

const createAndroidBuildContext = async (projectInfo, status, version) => {
  const { home: workspaceDir } = await getConvertHome()
  const { desktopDirPath, resourceDirPath } = await getEnv()

  const artifactBaseName = sanitizeArtifactName(projectInfo.name)
  const exportDir = projectInfo.packageConfig?.exportPath?.trim() || desktopDirPath

  const packageName = generatePackageName(projectInfo)
  const appName = projectInfo.name
  const versionCode = generateVersionCode()
  const versionName = generateVersionName()

  // Prepare work files
  const workFilesDir = await join(workspaceDir, 'android-work-files')
  await mkdir(workFilesDir, { recursive: true })
  const iconPath = await processAndroidIcon(projectInfo, workFilesDir)
  const assetEntries = await prepareWorkFiles(projectInfo, workFilesDir, resourceDirPath, status, version)

  return {
    workspace_dir: workspaceDir,
    output_dir: await join(workspaceDir, 'android-dist'),
    export_dir: exportDir,
    product_name: projectInfo.name,
    artifact_base_name: artifactBaseName,
    package_name: packageName,
    app_name: appName,
    version_code: versionCode,
    version_name: versionName,
    author: 'BCM Convertor',
    icon_path: iconPath,
    work_type: status === 'online' ? 'online' : version,
    work_id: String(projectInfo.id || projectInfo.workId || ''),
    asset_entries: assetEntries,
    work_files_dir: workFilesDir
  }
}

export const packageWithAndroid = async (projectInfo, { onProgress, status, version } = {}) => {
  const buildContext = await createAndroidBuildContext(projectInfo, status, version)
  const contextPath = await join(buildContext.workspace_dir, ANDROID_CONTEXT_FILE_NAME)

  await writeTextFile(contextPath, JSON.stringify(buildContext, null, 2))

  const { code, title, text, stage } = ANDROID_PLATFORM_CONFIG

  onProgress?.({ stage: 'decompile', message: '正在反编译壳 APK', percent: 10 })

  const result = await invokeBackendCommand('run_android_packaging', { contextPath }, { code, title, text, stage })

  onProgress?.({ stage: 'postprocess', message: '正在复制 APK 到导出目录', percent: 90 })
  const artifactName = await basename(result.artifactPath)
  const exportedArtifactPath = await join(buildContext.export_dir, artifactName)
  await copyPath(result.artifactPath, exportedArtifactPath)

  onProgress?.({
    stage: 'postprocess',
    message: '正在整理输出文件',
    percent: 96,
    detail: exportedArtifactPath
  })

  return {
    ...result,
    outputDirectory: buildContext.export_dir,
    outputPath: exportedArtifactPath
  }
}
