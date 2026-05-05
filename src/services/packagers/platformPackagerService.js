import { packageWithElectronBuilder } from './electronBuilderPackager.js'
import { packageWithAndroid } from './androidPackager.js'

export const packageProject = async (projectInfo, options) => {
  const targetPlatform = projectInfo.packageConfig?.targetPlatform || 'windows'
  if (targetPlatform === 'android') {
    return packageWithAndroid(projectInfo, options)
  }
  return packageWithElectronBuilder(projectInfo, options)
}
