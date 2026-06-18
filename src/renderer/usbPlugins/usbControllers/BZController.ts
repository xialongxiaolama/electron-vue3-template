import { deviceAddress, IDeviceController, IPort } from "../type";
import BZService from '@renderer/usbPlugins/usbService/BZService'

class BZController extends BZService implements IDeviceController {
  readonly PID: number;
  readonly VID: number;
  readonly Tag: string;
  readonly channel:string; // 通道由Tag VID PID 组成唯一通道标识
  enabled = false;
  linked = false;
  constructor() {
    super();
    this.VID = 0x0483;
    this.PID = 0xB601;
    this.Tag = 'BZ';
    this.channel = `${this.Tag}:${this.VID}:${this.PID}`
  }
  async openConnect(): Promise<boolean> {
    // 开启通讯通道
    const openResult = await ipcRenderer.invoke(`hid:openDevice`,this.VID,this.PID,this.channel)
    console.log('BZ设备开启成功----',openResult);

    if (openResult.success&&!this.linked) {
      this.sendDeviceInfo()
      
      ipcRenderer.on(`hid:data:${this.channel}`,(_event,data:Uint8Array)=>{
        this.linked = true
        this.autoTransfer(data)
      })
    }
    return openResult
  }
  
  closeConnect(){
    
  }
  connectDevice(){

  }
}

export default new BZController()