const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')

const WINDOW_WIDTH = __KITTEN3_WINDOW_WIDTH__
const WINDOW_HEIGHT = __KITTEN3_WINDOW_HEIGHT__

let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    title: app.name,
    useContentSize: false,
    center: true,
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'player.html'))
  Menu.setApplicationMenu(null)

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools()
  }

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

app.on('ready', createWindow)

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
