import { app, globalShortcut } from 'electron'
import { mainWindow } from './main';
export interface ShortcutConfig{
  key:string,
  action:string,
  description?:string
  handler:()=>void
}
export const defaultShortcuts:ShortcutConfig[] = [
  {
    key:'Ctrl+Shift+I',
    action:'open-devtools',
    description:'切换控制台',
    handler:()=>{
      mainWindow?.webContents.toggleDevTools()
    }
  },
  {
    key:'Ctrl+1',
    action:'show',
    description:'显示窗口',
    handler:()=>{
      mainWindow?.show()
    }
  },
  {
    key:'Ctrl+2',
    action:'hide',
    description:'隐藏窗口',
    handler:()=>{
      mainWindow?.hide()
    }
  },
  {
    key:'Ctrl+Q',
    action:'quit',
    description:'退出软件',
    handler:()=>{
      app.exit()
    }
  }
]

class ShortcutManager{
  private shortcuts:Map<string,ShortcutConfig> = new Map()

  // 函数重载声明
  register(config: ShortcutConfig): void;
  register(shorts: ShortcutConfig[]): void;

  // 函数的具体实现
  register(arg: ShortcutConfig | ShortcutConfig[]): void {
    try {
      if (Array.isArray(arg)) {
        arg.forEach(item => {
          // 调用第一个 register 方法的实现
          this._registerSingle(item);
        });
      } else {
        this._registerSingle(arg);
      }
    } catch (error) {
      console.error(`注册快捷键失败: ${(Array.isArray(arg)? arg[0].key : arg.key)}`, error);
    }
  }
  // 第一个 register 方法的具体实现，处理单个 ShortcutConfig
  private _registerSingle(config: ShortcutConfig): void {
    try {
      globalShortcut.register(config.key, config.handler);
      this.shortcuts.set(config.action, config);
    } catch (error) {
      console.error(`注册快捷键失败: ${config.key}`, error);
    }
  }
  getAllShortcuts(){
    const values = Array.from(this.shortcuts.values())
    const arr =  values.map(item=>{
      return {
        key:item.key,
        action:item.action,
        description:item.description
      }
    })
    return arr
  }
  unregister(action:string){
    const config = this.shortcuts.get(action)
    if (config) {
      globalShortcut.unregister(config.key)
      this.shortcuts.delete(action)
    }
  }
  // 更新命令的执行内容
  updateShortcut(action:string,config:ShortcutConfig){
    const oldConfig = this.shortcuts.get(action)
    if (oldConfig) {
      this.unregister(action)
    }
    this.register(config)
  }
  // 更新命令快捷键
  updateShortcutKey(action:string,key:string){
    const config = this.shortcuts.get(action)
    if (config) {
      this.unregister(action)
      config.key = key
      this.register(config)
    }
  }
  unregisterAll(){
    this.shortcuts.clear()
    globalShortcut.unregisterAll()
  }
}


export const shortcutManager = new ShortcutManager()