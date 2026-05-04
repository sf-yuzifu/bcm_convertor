import { invoke } from '@tauri-apps/api/core'

export const loadOnlineProjectInTauri = async (workId, version = 'kitten4') => {
  const numericWorkId = Number(workId)
  if (version === 'kittenN') {
    return invoke('fetch_kitten_n_info', { workid: numericWorkId })
  }
  return invoke('fetch_online_info', { workid: numericWorkId })
}
