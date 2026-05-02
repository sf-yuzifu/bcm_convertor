import { invoke } from '@tauri-apps/api/core'

import { createUserFacingError } from './errorHandlingService.js'

const extractCommandErrorDetail = (error) => {
  if (typeof error === 'string') {
    return error
  }

  if (error?.message) {
    return error.message
  }

  return String(error || '')
}

export const invokeBackendCommand = async (
  command,
  args,
  { code, title, text, stage, retryable, logPath } = {}
) => {
  try {
    return await invoke(command, args)
  } catch (error) {
    throw createUserFacingError({
      code: code || `BACKEND_${String(command || 'UNKNOWN').replace(/[^A-Za-z0-9]+/g, '_').toUpperCase()}_FAILED`,
      title,
      text,
      detail: extractCommandErrorDetail(error),
      stage,
      retryable,
      logPath,
      cause: error
    })
  }
}
