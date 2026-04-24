import { invoke } from '@tauri-apps/api/core'

export const loadOnlineProjectInTauri = async (workId) => {
  try {
    return await invoke('fetch_online_info', { workid: Number(workId) })
  } catch (_) {
    return null
  }
}
