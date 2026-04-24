import { isTauri } from '../functions/env.js'
import { packageProject } from '../services/packagers/platformPackagerService.js'
import { loadProjectInfo } from '../services/projectSources/projectSourceService.js'
import { prepareTemplateWorkspace } from '../services/templates/templateService.js'
import {
  cleanupAfterConvert,
  cleanupBeforeConvert,
  revealOutputDirectory
} from '../services/workspace/workspaceService.js'

export const runConvertWorkflow = async ({ version, status, workId }) => {
  if (!isTauri()) {
    return { status: 'unavailable' }
  }

  await cleanupBeforeConvert()

  let projectInfo
  try {
    projectInfo = await loadProjectInfo({ version, status, workId })

    if (projectInfo === null) {
      return { status: 'cancelled' }
    }

    await prepareTemplateWorkspace({ version, status, projectInfo })
    await packageProject(projectInfo)
    await revealOutputDirectory()

    return { status: 'success', projectInfo }
  } finally {
    await cleanupAfterConvert()
  }
}
