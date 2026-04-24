import { invoke } from '@tauri-apps/api/core'

export const copyDirectory = async (from, to) => invoke('copy_dict', { from, to })
