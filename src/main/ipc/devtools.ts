import { ipcMain } from "electron";
import { vueDevTools } from '../devtools.ts'

export default function setupDevtools(){
  ipcMain.on('open-devtools',()=>{
    vueDevTools.openDevTools()
  })
  ipcMain.on('close-devtools',()=>{
    vueDevTools.closeDevTools()
  })
}