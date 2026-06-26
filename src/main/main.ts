import { app, BrowserWindow, shell, ipcMain ,type BrowserWindowConstructorOptions} from 'electron'
import path from 'node:path'
import { createTray } from "./tray"
import { createMenu } from './menu'
import { shortcutManager , defaultShortcuts } from './shortcut'
import setupIPC from './ipc'
import os from 'node:os'
import { ROOT_PATH, __dirname , windowConfig , menuConfig } from './app.config'
import { DeviceManager } from './core/device-manager'
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └─ index.html    > Electron-Renderer
//
// import.meta.devServerUrl 当前文件的路径
// fileURLToPath 将url转换为文件路径 可以兼容跨平台
// file:///D:/workspace/electron/electron-vite-vue/dist-electron/main/index.js 转化为 D:\workspace\electron\electron-vite-vue\dist-electron\main

// 主窗口
export let mainWindow: BrowserWindow|null = null;

// 开发环境URL
const devServerUrl = process.env['VITE_DEV_SERVER_URL'] || ''
const indexHtml = path.join(ROOT_PATH.dist, 'index.html')

// 初始化应用
function initApp(){
  if (process.platform === 'win32') {
    app.setAppUserModelId(app.getName())
  }
   //win7 linux mac  禁用硬件加速 
  if (os.release().startsWith('6.1')||os.platform() === 'linux'||os.platform() === 'darwin') {
    app.disableHardwareAcceleration()
  }

  // 获取实例锁 ,获取失败代表已经有一个实例,则退出
  if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
  }
}

// 创建主窗口
function createWindow(windowConfig:BrowserWindowConstructorOptions) {
  mainWindow = new BrowserWindow(windowConfig)

  // 开发环境或者打包后的加载路径
  if (app.isPackaged) {
    mainWindow.loadFile(indexHtml)
  } else {
    mainWindow.loadURL(devServerUrl)
  }
  // 窗口首次渲染完成显示
  mainWindow.on('ready-to-show',()=>{
    mainWindow?.show()
  })
  // 窗口资源加载完毕显示
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString())
  })
 

  // 渲染进程中请求创建一个新窗口之前被调用
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // 使用桌面默认的应用打开
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.webContents.openDevTools()
  return mainWindow
}

// 获取主窗口实例
export function getMainWindow() {
  return mainWindow
}

function setupAPPListeners(){
  // 试图创建第二实例时 , 如果应用最小化恢复窗口 , 或者聚焦
  app.on('second-instance',()=>{
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // 激活应用
  app.on('activate',()=>{
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length===0) {
      createWindow(windowConfig)
    }else{
      allWindows[0].focus()
    }
  })

  // 窗口关闭事件
  app.on('window-all-closed',()=>{
    mainWindow = null
    if (process.platform !== 'darwin') app.quit()
  })

  // 在应用开始关闭进程时触发
  app.on('before-quit',()=>{

  })

  // 所有窗口关闭,并且应用准备退出前 
  app.on('will-quit',()=>{
    shortcutManager.unregisterAll()
  })

  // 处理子窗口创建
  ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.mjs'),
        sandbox: true
      },
    })

    if (app.isPackaged) {
      childWindow.loadFile(indexHtml, { hash: arg })
    } else {
      childWindow.loadURL(`${devServerUrl}/#${arg}`)
    }
  })
}

// 应用启动
async function bootstrap() {
  initApp()
  await app.whenReady()

  // 注册设备插件（在 IPC 之前，确保 handler 可使用 DeviceManager）
  const { PluginRegistry } = await import('./plugins/plugin-registry')
  const registry = new PluginRegistry(DeviceManager.getInstance())

  await registry.autoRegister()

  setupIPC()
  createMenu(menuConfig)
  setupAPPListeners()
  const window = createWindow(windowConfig)
  shortcutManager.register(defaultShortcuts)
  createTray(window) // 创建托盘
}

// 启动应用
bootstrap()