import { ipcMain , BrowserWindow } from "electron";

export default function setupWindow(){
  ipcMain.on('min-window',(_event,args)=>{
    const win = BrowserWindow.getFocusedWindow()
    win?.minimize()
  })
  ipcMain.on('max-window',(_event,args)=>{
    const win = BrowserWindow.getFocusedWindow()
    console.log('获取窗口',win);
    if (win) {
      console.log(win);
      win.isMaximized() ? win.unmaximize() : win.maximize();
    }
  })
  ipcMain.on('close-window',(_event,args)=>{
    const win = BrowserWindow.getFocusedWindow()
    win?.close()
  })
}