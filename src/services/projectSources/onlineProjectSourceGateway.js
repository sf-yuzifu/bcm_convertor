import { isTauri } from '../system/runtimeService.js'
import { loadOnlineProjectInBrowser } from './adapters/browserOnlineProjectSourceAdapter.js'
import { loadOnlineProjectInTauri } from './adapters/tauriOnlineProjectSourceAdapter.js'

export const loadOnlineProject = async (workId, version = 'kitten4') => {
  if (isTauri()) {
    return loadOnlineProjectInTauri(workId, version)
  }

  return loadOnlineProjectInBrowser(workId)
}
