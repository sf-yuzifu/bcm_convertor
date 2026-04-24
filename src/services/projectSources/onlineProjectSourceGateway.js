import { isTauri } from '../system/runtimeService.js'
import { loadOnlineProjectInBrowser } from './adapters/browserOnlineProjectSourceAdapter.js'
import { loadOnlineProjectInTauri } from './adapters/tauriOnlineProjectSourceAdapter.js'

export const loadOnlineProject = async (workId) => {
  if (isTauri()) {
    return loadOnlineProjectInTauri(workId)
  }

  return loadOnlineProjectInBrowser(workId)
}
