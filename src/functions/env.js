import { readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs'
import { invoke } from '@tauri-apps/api/core'
import { homeDir, resourceDir, join, desktopDir } from '@tauri-apps/api/path'
import { type } from '@tauri-apps/plugin-os'
import swal from 'sweetalert'

const WINDOWS_OS = 'windows'
const TAURI_UNAVAILABLE_ERROR = 'not in tauri'

export const isTauri = () => Boolean(window?.__TAURI__ || window?.__TAURI_INTERNALS__)
const isWindows = (osType) => osType === WINDOWS_OS

export const showAlert = (title, text) =>
  swal({
    title,
    text,
    timer: 2000,
    buttons: false
  })

let envPromise
export const getEnv = async () => {
  if (!envPromise) {
    envPromise = (async () => {
      if (!isTauri()) {
        throw new Error(TAURI_UNAVAILABLE_ERROR)
      }

      const osType = await type()
      const homeDirPath = await homeDir()
      const resourceDirPath = (await resourceDir()).replace('\\\\?\\\\', '')
      const desktopDirPath = await desktopDir()

      return { osType, homeDirPath, resourceDirPath, desktopDirPath }
    })()
  }

  return envPromise
}

export const getCopyPath = (path, osType) => (isWindows(osType) ? `${path}\\` : path)
export const copyDirectory = async (from, to) => invoke('copy_dict', { from, to })

export const getConvertHome = async () => {
  const { osType, homeDirPath } = await getEnv()
  const baseHome = await join(homeDirPath, 'convert_tmp')

  return {
    osType,
    home: getCopyPath(baseHome, osType),
    baseHome
  }
}

export const getBuildPaths = async () => {
  const env = await getEnv()
  const home = await join(env.homeDirPath, 'convert_tmp')
  const secondaryHome = await join(env.homeDirPath, 'convert_tmp2')

  return {
    ...env,
    home,
    secondaryHomeCopyPath: getCopyPath(secondaryHome, env.osType)
  }
}

export const readJsonFile = async (path, dir = BaseDirectory.Home) =>
  JSON.parse(await readTextFile(path, { dir }))

export const writeJsonFile = async (path, data, dir = BaseDirectory.Home) =>
  writeTextFile(path, JSON.stringify(data), { dir })

export const copyResourceDirectory = async (resourceParts, targetPath) => {
  const { resourceDirPath } = await getEnv()
  await copyDirectory(await join(resourceDirPath, ...resourceParts), targetPath)
}

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
