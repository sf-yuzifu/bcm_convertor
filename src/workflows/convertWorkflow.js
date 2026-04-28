import { isTauri } from '../services/system/runtimeService.js'
import { packageProject } from '../services/packagers/platformPackagerService.js'
import { loadProjectInfo } from '../services/projectSources/projectSourceService.js'
import { prepareTemplateWorkspace } from '../services/templates/templateService.js'
import {
  cleanupAfterConvert,
  cleanupBeforeConvert,
  revealOutputDirectory
} from '../services/workspace/workspaceService.js'

export const runConvertWorkflow = async ({ version, status, workId, projectInfo: initialProjectInfo, onProgress }) => {
  if (!isTauri()) {
    return { status: 'unavailable' }
  }

  onProgress?.({ stage: 'process-files', message: '正在清理临时文件', percent: 1 })
  await cleanupBeforeConvert()

  let projectInfo = initialProjectInfo
  try {
    if (!projectInfo) {
      onProgress?.({ stage: 'process-files', message: '正在读取作品数据', percent: 4 })
      projectInfo = await loadProjectInfo({ version, status, workId })
    }

    if (projectInfo === null) {
      return { status: 'cancelled' }
    }

    onProgress?.({ stage: 'process-files', message: '正在处理项目文件', percent: 7 })
    await prepareTemplateWorkspace({ version, status, projectInfo })
    onProgress?.({ stage: 'process-files', message: '项目文件处理完成，准备打包', percent: 10 })
    const packageResult = await packageProject(projectInfo, { onProgress })
    onProgress?.({ stage: 'postprocess', message: '正在打开输出目录', percent: 98 })
    await revealOutputDirectory(packageResult.outputDirectory)
    onProgress?.({ stage: 'success', message: '转换与打包已完成', percent: 100 })

    return { status: 'success', projectInfo }
  } finally {
    await cleanupAfterConvert()
  }
}
