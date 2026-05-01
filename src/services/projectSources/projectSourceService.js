import { loadOfflineKitten3Project, loadOfflineKitten3ProjectFromFile } from './adapters/offlineProjectSourceAdapter.js'
import { loadOnlineProject } from './onlineProjectSourceGateway.js'

export const loadProjectInfo = async ({ version, status, workId, sourceFilePath }) => {
  if (status === 'offline' && version === 'kitten3') {
    if (typeof sourceFilePath === 'string' && sourceFilePath.trim()) {
      return loadOfflineKitten3ProjectFromFile(sourceFilePath.trim())
    }

    return loadOfflineKitten3Project()
  }

  return loadOnlineProject(workId)
}
