import { showAlert } from './dialogService.js'

const DEFAULT_ERROR_CODE = 'UNKNOWN_ERROR'
const DEFAULT_ERROR_STAGE = 'unknown'

const NETWORK_ERROR_PATTERNS = [
  'failed to send request',
  'dns error',
  'timed out',
  'connection refused',
  'connection reset',
  'network',
  'socket'
]

const GENERIC_ERROR_TEXT_PATTERNS = [
  '内置 electron-builder 执行失败，请检查内置工具链是否完整',
  '内置 electron-builder 执行失败，请检查 AppImage 工具链是否完整',
  '打包过程中发生异常，请稍后重试'
]

const ERROR_CODE_DEFINITIONS = {
  ICON_FILE_MISSING: { title: '图标文件缺失', text: '找不到自定义图标文件，请重新选择作品图标后再试', stage: 'prepare' },
  NODE_RUNTIME_MISSING: { title: 'Node 运行时缺失', text: '找不到内置 Node.js 运行时，请确认打包运行时已完整发布', stage: 'build' },
  BUILDER_SCRIPT_MISSING: { title: 'Builder 脚本缺失', text: '找不到内置 builder 脚本，请确认应用资源已完整发布', stage: 'build' },
  BUILDER_TOOLCHAIN_MISSING: { title: 'Builder 工具链缺失', text: '找不到 electron-builder 工具链，请确认内置 builder 资源是否完整', stage: 'build' },
  ELECTRON_VERSION_MISSING: { title: 'Electron 版本缺失', text: '未找到 Electron 版本配置，请检查 builder 工具链依赖', stage: 'build' },
  ICON_EXTENSION_INVALID: { title: '图标格式不支持', text: '所选图标格式不支持，请按当前系统要求重新选择图标后再试', stage: 'prepare', retryable: true },
  REMOTE_ICON_DOWNLOAD_FAILED: { title: '远程封面下载失败', text: '远程封面图下载失败，请检查网络或更换封面后重试', stage: 'prepare', retryable: true },
  REMOTE_ICON_CONVERT_FAILED: { title: '远程图标转换失败', text: '远程封面图无法转换为可用图标，请更换图片后重试', stage: 'prepare', retryable: true },
  ICON_FILE_INVALID: { title: '图标文件无效', text: '所选 PNG 图标文件无效或已损坏，请重新选择一张真正的 PNG 图片后再试', stage: 'prepare', retryable: true },
  OUTPUT_PERMISSION_DENIED: { title: '输出目录不可写', text: '没有权限写入导出目录，请更换目录或以更高权限运行', stage: 'postprocess', retryable: true },
  WINDOWS_ELEVATION_CANCELLED: { title: '已取消管理员授权', text: '已取消管理员授权，无法继续完成 Windows 可执行文件处理', stage: 'package', retryable: true },
  DISK_SPACE_EXHAUSTED: { title: '磁盘空间不足', text: '磁盘空间不足，请清理磁盘后重试', stage: 'download', retryable: true },
  BUILDER_CACHE_UNAVAILABLE: { title: '缓存目录不可用', text: '打包缓存目录不可用，请检查缓存目录权限或清理后重试', stage: 'download', retryable: true },
  BUILDER_COMMAND_FAILED: { title: '打包命令执行失败', text: '打包命令执行失败，请查看日志后重试', stage: 'package' },
  RUNTIME_TAURI_REQUIRED: { title: '当前环境不支持', text: '请在桌面应用中使用转换功能', stage: 'runtime', retryable: false },
  WORK_NOT_FOUND: { title: '找不到作品', text: '请检查作品id是否正确', stage: 'load-project', retryable: true },
  WORK_SOURCE_URL_MISSING: { title: '找不到作品', text: '请确保作品有发布过一次', stage: 'load-project', retryable: true },
  NETWORK_UNAVAILABLE: { title: '离线', text: '请检查网络是否连接', stage: 'network', retryable: true },
  OFFLINE_BCM_READ_FAILED: { title: '读取 bcm 文件失败', text: '无法读取所选 bcm 文件，请确认文件内容完整且格式正确', stage: 'load-project', retryable: true },
  EXPORT_COPY_FAILED: { title: '文件复制失败', text: '导出到桌面失败，请检查桌面目录权限、同名文件占用，或重试后再导出', stage: 'postprocess', retryable: true },
  OUTPUT_DIRECTORY_OPEN_FAILED: { title: '打开输出目录失败', text: '已完成打包，但无法自动打开输出目录，请手动前往导出目录查看', stage: 'postprocess', retryable: true },
  ABOUT_OUTPUT_DIRECTORY_OPEN_FAILED: { title: '打开输出目录失败', text: '无法自动打开输出目录，请手动前往桌面查看', stage: 'postprocess', retryable: true },
  BUILD_LOG_OPEN_FAILED: { title: '打开打包日志失败', text: '打包失败，但无法自动打开日志文件，请手动前往应用日志目录查看', stage: 'error', retryable: true },
  WINDOWS_PACKAGE_FAILED: { title: 'Windows 打包失败', text: '内置 electron-builder 执行失败，请检查内置工具链是否完整', stage: 'package' },
  LINUX_PACKAGE_FAILED: { title: 'Linux 打包失败', text: '内置 electron-builder 执行失败，请检查 AppImage 工具链是否完整', stage: 'package' },
  MACOS_PACKAGE_FAILED: { title: 'macOS 打包失败', text: '内置 electron-builder 执行失败，请检查内置工具链是否完整', stage: 'package' },
  CONVERT_WORKFLOW_FAILED: { title: '转换失败', text: '转换过程中发生异常，请查看日志后重试', stage: 'error' },
  BACKEND_ERROR: { title: '转换失败', text: '后端处理失败，请查看日志后重试', stage: 'unknown' },
  CONVERT_FAILED: { title: '转换失败', text: '转换过程中发生异常，请稍后重试', stage: 'unknown' }
}

const MESSAGE_ERROR_RULES = [
  { code: 'ICON_FILE_MISSING', match: (message) => message.includes('找不到自定义图标文件') },
  { code: 'NODE_RUNTIME_MISSING', match: (message) => message.includes('找不到内置 Node.js 运行时') },
  { code: 'BUILDER_SCRIPT_MISSING', match: (message) => message.includes('找不到内置 builder 脚本') },
  { code: 'BUILDER_TOOLCHAIN_MISSING', match: (message) => message.includes('找不到可用的 electron-builder 工具链目录') },
  { code: 'ELECTRON_VERSION_MISSING', match: (message) => message.includes('找不到 electron 版本声明') },
  {
    code: 'ICON_EXTENSION_INVALID',
    match: (message) =>
      message.includes('仅支持使用 .ico 或 .png') ||
      message.includes('仅支持使用 .icns') ||
      message.includes('仅支持 png/jpg/jpeg/webp/svg/ico/icns'),
    text: (message) => extractReadableMessage(message)
  },
  {
    code: 'REMOTE_ICON_DOWNLOAD_FAILED',
    match: (message) => message.includes('下载远程封面图失败'),
    text: (message) => extractReadableMessage(message)
  },
  { code: 'REMOTE_ICON_CONVERT_FAILED', match: (message) => message.includes('远程图标转换 PNG 失败') || message.includes('无法创建图标转换画布') },
  {
    code: 'ICON_FILE_INVALID',
    match: (message) =>
      /is not .*valid png file/i.test(message) ||
      /is not a valid png file/i.test(message) ||
      /png-to-ico/i.test(message)
  },
  {
    code: 'OUTPUT_PERMISSION_DENIED',
    match: (message) =>
      message.toLowerCase().includes('permission denied') ||
      message.toLowerCase().includes('access is denied') ||
      message.toLowerCase().includes('eprem') ||
      message.toLowerCase().includes('eacces')
  },
  {
    code: 'WINDOWS_ELEVATION_CANCELLED',
    match: (message) =>
      message.includes('管理员授权已取消') ||
      message.toLowerCase().includes('elevation was canceled by the user') ||
      message.toLowerCase().includes('operation was canceled by the user')
  },
  {
    code: 'DISK_SPACE_EXHAUSTED',
    match: (message) =>
      message.toLowerCase().includes('no space left on device') || message.toLowerCase().includes('enospc')
  },
  {
    code: 'BUILDER_CACHE_UNAVAILABLE',
    match: (message) => message.toLowerCase().includes('builder-downloads'),
    text: (message) => extractReadableMessage(message)
  },
  {
    code: 'BUILDER_COMMAND_FAILED',
    match: (message) =>
      message.toLowerCase().includes('electron-builder') ||
      message.toLowerCase().includes('rcedit') ||
      message.toLowerCase().includes('makensis') ||
      message.toLowerCase().includes('wincodesign'),
    text: (message) => extractReadableMessage(message)
  }
]

const extractErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error
  }

  if (error?.message) {
    return error.message
  }

  return String(error || '')
}

const normalizeErrorCode = (value) => {
  const code = String(value || '')
    .trim()
    .replace(/[^A-Za-z0-9_:-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()

  return code || DEFAULT_ERROR_CODE
}

const normalizeErrorStage = (value) => {
  const stage = String(value || '').trim()
  return stage || DEFAULT_ERROR_STAGE
}

const normalizeOptionalText = (value) => {
  const text = String(value || '').trim()
  return text || undefined
}

const normalizeOptionalBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value
  }

  return undefined
}

const getErrorDefinition = (code) => ERROR_CODE_DEFINITIONS[normalizeErrorCode(code)] || null

const resolveErrorRule = (message) => MESSAGE_ERROR_RULES.find((rule) => rule.match(message)) || null

const resolveErrorDefinitionText = (definition, message) => {
  if (!definition) {
    return undefined
  }

  if (typeof definition.text === 'function') {
    return definition.text(message)
  }

  return definition.text
}

const isNetworkError = (message) => {
  const normalizedMessage = message.toLowerCase()
  return NETWORK_ERROR_PATTERNS.some((pattern) => normalizedMessage.includes(pattern))
}

const extractBackendErrorMessage = (message) => {
  const bodyMarker = 'body='
  const bodyStartIndex = message.indexOf(bodyMarker)

  if (bodyStartIndex === -1) {
    return null
  }

  try {
    const body = JSON.parse(message.slice(bodyStartIndex + bodyMarker.length))
    return body?.error_message || null
  } catch (_) {
    return null
  }
}

const extractEmbeddedJsonPayload = (message) => {
  const bodyMarker = 'body='
  const bodyStartIndex = String(message || '').indexOf(bodyMarker)
  if (bodyStartIndex === -1) {
    return null
  }

  const payloadText = String(message || '').slice(bodyStartIndex + bodyMarker.length)
  try {
    const parsed = JSON.parse(payloadText)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch (_) {
    return null
  }
}

const isGenericWrappedError = (error) => {
  const title = String(error?.title || '')
  const text = String(error?.text || '')

  if (!title || !text) {
    return false
  }

  return (
    title.includes('打包失败') ||
    title.includes('转换失败') ||
    GENERIC_ERROR_TEXT_PATTERNS.some((pattern) => text.includes(pattern))
  )
}

const extractReadableLines = (message) =>
  String(message || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

const stripNoisePrefix = (line) =>
  line
    .replace(/^error:\s*/i, '')
    .replace(/^caused by:\s*/i, '')
    .replace(/^Error invoking command '[^']+':\s*/i, '')
    .replace(/^Command failed with exit code \d+:\s*/i, '')
    .trim()

const chooseMeaningfulEnglishLine = (lines) => {
  const candidates = lines
    .map(stripNoisePrefix)
    .filter(
      (line) =>
        line &&
        line !== '[object Object]' &&
        !line.startsWith('at ') &&
        !line.startsWith('stack backtrace') &&
        !line.startsWith('{') &&
        !line.startsWith('}')
    )

  return candidates[0] || ''
}

const extractReadableMessage = (message) => {
  const backendErrorMessage = extractBackendErrorMessage(message)
  if (backendErrorMessage) {
    return backendErrorMessage
  }

  const lines = extractReadableLines(message)
  const exactBuilderLine = lines.find(
    (line) =>
      /failed|error|enoent|eacces|eperm|enospc|not found|invalid|missing|denied|timeout|timed out/i.test(line) &&
      !line.startsWith('[runner]') &&
      !line.startsWith('[bcm-builder]')
  )

  if (exactBuilderLine) {
    return stripNoisePrefix(exactBuilderLine)
  }

  const firstMeaningfulLine = chooseMeaningfulEnglishLine(lines)
  if (firstMeaningfulLine) {
    return firstMeaningfulLine
  }

  return '打包过程中发生异常，请稍后重试'
}

export const createUserFacingError = ({
  code,
  title,
  text,
  detail,
  stage,
  retryable,
  logPath,
  cause
}) => {
  const error = new Error(detail || text || title || '发生未知错误')
  error.name = 'UserFacingError'
  error.code = normalizeErrorCode(code)
  error.title = title
  error.text = text
  error.detail = normalizeOptionalText(detail)
  error.stage = normalizeErrorStage(stage)
  error.retryable = normalizeOptionalBoolean(retryable)
  error.logPath = normalizeOptionalText(logPath)
  if (cause !== undefined) {
    error.cause = cause
  }
  return error
}

export const attachUserFacingErrorMetadata = (error, metadata = {}) => {
  if (!(error instanceof Error)) {
    return createUserFacingError({
      ...metadata,
      detail: metadata.detail || extractErrorMessage(error)
    })
  }

  if (metadata.code) {
    error.code = normalizeErrorCode(metadata.code)
  } else if (!error.code) {
    error.code = DEFAULT_ERROR_CODE
  }

  if (metadata.title) {
    error.title = metadata.title
  }

  if (metadata.text) {
    error.text = metadata.text
  }

  if (metadata.detail) {
    error.detail = normalizeOptionalText(metadata.detail)
  } else if (!error.detail) {
    error.detail = normalizeOptionalText(extractErrorMessage(error))
  }

  if (metadata.stage) {
    error.stage = normalizeErrorStage(metadata.stage)
  } else if (!error.stage) {
    error.stage = DEFAULT_ERROR_STAGE
  }

  if (metadata.retryable !== undefined) {
    error.retryable = normalizeOptionalBoolean(metadata.retryable)
  }

  if (metadata.logPath) {
    error.logPath = normalizeOptionalText(metadata.logPath)
  }

  return error
}

export const normalizeUserFacingError = (error, fallback = {}) => {
  const message = extractErrorMessage(error)
  const backendErrorMessage = extractBackendErrorMessage(message)
  const embeddedPayload = extractEmbeddedJsonPayload(message)
  const fallbackDefinition = getErrorDefinition(fallback.code)

  if (embeddedPayload?.code && embeddedPayload?.title && embeddedPayload?.text) {
    return createUserFacingError({
      code: embeddedPayload.code,
      title: embeddedPayload.title,
      text: embeddedPayload.text,
      detail: embeddedPayload.detail || message,
      stage: embeddedPayload.stage || fallback.stage,
      retryable: embeddedPayload.retryable,
      logPath: embeddedPayload.logPath || fallback.logPath
    })
  }

  if (error?.title && error?.text && !isGenericWrappedError(error)) {
    return attachUserFacingErrorMetadata(error, {
      code: error?.code || fallback.code,
      stage: error?.stage || fallback.stage,
      retryable: error?.retryable ?? fallback.retryable,
      logPath: error?.logPath || fallback.logPath
    })
  }

  if (message.includes('not in tauri')) {
    return createUserFacingError({
      code: 'RUNTIME_TAURI_REQUIRED',
      title: getErrorDefinition('RUNTIME_TAURI_REQUIRED')?.title,
      text: getErrorDefinition('RUNTIME_TAURI_REQUIRED')?.text,
      detail: message,
      stage: fallback.stage || getErrorDefinition('RUNTIME_TAURI_REQUIRED')?.stage,
      retryable: getErrorDefinition('RUNTIME_TAURI_REQUIRED')?.retryable,
      logPath: fallback.logPath
    })
  }

  if (message.includes('meta status=404')) {
    return createUserFacingError({
      code: 'WORK_NOT_FOUND',
      title: getErrorDefinition('WORK_NOT_FOUND')?.title,
      text: getErrorDefinition('WORK_NOT_FOUND')?.text,
      detail: message,
      stage: fallback.stage || getErrorDefinition('WORK_NOT_FOUND')?.stage,
      retryable: getErrorDefinition('WORK_NOT_FOUND')?.retryable,
      logPath: fallback.logPath
    })
  }

  if (message.includes('missing source_urls[0]')) {
    return createUserFacingError({
      code: 'WORK_SOURCE_URL_MISSING',
      title: getErrorDefinition('WORK_SOURCE_URL_MISSING')?.title,
      text: getErrorDefinition('WORK_SOURCE_URL_MISSING')?.text,
      detail: message,
      stage: fallback.stage || getErrorDefinition('WORK_SOURCE_URL_MISSING')?.stage,
      retryable: getErrorDefinition('WORK_SOURCE_URL_MISSING')?.retryable,
      logPath: fallback.logPath
    })
  }

  if (backendErrorMessage) {
    return createUserFacingError({
      code: fallback.code || 'BACKEND_ERROR',
      title: fallbackDefinition?.title || getErrorDefinition('BACKEND_ERROR')?.title,
      text: backendErrorMessage,
      detail: message,
      stage: fallback.stage || fallbackDefinition?.stage,
      retryable: fallback.retryable ?? fallbackDefinition?.retryable,
      logPath: fallback.logPath
    })
  }

  if (isNetworkError(message)) {
    return createUserFacingError({
      code: 'NETWORK_UNAVAILABLE',
      title: getErrorDefinition('NETWORK_UNAVAILABLE')?.title,
      text: getErrorDefinition('NETWORK_UNAVAILABLE')?.text,
      detail: message,
      stage: fallback.stage || getErrorDefinition('NETWORK_UNAVAILABLE')?.stage,
      retryable: getErrorDefinition('NETWORK_UNAVAILABLE')?.retryable,
      logPath: fallback.logPath
    })
  }

  const matchedRule = resolveErrorRule(message)
  if (matchedRule) {
    const matchedDefinition = getErrorDefinition(matchedRule.code)
    return createUserFacingError({
      code: matchedRule.code,
      title: matchedDefinition?.title,
      text: matchedRule.text ? matchedRule.text(message) : resolveErrorDefinitionText(matchedDefinition, message),
      detail: message,
      stage: matchedDefinition?.stage || fallback.stage,
      retryable: matchedDefinition?.retryable ?? fallback.retryable,
      logPath: fallback.logPath
    })
  }

  if (message && message !== '[object Object]' && message.length <= 120) {
    return createUserFacingError({
      code: fallback.code || 'CONVERT_FAILED',
      title: fallbackDefinition?.title || getErrorDefinition('CONVERT_FAILED')?.title,
      text: message,
      detail: message,
      stage: fallback.stage || fallbackDefinition?.stage,
      retryable: fallback.retryable ?? fallbackDefinition?.retryable,
      logPath: fallback.logPath
    })
  }

  return createUserFacingError({
    code: fallback.code || 'CONVERT_FAILED',
    title: fallbackDefinition?.title || getErrorDefinition('CONVERT_FAILED')?.title,
    text: extractReadableMessage(message),
    detail: message,
    stage: fallback.stage || fallbackDefinition?.stage,
    retryable: fallback.retryable ?? fallbackDefinition?.retryable,
    logPath: fallback.logPath
  })
}

export const getErrorAlertContent = (error) => {
  const normalizedError = normalizeUserFacingError(error)

  return {
    title: normalizedError.title,
    text: normalizedError.text
  }
}

export const showErrorAlert = async (error) => {
  const { title, text } = getErrorAlertContent(error)
  await showAlert(title, text, { persistent: true, icon: 'error', buttonText: '关闭' })
}
