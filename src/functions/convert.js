import { open } from '@tauri-apps/api/dialog'
import { readTextFile, BaseDirectory, writeTextFile, createDir, copyFile } from '@tauri-apps/api/fs'
import { fetch } from '@tauri-apps/api/http'
import { invoke } from '@tauri-apps/api/tauri'
import { homeDir, resourceDir, join, desktopDir } from '@tauri-apps/api/path'
import { type } from '@tauri-apps/api/os'
import swal from 'sweetalert'

const osType = await type()
const homeDirPath = await homeDir()
const resourceDirPath = (await resourceDir()).replace('\\\\?\\', '')
const desktopDirPath = await desktopDir()

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
  let response
  try {
    response = await fetch(`https://api-creation.codemao.cn/kitten/r2/work/player/load/${workid}`)
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
  let jsonContents = await fetch(contents['source_urls'][0])
  return { name: contents['name'], data: jsonContents.data, id: workid }
}

export const online = async (info) => {
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
  let contents = JSON.parse(await readTextFile(await join(home, 'package.json.example')))
  contents.name = info.name
  contents.author = info.data['author_nickname']
  await writeTextFile(await join(home, 'package.json'), JSON.stringify(contents))
  contents = await readTextFile(await join(home, 'index.js'))
  contents = contents.replace(
    'thisisaplacewhichshouldbereplace',
    'https://player.codemao.cn/we/' + info.id
  )
  await writeTextFile(await join(home, 'index.js'), contents)
}
export const kitten3 = async (info) => {
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
  let contents = JSON.parse(await readTextFile(await join(home, 'package.json.example')))
  contents.name = info.name
  await writeTextFile(await join(home, 'package.json'), JSON.stringify(contents))
  await writeTextFile(await join(home, 'resource.bcm'), JSON.stringify(info.data))
}
export const kitten4 = async (info) => {
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
  let contents = JSON.parse(await readTextFile(await join(home, 'package.json.example')))
  contents.author = info.data['author_nickname']
  contents.name = info.name
  await writeTextFile(await join(home, 'package.json'), JSON.stringify(contents))
  contents = await readTextFile(await join(home, 'main', 'preload.js'))
  contents = contents.replace('thisisaplacewhichshouldbereplace', JSON.stringify(info.data))
  await writeTextFile(await join(home, 'main', 'preload.js'), contents)
}

export const macos = async (info) => {
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
  await createDir(await join(home, 'linux', 'AppDir', 'usr', 'bin', 'resources'), {
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
