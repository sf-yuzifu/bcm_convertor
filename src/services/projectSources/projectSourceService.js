import { loadOfflineKitten3Project } from './adapters/offlineProjectSourceAdapter.js'
import { loadOnlineProject } from './onlineProjectSourceGateway.js'

export const loadProjectInfo = async ({ version, status, workId }) => {
  if (status === 'offline' && version === 'kitten3') {
    return loadOfflineKitten3Project()
  }

  return loadOnlineProject(workId)
}
