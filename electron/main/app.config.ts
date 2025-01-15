import path from 'node:path'
import { app , Menu } from 'electron'
import { fileURLToPath } from 'url';

// 模拟COMMONJS 中的 __dirname , module中无法使用
export const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const ROOT_PATH = {
  // /dist
  dist: path.join(__dirname, '../..'),
  // /dist or /public
  public: path.join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

export const windowConfig:Electron.BrowserWindowConstructorOptions = {
  title: '桌面端',
  frame: true,//关闭边框（标题栏，工具栏等）
  // titleBarStyle: 'hidden',//隐藏标题栏
  useContentSize: true,
  transparent: false,
  show:true,
  icon: path.join(ROOT_PATH.public, 'icon_rui.ico'),
  webPreferences: {
    sandbox: true,                // 启用沙盒模式 
    nodeIntegration: true,       // 渲染进程是否Node.js 集成
    contextIsolation: true,      //  是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本. 默认为 true
    preload:path.join(__dirname, '../preload/index.mjs'), //预加载文件 可以向渲染进程暴露 Node.js API
  },
}

export const menuConfig:Electron.Menu = Menu.buildFromTemplate([])