import { ipcMain , Notification } from "electron";
export default function setupNotify(){
  ipcMain.handle('notify',(_event, title:string, options:Electron.NotificationConstructorOptions )=>{
   const notify = new Notification({title,...options})
   notify.show()
   return new Promise((resolve, reject)=>{
    notify.on('click',()=>{
      resolve(true)
    })
    notify.on('close',()=>{
      resolve(false)
    })
    notify.on('show',()=>{
      resolve(true)
    })
    notify.on('failed',()=>{
      reject(false)
    })
   })
  })
}