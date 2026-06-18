import { IProtocol } from "../hardware/protocols/base.protocol";
import { ITransport } from "../hardware/transports/base.transport";

// 设备实例：Transport + Protocol 的组合
export class DeviceInstance {
  constructor(public id:string, private transport: ITransport, private protocol: IProtocol){}
  async connect() {
    await this.transport.connect();
  }
  // 对外暴露的统一执行命令接口
  async execute(commandName: string, params:any): Promise<any>{
    // 编码：业务命令 -> 字节流
    const data = this.protocol.encode(commandName, params);
    // 发送字节流到传输层
    await this.transport.send(data);
    // 等待传输层返回字节流
    this.transport.onRawData((rawData) => {
      console.log("Received raw data:", rawData);
      // 解码：字节流 -> 业务数据
      const result = this.protocol.decode(rawData);
      return result;
    });
  }
}