import { open } from '@tauri-apps/plugin-dialog'
import { readTextFile, BaseDirectory, writeTextFile, mkdir, copyFile } from '@tauri-apps/plugin-fs'
import { fetch as tauriFetch } from '@tauri-apps/plugin-http'
import { invoke } from '@tauri-apps/api/core'
import { homeDir, resourceDir, join, desktopDir } from '@tauri-apps/api/path'
import { type } from '@tauri-apps/plugin-os'
import swal from 'sweetalert'

const isTauri = () => Boolean(window?.__TAURI__ || window?.__TAURI_INTERNALS__)

let envPromise
const getEnv = async () => {
  if (!envPromise) {
    envPromise = (async () => {
      if (!isTauri()) {
        throw new Error('not in tauri')
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

const fetchJson = async (url) => {
  try {
    const response = await window.fetch(url)
    const data = await response.json()
    return { status: response.status, data }
  } catch (_) {
    const res = await tauriFetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        Referer: 'https://player.codemao.cn/',
        Origin: 'https://player.codemao.cn'
      }
    })

    return res
  }
}

export const getK3file = async () => {
  let file = await open({
    filters: [
      {
        name: 'bcm文件',
        extensions: ['bcm']
      }
    ]
  })
  if (file === null) {
    return null
  }
  let contents = JSON.parse(await readTextFile(file, { dir: BaseDirectory.AppConfig }))

  return { name: contents['project_name'], data: contents }
}

export const getOnlineInfo = async (workid) => {
  if (isTauri()) {
    try {
      return await invoke('fetch_online_info', { workid: Number(workid) })
    } catch (_) {
      return null
    }
  }

  let response
  try {
    response = await fetchJson(`https://api-creation.codemao.cn/kitten/r2/work/player/load/${workid}`)
  } catch (error) {
    swal({
      title: '离线',
      text: '请检查网络是否连接',
      timer: 2000,
      buttons: false
    })
    return null
  }
  if (response.status !== 200) {
    swal({
      title: '找不到作品',
      text: '请检查作品id是否正确',
      timer: 2000,
      buttons: false
    })
    return null
  }
  let contents = response.data
  if (contents['source_urls'][0] === undefined) {
    swal({
      title: '找不到作品',
      text: '请确保作品有发布过一次',
      timer: 2000,
      buttons: false
    })
    return null
  }
  let jsonContents = await fetchJson(contents['source_urls'][0])
  return { name: contents['name'], data: jsonContents.data, id: workid }
}

export const online = async (info) => {
  const { osType, homeDirPath, resourceDirPath } = await getEnv()
  let home
  if (osType === 'Windows_NT') {
    home = (await join(homeDirPath, 'convert_tmp')) + '\\'
  } else {
    home = await join(homeDirPath, 'convert_tmp')
  }
  await invoke('copy_dict', {
    from: await join(resourceDirPath, 'convert', 'online'),
    to: home
  })
  let contents = JSON.parse(await readTextFile(await join(home, 'package.json.example'), { dir: BaseDirectory.Home }))
  contents.name = info.name
  contents.author = info.data['author_nickname']
  await writeTextFile(await join(home, 'package.json'), JSON.stringify(contents), { dir: BaseDirectory.Home })
  contents = await readTextFile(await join(home, 'index.js'), { dir: BaseDirectory.Home })
  contents = contents.replace(
    'thisisaplacewhichshouldbereplace',
    'https://player.codemao.cn/we/' + info.id
  )
  await writeTextFile(await join(home, 'index.js'), contents, { dir: BaseDirectory.Home })
}
export const kitten3 = async (info) => {
  const { osType, homeDirPath, resourceDirPath } = await getEnv()
  let home
  if (osType === 'Windows_NT') {
    home = (await join(homeDirPath, 'convert_tmp')) + '\\'
  } else {
    home = await join(homeDirPath, 'convert_tmp')
  }
  await invoke('copy_dict', {
    from: await join(resourceDirPath, 'convert', 'kitten3'),
    to: home
  })
  let contents = JSON.parse(await readTextFile(await join(home, 'package.json.example'), { dir: BaseDirectory.Home }))
  contents.name = info.name
  await writeTextFile(await join(home, 'package.json'), JSON.stringify(contents), { dir: BaseDirectory.Home })
  await writeTextFile(await join(home, 'resource.bcm'), JSON.stringify(info.data), { dir: BaseDirectory.Home })
}
export const kitten4 = async (info) => {
  const { osType, homeDirPath, resourceDirPath } = await getEnv()
  let home
  if (osType === 'Windows_NT') {
    home = (await join(homeDirPath, 'convert_tmp')) + '\\'
  } else {
    home = await join(homeDirPath, 'convert_tmp')
  }
  await invoke('copy_dict', {
    from: await join(resourceDirPath, 'convert', 'kitten4'),
    to: home
  })
  let contents = JSON.parse(await readTextFile(await join(home, 'package.json.example'), { dir: BaseDirectory.Home }))
  contents.author = info.data['author_nickname']
  contents.name = info.name
  await writeTextFile(await join(home, 'package.json'), JSON.stringify(contents), { dir: BaseDirectory.Home })
  contents = await readTextFile(await join(home, 'main', 'preload.js'), { dir: BaseDirectory.Home })
  contents = contents.replace('thisisaplacewhichshouldbereplace', JSON.stringify(info.data))
  await writeTextFile(await join(home, 'main', 'preload.js'), contents, { dir: BaseDirectory.Home })
}

export const macos = async (info) => {
  const { homeDirPath, resourceDirPath, desktopDirPath } = await getEnv()
  const home = await join(homeDirPath, 'convert_tmp')
  await invoke('copy_dict', {
    from: home,
    to: await join(home, 'tmp')
  })
  await invoke('copy_dict', {
    from: await join(resourceDirPath, 'convert', 'mac', 'bcm.app'),
    to: home
  })
  await invoke('copy_dict', {
    from: await join(home, 'tmp'),
    to: await join(home, 'bcm.app', 'Contents', 'Resources', 'app')
  })
  await invoke('copy_dict', {
    from: await join(home, 'bcm.app'),
    to: await join(desktopDirPath, info.name + '.app')
  })
}

export const linux = async (info) => {
  const { homeDirPath, resourceDirPath, desktopDirPath } = await getEnv()
  const home = await join(homeDirPath, 'convert_tmp')
  await invoke('copy_dict', {
    from: home,
    to: await join(home, 'tmp')
  })
  await invoke('copy_dict', {
    from: await join(home, 'package.json'),
    to: await join(home, 'tmp')
  })
  await invoke('copy_dict', {
    from: await join(resourceDirPath, 'convert', 'linux'),
    to: home
  })
  await mkdir(await join(home, 'linux', 'AppDir', 'usr', 'bin', 'resources'), {
    recursive: true
  })
  await invoke('copy_dict', {
    from: await join(home, 'tmp'),
    to: await join(home, 'linux', 'AppDir', 'usr', 'bin', 'resources', 'app')
  })
  await invoke('appimage_packager', {
    home: home
  })
  await invoke('copy_dict', {
    from: await join(home, 'bcm.AppImage'),
    to: await join(desktopDirPath, info.name + '.Appimage')
  })
}

export const windows = async (info) => {
  const { homeDirPath, resourceDirPath, desktopDirPath } = await getEnv()
  const home = await join(homeDirPath, 'convert_tmp')
  await invoke('copy_dict', {
    from: await join(resourceDirPath, 'convert', 'windows'),
    to: (await join(homeDirPath, 'convert_tmp2')) + '\\'
  })
  await invoke('copy_dict', {
    from: home,
    to: (await join(homeDirPath, 'convert_tmp2', 'bcm_file', 'resources', 'app')) + '\\'
  })
  await invoke('winrar_packager', {
    home: homeDirPath
  })
  await copyFile(
    await join(homeDirPath, 'convert_tmp2', 'bcm.exe'),
    await join(desktopDirPath, info.name + '.exe')
  )
}
