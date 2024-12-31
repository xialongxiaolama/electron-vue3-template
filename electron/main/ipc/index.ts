import setupMenuIPC from './menu'




// const loadModules: Record<string, any> = {}
// Object.keys(modules).forEach((key)=>{
//   const name = key.replace(/^.*\/|\.vue$/g, '')
//   loadModules[name] = modules[key]
// })
// export  default loadModules
export function setupIPC(){
// eager 是否懒加载
// default 是否导入默认
const ipcModules:any = import.meta.glob('./*.ts',{ eager: true , import:'default' })
console.log(`output->pic`,ipcModules)

    setupMenuIPC()
}