import { prepareKitten3Template } from './adapters/kitten3TemplateAdapter.js'
import { prepareKitten4Template } from './adapters/kitten4TemplateAdapter.js'
import { prepareOnlineTemplate } from './adapters/onlineTemplateAdapter.js'

export const prepareTemplateWorkspace = async ({ version, status, projectInfo }) => {
  if (status === 'online') {
    return prepareOnlineTemplate(projectInfo)
  }

  if (version === 'kitten3') {
    return prepareKitten3Template(projectInfo)
  }

  return prepareKitten4Template(projectInfo)
}
