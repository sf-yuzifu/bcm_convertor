import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs'

export const readJsonFile = async (path, dir = BaseDirectory.Home) => JSON.parse(await readTextFile(path, { dir }))

export const writeJsonFile = async (path, data, dir = BaseDirectory.Home) =>
  writeTextFile(path, JSON.stringify(data), { dir })
