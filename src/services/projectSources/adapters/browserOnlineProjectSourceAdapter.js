import { showAlert } from '../../system/dialogService.js'

const fetchJson = async (url) => {
  const response = await window.fetch(url)
  const data = await response.json()
  return { status: response.status, data }
}

export const loadOnlineProjectInBrowser = async (workId) => {
  let response
  try {
    response = await fetchJson(`https://api-creation.codemao.cn/kitten/r2/work/player/load/${workId}`)
  } catch (error) {
    await showAlert('离线', '请检查网络是否连接')
    return null
  }

  if (response.status !== 200) {
    await showAlert('找不到作品', '请检查作品id是否正确')
    return null
  }

  const workInfo = response.data
  const sourceUrl = workInfo['source_urls']?.[0]
  if (!sourceUrl) {
    await showAlert('找不到作品', '请确保作品有发布过一次')
    return null
  }

  const projectDataResponse = await fetchJson(sourceUrl)
  return { name: workInfo['name'], data: projectDataResponse.data, id: workId }
}
