const { app, BrowserWindow, Menu } = require('electron')

const WINDOW_WIDTH = __ONLINE_WINDOW_WIDTH__
const WINDOW_HEIGHT = __ONLINE_WINDOW_HEIGHT__
const PLAYER_URL = 'thisisaplacewhichshouldbereplace'

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
      contextIsolation: false
    }
  })

  Menu.setApplicationMenu(null)
  mainWindow.loadURL(PLAYER_URL)
  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault()
    mainWindow.setTitle(app.name)
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

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
