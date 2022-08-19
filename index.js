const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')


function createWindow() {
    //窗口基本配置
    const win = new BrowserWindow({
        width: 640,
        height: 440,
        frame: false, //隐藏导航栏
        resizable: false,
        webPreferences: {
            devTools: false,
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    //自定义导航栏
    ipcMain.on('min', () => win.minimize());
    ipcMain.on('close', () => win.close());

    //菜单栏
    const menuBar = [
        { label: '帮助' },
        {
            label: '编辑', submenu: [
                {
                    label: '撤销',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                },

                {
                    label: '恢复',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo'
                },

                {
                    label: '全选',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectAll'
                },
                {
                    type: 'separator'
                },
                {
                    label: '剪切',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },

                {
                    label: '复制',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                }, {
                    label: '粘贴',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                }
            ]
        },
    ];

    if (process.platform === 'darwin') {
        menuBar.unshift({
            label: app.getName(),
            submenu: [
                {
                    label: '关于 编程猫格式工厂',
                    click() {
                        win.webContents.send('about')
                    }
                },
                {
                    label: '退出 编程猫格式工厂',
                    accelerator: 'CmdOrCtrl+Q',
                    click() {
                        app.quit();
                    }
                }
            ]
        });
    }
    // 构建菜单项
    const menu = Menu.buildFromTemplate(menuBar);
    // 设置一个顶部菜单栏
    Menu.setApplicationMenu(menu);

    //显示f12
    //win.webContents.openDevTools()
    win.loadFile('index.html')

    ipcMain.on('pngor', (sys, atypes) => {
        const { dialog } = require('electron')
        dialog.showOpenDialog({ title: "选择图标", filters: [{ name: '图标', extensions: ['png'] }], properties: ['openFile'] }).then(result => {
            win.webContents.send('icon', result.canceled, result.filePaths[0], atypes)
        }).catch(err => {
            console.log(err)
        })
    });

    ipcMain.on('chooseBcm', () => {
        const { dialog } = require('electron')
        dialog.showOpenDialog({ title: "选择bcm文件", filters: [{ name: 'kitten文件', extensions: ['bcm'] }], properties: ['openFile'] }).then(result => {
            win.webContents.send('gotbcmfile', result.canceled, result.filePaths[0])
        }).catch(err => {
            console.log(err)
        })
    });
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    app.quit()
})

