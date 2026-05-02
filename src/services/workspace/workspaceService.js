import { appCacheDir, appLocalDataDir, desktopDir, homeDir, join } from '@tauri-apps/api/path'
import { exists, mkdir, readDir, remove, writeTextFile } from '@tauri-apps/plugin-fs'

import { normalizeUserFacingError } from '../system/errorHandlingService.js'
import { invokeBackendCommand } from '../system/backendCommandService.js'
import { getEnv } from '../system/runtimeService.js'
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
      code: 'OUTPUT_DIRECTORY_OPEN_FAILED',
      title: '打开输出目录失败',
      text: '已完成打包，但无法自动打开输出目录，请手动前往导出目录查看',
      stage: 'postprocess',
      retryable: true
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

const BUILD_LOG_POLICY = {
  writeOnSuccess: true,
  writeOnFailure: true,
  maxFiles: 40
}

const getBuildLogContext = async () => {
  try {
    const { osType, homeDirPath } = await getEnv()
    return {
      osType,
      workspacePath: await join(homeDirPath, PRIMARY_WORKSPACE_NAME),
      cachePath: await join(await appCacheDir(), 'builder-downloads')
    }
  } catch (_) {
    return {
      osType: undefined,
      workspacePath: undefined,
      cachePath: undefined
    }
  }
}

const MAX_LOG_SUMMARY_LINES = 20

const createLogSection = (title, lines) => `${title}\n${lines.length ? lines.join('\n') : '(空)'}\n`

const collectKeyLogLines = (builderLogs = []) => {
  const candidates = builderLogs.filter((entry) =>
    /error|failed|denied|missing|invalid|timeout|timed out|enoent|eacces|eperm|enospc|builder|download|artifact/i.test(
      String(entry?.line || '')
    )
  )

  return candidates.slice(-MAX_LOG_SUMMARY_LINES).map((entry) => `[${entry.stream || 'stdout'}] ${entry.line}`)
}

const summarizeLogStats = (builderLogs = []) => {
  const stdoutCount = builderLogs.filter((entry) => entry?.stream === 'stdout').length
  const stderrCount = builderLogs.filter((entry) => entry?.stream === 'stderr').length

  return {
    total: builderLogs.length,
    stdoutCount,
    stderrCount
  }
}

const shouldPersistBuildLog = ({ status, builderLogs, error }) => {
  if (status === 'error') {
    return BUILD_LOG_POLICY.writeOnFailure && (Boolean(error) || (builderLogs || []).length > 0)
  }

  if (status === 'success') {
    return BUILD_LOG_POLICY.writeOnSuccess && (builderLogs || []).length > 0
  }

  return Boolean(error) || (builderLogs || []).length > 0
}

const createLogStatusLabel = (status) => (status === 'success' ? 'success' : status === 'error' ? 'error' : 'unknown')

const extractLogStampFromName = (fileName) => {
  const matched = String(fileName || '').match(/-build-(\d{8}-\d{6})(?:-[a-z]+)?\.log$/i)
  return matched?.[1] || ''
}

const sortLogEntries = (entries = []) =>
  [...entries].sort((left, right) => {
    const rightStamp = extractLogStampFromName(right.name)
    const leftStamp = extractLogStampFromName(left.name)
    if (rightStamp && leftStamp && rightStamp !== leftStamp) {
      return rightStamp.localeCompare(leftStamp)
    }

    return String(right.name || '').localeCompare(String(left.name || ''))
  })

const pruneBuildLogs = async (directoryPath) => {
  const entries = await readDir(directoryPath)
  const logFiles = sortLogEntries(entries.filter((entry) => entry.isFile && String(entry.name || '').toLowerCase().endsWith('.log')))

  const staleEntries = logFiles.slice(BUILD_LOG_POLICY.maxFiles)
  await Promise.all(
    staleEntries.map(async (entry) => {
      if (entry.path) {
        await remove(entry.path)
      }
    })
  )
}

const buildLogContent = ({
  projectName,
  status,
  progressText,
  progressPercent,
  outputPath,
  logPath,
  logFilePath,
  cachePath,
  workspacePath,
  osType,
  builderLogs,
  error
}) => {
  const normalizedError = error ? normalizeUserFacingError(error) : null
  const logStats = summarizeLogStats(builderLogs)
  const keyLogLines = collectKeyLogLines(builderLogs)

  const summaryLines = [
    'BCM Convertor Build Log',
    `项目名称: ${projectName || '未命名项目'}`,
    `构建状态: ${status === 'success' ? '成功' : '失败'}`,
    `当前阶段: ${progressText || '未知'}`,
    `当前进度: ${Number.isFinite(progressPercent) ? `${Math.round(progressPercent)}%` : '未知'}`,
    `操作系统: ${osType || '未知'}`,
    `导出目录: ${outputPath || '未设置'}`,
    `工作目录: ${workspacePath || '未知'}`,
    `缓存目录: ${cachePath || '未知'}`,
    `日志目录: ${logPath || '未知'}`,
    `日志文件: ${logFilePath || '未知'}`,
    `日志总行数: ${logStats.total}`,
    `stdout 行数: ${logStats.stdoutCount}`,
    `stderr 行数: ${logStats.stderrCount}`,
    `日志写入策略: 成功${BUILD_LOG_POLICY.writeOnSuccess ? '记录' : '不记录'} / 失败${
      BUILD_LOG_POLICY.writeOnFailure ? '记录' : '不记录'
    } / 最多保留 ${BUILD_LOG_POLICY.maxFiles} 份`,
    `生成时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}`
  ]

  if (normalizedError) {
    summaryLines.push(`错误码: ${normalizedError.code || 'UNKNOWN_ERROR'}`)
    summaryLines.push(`错误阶段: ${normalizedError.stage || 'unknown'}`)
    summaryLines.push(
      `是否可重试: ${normalizedError.retryable === true ? '是' : normalizedError.retryable === false ? '否' : '未知'}`
    )
    summaryLines.push(`错误标题: ${normalizedError.title || '未知'}`)
    summaryLines.push(`错误提示: ${normalizedError.text || '未知'}`)
    if (normalizedError.detail) {
      summaryLines.push(`错误详情: ${normalizedError.detail}`)
    }
  }

  const bodyLines = (builderLogs || []).map((entry) => `[${entry.stream || 'stdout'}] ${entry.line}`)
  const sections = [
    createLogSection('===== 构建摘要 =====', summaryLines),
    createLogSection('===== 关键日志摘要 =====', keyLogLines),
    createLogSection('===== 实时日志 =====', bodyLines)
  ]

  return `${sections.join('\n')}`.trimEnd() + '\n'
}

export const writeBuildLogFile = async ({
  projectName,
  outputPath,
  cachePath,
  workspacePath,
  osType,
  builderLogs,
  progressText,
  progressPercent,
  status,
  error
}) => {
  if (!shouldPersistBuildLog({ status, builderLogs, error })) {
    return null
  }

  const targetPath = await getBuildLogDirectory()
  await mkdir(targetPath, { recursive: true })
  const context = await getBuildLogContext()
  const logFilePath = await join(
    targetPath,
    `${sanitizeFileName(projectName)}-build-${createLogStamp()}-${createLogStatusLabel(status)}.log`
  )
  const logContent = buildLogContent({
    projectName,
    status,
    progressText,
    progressPercent,
    outputPath: outputPath || (await desktopDir()),
    cachePath: cachePath || context.cachePath,
    workspacePath: workspacePath || context.workspacePath,
    osType: osType || context.osType,
    logPath: targetPath,
    logFilePath,
    builderLogs,
    error
  })

  await writeTextFile(logFilePath, logContent)
  await pruneBuildLogs(targetPath)
  return logFilePath
}

export const openBuildLogFile = async (logFilePath) => {
  await invokeBackendCommand(
    'open_file',
    { path: logFilePath },
    {
      code: 'BUILD_LOG_OPEN_FAILED',
      title: '打开打包日志失败',
      text: '打包失败，但无法自动打开日志文件，请手动前往应用日志目录查看',
      stage: 'error',
      retryable: true,
      logPath: logFilePath
    }
  )
}
