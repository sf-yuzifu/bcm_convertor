const { app, BrowserWindow, ipcMain } = require('electron')
const createWindow = () => {
  const win = new BrowserWindow({
    transparent: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })
  win.loadURL('thisisaplacewhichshouldbereplace')
  win.maximize()
}
app.whenReady().then(() => {
  createWindow()
})
app.on('window-all-closed', () => {
  app.quit()
})
