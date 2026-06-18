// 定义基础协议接口
export interface IProtocol {
  // 编码：业务命令 -> 字节流
  encode(commandName: string, params: any): Buffer;
  // 解码：字节流 -> 业务数据
  decode(data: Buffer): any;
}