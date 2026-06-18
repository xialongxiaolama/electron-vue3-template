import useDeviceStore from '@renderer/store/device/BZStore'
const BZStore = useDeviceStore()
type COMMANDS = Record<string, string>
// 接收的命令
const receive_commands: COMMANDS = {
  E0: 'receiveZeroCalibration', // 0点校准
  A1: 'receiveRestartDevice', // 设备重启
  A5: 'receiveDeviceInfo', // 获取鼻阻设备信息
  A6: 'receiveDeviceIEME', // 设备手柄编号
  A9: 'receiveMeasuring', // 开始测量
  E3: 'receiveStandardCalibration', // 开始标准定标
  C3: 'receiveThreeCalibration', // 开始3流量定标
  C0: 'receiveCalibrationVerify', // 开始定标验证
}

// 发送的命令
const send_commands = {
  sendZeroCalibration: [0xA5,0x01,0x55], // 0点校准
  sendRestartDevice: [0xA5,0x01,0x55], // 设备重启
  sendDeviceInfo: [0xA5,0x01,0x55], // 获取鼻阻设备信息
  sendDeviceIEME: [0xA5,0x01,0x55], // 设备手柄编号
  sendMeasuring: [0xA5,0x01,0x55], // 开始测量
  sendStandardCalibration: [0xA5,0x01,0x55], // 开始标准定标
  sendThreeCalibration: [0xA5,0x01,0x55], // 开始3流量定标
  sendCalibrationVerify: [0xA5,0x01,0x55], // 开始定标验证
}

export default class BZService {
  [key: string]: any
  constructor(){
  }
  /**
   * @description: 设备数据自动分流处理
   * @param {Uint8Array} buffer 返回的buffer数据
   * @return {*}
   */
  autoTransfer(buffer: Uint8Array) {
    const _command = this.getCommand(buffer)
    const response = buffer.slice(1)
    console.log(`output->接收的BZ数据`,buffer)
    if (this[receive_commands[_command]]) {
      this[receive_commands[_command]](response)
    }
  }
  /**
   * @description: 获取buffer 数据中的命令
   * @return {number} 返回命令标识
   */
  getCommand(buffer: Uint8Array) {
    return buffer[0].toString(16).toLocaleUpperCase()
  }
  sendCommand(data:number[]){
    return new Promise(async(resolve, reject) =>{
      const result = await ipcRenderer.invoke('hid:sendData',data,this.channel)
      console.log(`output->发送的BZ命令`,result)
      if (result.success) {
        resolve(result)
      }else {
        reject(result)
      }
    })
  }
  receiveZeroCalibration() {
    // Implementation for zeroCalibration
  }

  receiveRestartDevice() {
    // Implementation for restartDevice
  }

  receiveDeviceInfo(buffer:Uint8Array) {
    console.log('接收到设备信息',buffer);
    try {
      const trans =  new TextDecoder()
      const imeiBZ = trans.decode(buffer.slice(1,14))
      const versionBZ = trans.decode(buffer.slice(14,29))
      BZStore.$patch({imeiBZ , versionBZ})
    } catch (error) {
      
    }
    // Implementation for getDeviceInfo
  }

  receiveDeviceIEME() {
    // Implementation for setDeviceIEME
  }

  receiveMeasuring() {
    // Implementation for startMeasuring
  }

  receiveStandardCalibration() {
    // Implementation for startStandardCalibration
  }

  receiveThreeCalibration() {
    // Implementation for startThreeCalibration
  }

  receiveCalibrationVerify() {
    // Implementation for startCalibrationVerify
  }

  sendDeviceInfo(){
    const send = send_commands['sendDeviceInfo']
    send.unshift(0)
    this.sendCommand(send)
  }
}