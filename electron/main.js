const { app, BrowserWindow, Notification, ipcMain } = require('electron')
const path = require('path')

// 判断是否为开发环境
const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 520,
    height: 720,
    minWidth: 400,
    minHeight: 600,
    resizable: true,
    frame: true,
    title: '番茄钟',
    backgroundColor: '#1a1a2e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // 移除默认菜单栏
  win.setMenuBarVisibility(false)

  if (isDev) {
    win.loadURL('http://localhost:5173')
    // 可选：自动打开开发者工具
    // win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// 处理渲染进程发来的通知请求
ipcMain.handle('show-notification', (event, { title, body }) => {
  if (Notification.isSupported()) {
    const notification = new Notification({ title, body, silent: false })
    notification.show()
    return true
  }
  return false
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
