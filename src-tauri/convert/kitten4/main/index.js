const path = require('path')
const { app, BrowserWindow, Menu } = require('electron')

const WINDOW_WIDTH = __KITTEN4_WINDOW_WIDTH__
const WINDOW_HEIGHT = __KITTEN4_WINDOW_HEIGHT__

let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    title: app.name,
    useContentSize: true,
    center: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      nodeIntegration: true
    }
  })

  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'))
  Menu.setApplicationMenu(null)

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault()
    mainWindow.setTitle(app.name)
  })

  
  // 页面加载完成后自动点击播放按钮
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.executeJavaScript(`
      (function() {
        const clickPlayButton = () => {
          const playBtn = document.querySelector('.CUI-player-cover-play-btn')
          if (playBtn) {
            playBtn.click()
            console.log('[AutoPlay] Play button clicked')
            return true
          }
          return false
        }
        
        // 立即尝试点击
        if (!clickPlayButton()) {
          // 如果按钮还没加载，等待后重试
          const interval = setInterval(() => {
            if (clickPlayButton()) {
              clearInterval(interval)
            }
          }, 500)
          
          // 10秒后停止尝试
          setTimeout(() => clearInterval(interval), 10000)
        }
      })()
    `).catch(err => console.error('[AutoPlay] Error:', err))
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
