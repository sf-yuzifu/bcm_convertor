import { packageWithElectronBuilder } from './electronBuilderPackager.js'

export const packageProject = async (projectInfo, options) =>
  packageWithElectronBuilder(projectInfo, options)
