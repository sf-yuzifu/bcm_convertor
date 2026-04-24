import { invoke } from '@tauri-apps/api/core'

export const loadOnlineProjectInTauri = async (workId) => {
  const numericWorkId = Number(workId)
  return invoke('fetch_online_info', { workid: numericWorkId })
}
