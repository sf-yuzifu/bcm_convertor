import { invoke } from '@tauri-apps/api/core'

export const loadOnlineProjectInTauri = async (workId) => {
  try {
    const numericWorkId = Number(workId)
    return await invoke('fetch_online_info', { workid: numericWorkId })
  } catch (_) {
    return null
  }
}
