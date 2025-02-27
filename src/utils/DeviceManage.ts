type Com = string;

export interface IDevice{
  PID:number;
  VID:number;
  baudRate:number;
  port:Com;
  status:'open'|'close';
  linked:boolean;
  openPort(): void;
  connectDevice(): void;
  closePort(): void;
  send(data: string): void;
}
export interface IPort {
    friendlyName: 
    "Silicon Labs CP210x USB to UART Bridge (COM4)"
    locationId
    : 
    "Port_#0004.Hub_#0001"
    manufacturer
    : 
    "Silicon Laboratories"
    path
    : 
    "COM4"
    pnpId
    : 
    "USB\\VID_10C4&PID_EA60\\2A95819D15A1EB11BB5A371CDA22184A"
    productId
    : 
    "EA60"
    serialNumber: "2A95819D15A1EB11BB5A371CDA22184A"
    vendorId: "10C4"
}
/**
 * @description: 单利模式 设备管理类
 */

class DeviceManage {
  private static instance: DeviceManage;
  private devicesList: IDevice[] = [];
  private portsList: IPort[] = [];
  public ComList: Map<Device,Com> = new Map();

  constructor() {
      if (!DeviceManage.instance) {
        DeviceManage.instance = this;
        this.init();
      }
    return DeviceManage.instance;
  }

  init(){
    this.setupLIstener();
  }
  setupLIstener(){
    ipcRenderer.invoke('open-usb-detect');

    ipcRenderer.on('usb-attach',async (_event, { device }) => {
      this.portsList =  await ipcRenderer.invoke('get-ports-list')

      this.handleDeviceAttached(device);
    });
    ipcRenderer.on('usb-detach',async (_event, { device }) => {
      this.portsList =  await ipcRenderer.invoke('get-ports-list')

      this.handleDeviceDetached(device);
    })
  }
  // 处理设备连接事件
  private async handleDeviceAttached(device: Device): Promise<void> {
    console.log(device);
    const descriptor = device.deviceDescriptor;
    // 通过设备描述符找到对应的设备
    const matchPorts = this.portsList.filter((port)=>{
        return Number(port.vendorId) === descriptor.idVendor && Number(port.productId) === descriptor.idProduct;
    })

    const matchDevice = this.devicesList.filter((device)=>{
      return device.PID === descriptor.idProduct && device.VID === descriptor.idVendor;
    })
  }
  // 处理设备断开事件
  private handleDeviceDetached(device: Device): void {
      // const descriptor = device.descriptor;
      // const key = (descriptor.vendorId << 16) | descriptor.productId;

      // if (this.devices.has(key)) {
      //     this_devices.delete(key);
      //     this.emit('deviceDetached', key);
      // }
  }
  public addDevice(device: IDevice): void {
    this.devicesList.push(device);
  }
  public getDeviceByVID(PID:number ,VID: number): IDevice[] | undefined {
   return this.devicesList.filter((devicesList) => {
      return devicesList.PID === PID && devicesList.VID === VID;
    });
  }
}

export default new DeviceManage();