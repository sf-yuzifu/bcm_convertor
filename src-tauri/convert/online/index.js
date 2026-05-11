const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

const WINDOW_WIDTH = __ONLINE_WINDOW_WIDTH__
const WINDOW_HEIGHT = __ONLINE_WINDOW_HEIGHT__
const PLAYER_URL = 'thisisaplacewhichshouldbereplace'

const buildMinimalMenu = () => {
  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(null)
    return
  }

  const template = [
    {
      label: app.name,
      submenu: [
        { role: 'about', label: '关于' },
        { role: 'quit', label: '退出' }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    title: app.name,
    useContentSize: true,
    center: true,
    show: false,
    transparent: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  buildMinimalMenu()

  mainWindow.loadURL(PLAYER_URL, {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Electron/19.0.7 kitten4-format-factory'
  })

  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault()
    mainWindow.setTitle(app.name)
  })

  mainWindow.on('close', () => {
    mainWindow = null
    app.quit()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      return
    }

    mainWindow.focus()
    mainWindow.show()
  })
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
