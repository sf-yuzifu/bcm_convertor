const { contextBridge, ipcRenderer } = require('electron')

// 注入 process 对象到全局作用域（非隔离上下文）
if (typeof window !== 'undefined') {
  window.process = {
    type: 'renderer',
    versions: {
      electron: '19.0.7',
      chrome: '102.0.5005.167',
      node: '16.15.1'
    }
  }
}

// 同时通过 contextBridge 注入（隔离上下文）
contextBridge.exposeInMainWorld('process', {
  type: 'renderer',
  versions: {
    electron: '19.0.7',
    chrome: '102.0.5005.167',
    node: '16.15.1'
  }
})

contextBridge.exposeInMainWorld('electronAPI', {
  frameUrl: '__PLAYER_URL__',
  appName: '__APP_NAME__'
})
