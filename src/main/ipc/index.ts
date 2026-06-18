// TODO setupIPC 修改为管理类 添加卸载监听事件
export default function setupIPC(){
    // eager 是否懒加载
    // default 是否导入默认
    const ipcModules:any = import.meta.glob('./*.+(ts|js|mjs|cjs)',{ eager: true , import:'default' })

    Object.keys(ipcModules).forEach((key:string)=>{
        ipcModules[key]()
    })
}