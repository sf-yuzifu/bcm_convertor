import { invokeBackendCommand } from '../system/backendCommandService.js'

export const copyPath = async (from, to) =>
  invokeBackendCommand(
    'copy_dict',
    { from, to },
    {
      title: '文件复制失败',
      text: '导出到桌面失败，请检查桌面目录权限、同名文件占用，或重试后再导出'
    }
  )

export const copyDirectory = copyPath
