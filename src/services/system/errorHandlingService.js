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

export const createUserFacingError = ({ title, text, detail }) => {
  const error = new Error(detail || text)
  error.title = title
  error.text = text
  error.detail = detail
  return error
}

export const getErrorAlertContent = (error) => {
  if (error?.title && error?.text) {
    return {
      title: error.title,
      text: error.text
    }
  }

  const message = extractErrorMessage(error)
  const backendErrorMessage = extractBackendErrorMessage(message)

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

  if (message && message !== '[object Object]' && message.length <= 120) {
    return {
      title: '转换失败',
      text: message
    }
  }

  return {
    title: '转换失败',
    text: '打包过程中发生异常，请稍后重试'
  }
}

export const showErrorAlert = async (error) => {
  const { title, text } = getErrorAlertContent(error)
  await showAlert(title, text)
}
