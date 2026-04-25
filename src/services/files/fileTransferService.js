import { invokeBackendCommand } from '../system/backendCommandService.js'

export const copyPath = async (from, to) =>
  invokeBackendCommand('copy_dict', { from, to }, {
    title: '文件复制失败',
    text: '准备打包文件时发生异常，请检查模板文件和目录权限'
  })

export const copyDirectory = copyPath
