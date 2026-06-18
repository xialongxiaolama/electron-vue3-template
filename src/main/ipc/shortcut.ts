import { ipcMain } from "electron";
import { shortcutManager ,type ShortcutConfig } from "../shortcut";
// handle 监听 ipcRenderer.invoke 事件
// on  监听 ipcRenderer.send 事件
// 区别 : send 仅用来发送信息 ,on仅监听信息
//       invoke 发送信息,并接收返回的信息(可以返回Promise异步), handle监听信息,并返回指定内容

export default function setupShortcut(){
  // 监听更新快捷键操作的请求
  ipcMain.handle('update-shortcut', (_event, action: string, config: ShortcutConfig) => {
    shortcutManager.updateShortcut(action, config);
  });

  // 监听更新快捷键键值的请求
  ipcMain.handle('update-shortcut-key', (_event, action: string, key: string) => {
    shortcutManager.updateShortcutKey(action, key);
  });

  // 监听注册快捷键的请求
  ipcMain.handle('register-shortcut', (_event, config: ShortcutConfig) => {
    shortcutManager.register(config);
  });

  // 监听注销快捷键的请求
  ipcMain.handle('unregister-shortcut', (_event, action: string) => {
    shortcutManager.unregister(action);
  });

  // 监听注销所有快捷键的请求
  ipcMain.handle('unregister-all-shortcuts', () => {
    shortcutManager.unregisterAll();
  });

  // 
  ipcMain.handle('get-all-shortcuts',()=>shortcutManager.getAllShortcuts())
}