
import { deviceAddress, IDeviceController, IPort,USBDeviceInfo } from "./type";
import type { Device as HIDDeviceInfo } from 'node-hid'
/**
 * @description: 单例模式 设备管理类
 */

class USBManage {
  static instance: USBManage;
  controllers:Map<string,IDeviceController> = new Map();
  usbDeviceList: USBDeviceInfo[] = []; // usb 设备列表
  hidDeviceList: HIDDeviceInfo[] = []; // usb 设备列表
  comDeviceList: IPort[] = []; // com 串口设备列表
  public connectedList: Map<deviceAddress,IDeviceController> = new Map(); // 已连接的设备列表

  constructor() {
      if (!USBManage.instance) {
        USBManage.instance = this;
        this.init();
      }
      return USBManage.instance;
  }
  async init(){
    this.setupLIstener();
    this.loadControllerModule()
    await this.updateInsertDevices()

    // 初始判断设备连接
    this.usbDeviceList.forEach(device=>{
      this.handleDeviceAttached(device)
    })
  }
  
  private async setupLIstener(){
    ipcRenderer.invoke('usb:openDetect');

    ipcRenderer.on('usb:attach',async (_event, { device }) => {
      this.updateInsertDevices()
      this.handleDeviceAttached(device);
    });
    ipcRenderer.on('usb:detach',async (_event, { device }) => {
      this.updateInsertDevices()
      this.handleDeviceDetached(device);
    })
  }
  async updateInsertDevices(){
    this.comDeviceList = await ipcRenderer.invoke('port:getList')
    this.usbDeviceList = await ipcRenderer.invoke('usb:getList')
    this.hidDeviceList = await ipcRenderer.invoke('hid:getList')
    console.log(this.hidDeviceList);
    console.log(this.usbDeviceList);
  }
  /**
   * @description: 加载所有的控制器模块
   */  
  loadControllerModule(){
    const controllerModules = import.meta.glob('./usbControllers/*.ts',{ eager: true , import:'default' }) as Record<string, IDeviceController>;

    Object.values(controllerModules).forEach(item=>{
      console.log(`output->item`,item)
      if (!this.controllers.has(item.Tag)) {
        this.controllers.set(item.Tag,item)
      }
    })
  }
  // 处理设备插入事件
  private async handleDeviceAttached(device: USBDeviceInfo): Promise<void> {
    const descriptor = device.deviceDescriptor;
    // 通过设备描述符找到对应的控制器
    const matchController:IDeviceController[] =[]
    this.controllers.forEach(controller=>{
      // PID VID 相同且 未连接的控制器添加到待连接选项
      if (controller.PID === descriptor.idProduct && controller.VID === descriptor.idVendor && !controller.linked) {
        matchController.push(controller)
      }
    })

    // 可能有多个设备PID和VID相同 循环判断连接 , 并记录连接的设备控制器
    if (matchController.length > 0) {
      for await (const controller of matchController) {
        const isLinkSuccess = await controller.openConnect()
        if (isLinkSuccess) {
          controller.linked = true
          this.connectedList.set(device.deviceAddress, controller)
          break;
        }
      }
    }
  }
  // 处理设备拔出事件
  private handleDeviceDetached(device: USBDeviceInfo): void {
    console.log('拔出设备---->', device);
    const controller = this.connectedList.get(device.deviceAddress)
    if (controller) {
      controller.closeConnect()
      this.connectedList.delete(device.deviceAddress)
    }
  }
  public addDevice(device: IDeviceController): void {
    if (!this.controllers.has(device.Tag)) {
      this.controllers.set(device.Tag,device)
    }
  }
  public closeDeviceByCom(deviceAddress:deviceAddress){
    const device = this.connectedList.get(deviceAddress)
    if (device) {
      device.closeConnect()
    }
  }
}

export default new USBManage();