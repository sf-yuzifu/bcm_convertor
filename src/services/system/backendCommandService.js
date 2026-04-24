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

export const invokeBackendCommand = async (command, args, { title, text }) => {
  try {
    return await invoke(command, args)
  } catch (error) {
    throw createUserFacingError({
      title,
      text,
      detail: extractCommandErrorDetail(error)
    })
  }
}
