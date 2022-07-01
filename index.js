const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')


function createWindow() {
    //窗口基本配置
    const win = new BrowserWindow({
        width: 640,
        height: 440,
        frame: false, //隐藏导航栏
        resizable: false,
        icon: path.join(__dirname, 'icon-windowed.icns'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            //preload: path.join(__dirname, 'preload.js')
        }
    })

    //自定义导航栏
    ipcMain.on('min', () => win.minimize());
    ipcMain.on('close', () => win.close());

    //菜单栏
    const menuBar = [
        {label: '帮助'},
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
                },{
                    label: '粘贴',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                }
            ]
        },
    ];
    if (process.platform === 'win32') {
        win.webContents.send('windows')
    }
    if (process.platform === 'linux') {
        win.webContents.send('linux')
    }
    if (process.platform === 'darwin') {
        win.webContents.send('mac')
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

