import { kitten3, kitten4, online } from '../../functions/convert.js'

export const prepareTemplateWorkspace = async ({ version, status, projectInfo }) => {
  if (status === 'online') {
    return online(projectInfo)
  }

  if (version === 'kitten3') {
    return kitten3(projectInfo)
  }

  return kitten4(projectInfo)
}
