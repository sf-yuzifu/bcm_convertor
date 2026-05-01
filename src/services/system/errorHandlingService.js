import { showAlert } from './dialogService.js'

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

const NORMALIZED_ERROR_PATTERNS = [
  {
    title: '图标文件缺失',
    match: (message) => message.includes('找不到自定义图标文件'),
    text: '找不到自定义图标文件，请重新选择作品图标后再试'
  },
  {
    title: 'Node 运行时缺失',
    match: (message) => message.includes('找不到内置 Node.js 运行时'),
    text: '找不到内置 Node.js 运行时，请确认打包运行时已完整发布'
  },
  {
    title: 'Builder 脚本缺失',
    match: (message) => message.includes('找不到内置 builder 脚本'),
    text: '找不到内置 builder 脚本，请确认应用资源已完整发布'
  },
  {
    title: 'Builder 工具链缺失',
    match: (message) => message.includes('找不到可用的 electron-builder 工具链目录'),
    text: '找不到 electron-builder 工具链，请确认内置 builder 资源是否完整'
  },
  {
    title: 'Electron 版本缺失',
    match: (message) => message.includes('找不到 electron 版本声明'),
    text: '未找到 Electron 版本配置，请检查 builder 工具链依赖'
  },
  {
    title: '图标格式不支持',
    match: (message) =>
      message.includes('仅支持使用 .ico 或 .png') ||
      message.includes('仅支持使用 .icns') ||
      message.includes('仅支持 png/jpg/jpeg/webp/svg/ico/icns'),
    text: (message) => extractReadableMessage(message)
  },
  {
    title: '远程封面下载失败',
    match: (message) => message.includes('下载远程封面图失败'),
    text: (message) => extractReadableMessage(message)
  },
  {
    title: '远程图标转换失败',
    match: (message) => message.includes('远程图标转换 PNG 失败') || message.includes('无法创建图标转换画布'),
    text: '远程封面图无法转换为可用图标，请更换图片后重试'
  },
  {
    title: '图标文件无效',
    match: (message) =>
      /is not .*valid png file/i.test(message) ||
      /is not a valid png file/i.test(message) ||
      /png-to-ico/i.test(message),
    text: '所选 PNG 图标文件无效或已损坏，请重新选择一张真正的 PNG 图片后再试'
  },
  {
    title: '输出目录不可写',
    match: (message) =>
      message.toLowerCase().includes('permission denied') ||
      message.toLowerCase().includes('access is denied') ||
      message.toLowerCase().includes('eprem') ||
      message.toLowerCase().includes('eacces'),
    text: '没有权限写入导出目录，请更换目录或以更高权限运行'
  },
  {
    title: '磁盘空间不足',
    match: (message) =>
      message.toLowerCase().includes('no space left on device') || message.toLowerCase().includes('enospc'),
    text: '磁盘空间不足，请清理磁盘后重试'
  },
  {
    title: '缓存目录不可用',
    match: (message) => message.toLowerCase().includes('builder-downloads'),
    text: (message) => extractReadableMessage(message)
  },
  {
    title: '打包命令执行失败',
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

export const createUserFacingError = ({ title, text, detail }) => {
  const error = new Error(detail || text)
  error.title = title
  error.text = text
  error.detail = detail
  return error
}

export const getErrorAlertContent = (error) => {
  const message = extractErrorMessage(error)
  const backendErrorMessage = extractBackendErrorMessage(message)

  if (error?.title && error?.text && !isGenericWrappedError(error)) {
    return {
      title: error.title,
      text: error.text
    }
  }

  if (message.includes('not in tauri')) {
    return {
      title: '当前环境不支持',
      text: '请在桌面应用中使用转换功能'
    }
  }

  if (message.includes('meta status=404')) {
    return {
      title: '找不到作品',
      text: '请检查作品id是否正确'
    }
  }

  if (message.includes('missing source_urls[0]')) {
    return {
      title: '找不到作品',
      text: '请确保作品有发布过一次'
    }
  }

  if (backendErrorMessage) {
    return {
      title: '转换失败',
      text: backendErrorMessage
    }
  }

  if (isNetworkError(message)) {
    return {
      title: '离线',
      text: '请检查网络是否连接'
    }
  }

  const normalizedError = NORMALIZED_ERROR_PATTERNS.find((rule) => rule.match(message))
  if (normalizedError) {
    return {
      title: normalizedError.title,
      text: typeof normalizedError.text === 'function' ? normalizedError.text(message) : normalizedError.text
    }
  }

  if (message && message !== '[object Object]' && message.length <= 120) {
    return {
      title: '转换失败',
      text: message
    }
  }

  return {
    title: '转换失败',
    text: extractReadableMessage(message)
  }
}

export const showErrorAlert = async (error) => {
  const { title, text } = getErrorAlertContent(error)
  await showAlert(title, text, { persistent: true, icon: 'error', buttonText: '关闭' })
}
