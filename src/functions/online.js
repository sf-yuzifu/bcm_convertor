import { open } from '@tauri-apps/plugin-dialog'
import { readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs'
import { invoke } from '@tauri-apps/api/core'

import { showAlert } from '../services/system/dialogService.js'
import { isTauri } from '../services/system/runtimeService.js'

const fetchJson = async (url) => {
  const response = await window.fetch(url)
  const data = await response.json()
  return { status: response.status, data }
}

export const getK3file = async () => {
  const file = await open({
    filters: [
      {
        name: 'bcm文件',
        extensions: ['bcm']
      }
    ]
  })
  if (file === null) {
    return null
  }

  const contents = JSON.parse(await readTextFile(file, { dir: BaseDirectory.AppConfig }))
  return { name: contents['project_name'], data: contents }
}

const fetchOnlineInfoInBrowser = async (workid) => {
  let response
  try {
    response = await fetchJson(`https://api-creation.codemao.cn/kitten/r2/work/player/load/${workid}`)
  } catch (error) {
    await showAlert('离线', '请检查网络是否连接')
    return null
  }

  if (response.status !== 200) {
    await showAlert('找不到作品', '请检查作品id是否正确')
    return null
  }

  const contents = response.data
  const sourceUrl = contents['source_urls']?.[0]
  if (!sourceUrl) {
    await showAlert('找不到作品', '请确保作品有发布过一次')
    return null
  }

  const jsonContents = await fetchJson(sourceUrl)
  return { name: contents['name'], data: jsonContents.data, id: workid }
}

export const getOnlineInfo = async (workid) => {
  if (isTauri()) {
    try {
      return await invoke('fetch_online_info', { workid: Number(workid) })
    } catch (_) {
      return null
    }
  }

  return fetchOnlineInfoInBrowser(workid)
}
