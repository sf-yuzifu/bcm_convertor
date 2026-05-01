import { appLocalDataDir, desktopDir, homeDir, join } from '@tauri-apps/api/path'
import { exists, mkdir, remove, writeTextFile } from '@tauri-apps/plugin-fs'

import { invokeBackendCommand } from '../system/backendCommandService.js'
import { PRIMARY_WORKSPACE_NAME } from './pathService.js'

const removeDirectoryIfExists = async (path) => {
  const existsBeforeRemove = await exists(path)
  console.log('[workspace] remove attempt', { path, existsBeforeRemove })

  if (!existsBeforeRemove) {
    console.log('[workspace] skip remove', { path })
    return
  }

  try {
    await remove(path, { recursive: true })
    const existsAfterRemove = await exists(path)
    console.log('[workspace] remove finished', { path, existsAfterRemove })
  } catch (error) {
    console.error(`[workspace] failed to remove ${path}`, error)
  }
}

export const cleanupBeforeConvert = async () => {
  const homeDirPath = await homeDir()
  console.log('[workspace] cleanupBeforeConvert')

  const primaryWorkspacePath = await join(homeDirPath, PRIMARY_WORKSPACE_NAME)
  await removeDirectoryIfExists(primaryWorkspacePath)
}

export const cleanupAfterConvert = async () => {
  const homeDirPath = await homeDir()
  console.log('[workspace] cleanupAfterConvert')

  const primaryWorkspacePath = await join(homeDirPath, PRIMARY_WORKSPACE_NAME)
  await removeDirectoryIfExists(primaryWorkspacePath)
}

export const revealOutputDirectory = async (outputPath) => {
  const targetPath = outputPath || (await desktopDir())
  await invokeBackendCommand(
    'open_file',
    { path: targetPath },
    {
      title: '打开输出目录失败',
      text: '已完成打包，但无法自动打开输出目录，请手动前往导出目录查看'
    }
  )
}

const sanitizeFileName = (value) => {
  const sanitized = String(value || '')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    .replace(/[. ]+$/g, '')
    .trim()

  return sanitized || 'bcm-convertor'
}

const padTime = (value) => String(value).padStart(2, '0')

const createLogStamp = (date = new Date()) =>
  `${date.getFullYear()}${padTime(date.getMonth() + 1)}${padTime(date.getDate())}-${padTime(date.getHours())}${padTime(
    date.getMinutes()
  )}${padTime(date.getSeconds())}`

const getBuildLogDirectory = async () => {
  const appDataPath = await appLocalDataDir()
  return join(appDataPath, 'logs')
}

const buildLogContent = ({
  projectName,
  status,
  progressText,
  progressPercent,
  outputPath,
  logPath,
  builderLogs,
  error
}) => {
  const errorMessage =
    typeof error === 'string' ? error : error?.detail || error?.message || (error ? String(error) : '')

  const headerLines = [
    'BCM Convertor Build Log',
    `项目名称: ${projectName || '未命名项目'}`,
    `构建状态: ${status === 'success' ? '成功' : '失败'}`,
    `当前阶段: ${progressText || '未知'}`,
    `当前进度: ${Number.isFinite(progressPercent) ? `${Math.round(progressPercent)}%` : '未知'}`,
    `导出目录: ${outputPath || '未设置'}`,
    `日志目录: ${logPath || '未知'}`,
    `生成时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}`
  ]

  if (errorMessage) {
    headerLines.push(`错误信息: ${errorMessage}`)
  }

  const bodyLines = (builderLogs || []).map((entry) => `[${entry.stream || 'stdout'}] ${entry.line}`)

  return `${headerLines.join('\n')}\n\n===== 实时日志 =====\n${bodyLines.join('\n')}\n`
}

export const writeBuildLogFile = async ({
  projectName,
  outputPath,
  builderLogs,
  progressText,
  progressPercent,
  status,
  error
}) => {
  const targetPath = await getBuildLogDirectory()
  await mkdir(targetPath, { recursive: true })

  const logFilePath = await join(targetPath, `${sanitizeFileName(projectName)}-build-${createLogStamp()}.log`)
  const logContent = buildLogContent({
    projectName,
    status,
    progressText,
    progressPercent,
    outputPath: outputPath || (await desktopDir()),
    logPath: targetPath,
    builderLogs,
    error
  })

  await writeTextFile(logFilePath, logContent)
  return logFilePath
}

export const openBuildLogFile = async (logFilePath) => {
  await invokeBackendCommand(
    'open_file',
    { path: logFilePath },
    {
      title: '打开打包日志失败',
      text: '打包失败，但无法自动打开日志文件，请手动前往应用日志目录查看'
    }
  )
}
