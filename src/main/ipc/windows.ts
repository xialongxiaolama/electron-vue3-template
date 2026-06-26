import { ipcMain , BrowserWindow } from "electron";
import { appApi } from '@common/ipc/registry'

export default function setupWindow(){
  ipcMain.on(appApi.send.minimize.channel,(_event)=>{
    const win = BrowserWindow.getFocusedWindow()
    win?.minimize()
  })
  ipcMain.on(appApi.send.maximize.channel,(_event)=>{
    const win = BrowserWindow.getFocusedWindow()
    console.log('获取窗口',win);
    if (win) {
      console.log(win);
      win.isMaximized() ? win.unmaximize() : win.maximize();
    }
  })
  ipcMain.on(appApi.send.close.channel,(_event)=>{
    const win = BrowserWindow.getFocusedWindow()
    win?.close()
  })
}
