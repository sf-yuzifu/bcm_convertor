import { join } from '@tauri-apps/api/path'

import { readJsonFile, writeJsonFile } from '../files/jsonFileService.js'
import { copyResourceDirectory, getConvertHome } from '../workspace/pathService.js'

export const copyTemplateToConvertHome = async (templateName) => {
  const { home } = await getConvertHome()
  await copyResourceDirectory(['convert', templateName], home)
  return home
}

export const updatePackageJson = async (home, updater) => {
  const packageJsonPath = await join(home, 'package.json.example')
  const contents = await readJsonFile(packageJsonPath)
  updater(contents)
  await writeJsonFile(await join(home, 'package.json'), contents)
}
