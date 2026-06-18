import { IConnection } from "@common/types/device"
import { SerialPort } from "SerialPort"

export class SerialAdapter implements IConnection {
  private port: SerialPort | null = null
  connect(options: { path: string; baudRate: number }): Promise<void> {
    return new Promise((resolve,reject)=>{
      this.port = new SerialPort({ path: options.path, baudRate: options.baudRate });
      this.port.open(err =>{
        if (err) {
          reject("打开串口失败")
        }
        
      })
    })
  }
  disconnect(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  send(data: Uint8Array): Promise<void> {
    throw new Error("Method not implemented.");
  }
  onData(callback: (data: Uint8Array) => void): void {
    throw new Error("Method not implemented.");
  }
  onError(callback: (error: Error) => void): void {
    throw new Error("Method not implemented.");
  }
}