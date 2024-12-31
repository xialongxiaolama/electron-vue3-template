import { app, BrowserWindow, globalShortcut } from 'electron'
export interface ShortcutConfig{
  key:string,
  action:string,
  handler:()=>void
}
const defaultShortcuts:ShortcutConfig[] = [
  {
    key:'Ctrl+Shift+I',
    action:'open-devtools',
    handler:()=>{
      const win = BrowserWindow.getFocusedWindow()
      win?.webContents.openDevTools()
    }
  },
  {
    key:'Ctrl+D',
    action:'hide',
    handler:()=>{
      app.hide()
    }
  },
  {
    key:'Ctrl+Shift+Q',
    action:'quit',
    handler:()=>{
      app.quit()
    }
  }
]

class ShortcutManager{
  private shortcuts:Map<string,ShortcutConfig> = new Map()

  register(config:ShortcutConfig){
    try {
      globalShortcut.register(config.key,config.handler)
      this.shortcuts.set(config.action,config)
    } catch (error) {
      console.error(`注册快捷键失败: ${config.key}`,error)
    }
  }
  unregister(action:string){
    const config = this.shortcuts.get(action)
    if (config) {
      globalShortcut.unregister(config.key)
      this.shortcuts.delete(action)
    }
  }
  updateShortcut(action:string,config:ShortcutConfig){
    const oldConfig = this.shortcuts.get(action)
    if (oldConfig) {
      this.unregister(action)
    }
    this.register(config)
  }
  unregisterAll(){
    this.shortcuts.clear()
    globalShortcut.unregisterAll()
  }
}

export const shortcutManager = new ShortcutManager()