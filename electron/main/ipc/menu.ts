import { ipcMain } from "electron";
export default function setupMenuIPC(){
  ipcMain.on('show-context-menu',(event,data)=>{
    console.log(`output->data`,data)
  })
}