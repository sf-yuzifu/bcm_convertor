import { open } from '@tauri-apps/plugin-shell'
import { isTauri } from './runtimeService.js'

export const openExternalUrl = async (url) => {
  if (isTauri()) {
    await open(url)
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}
