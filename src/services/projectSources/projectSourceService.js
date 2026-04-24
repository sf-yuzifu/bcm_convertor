import { getK3file, getOnlineInfo } from '../../functions/online.js'

export const loadProjectInfo = async ({ version, status, workId }) => {
  if (status === 'offline' && version === 'kitten3') {
    return getK3file()
  }

  return getOnlineInfo(workId)
}
