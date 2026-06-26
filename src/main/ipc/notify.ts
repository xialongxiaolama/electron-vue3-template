import { ipcMain , Notification } from "electron";
import { appApi } from '@common/ipc/registry'

export default function setupNotify(){
  ipcMain.handle(appApi.invoke.notify.channel,(_event, title:string, options:Electron.NotificationConstructorOptions )=>{
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
