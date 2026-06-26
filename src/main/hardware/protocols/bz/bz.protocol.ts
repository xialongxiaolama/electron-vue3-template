/**
 * BZ 设备协议实现
 * 从旧 BZService 迁移而来，现在运行在主进程
 *
 * 编码：业务命令 -> HID 报文（report ID 0x00 + 命令字节）
 * 解码：HID 数据 -> 业务消息（第一个字节为命令标识）
 */
import type { IProtocol, EncodeMessage, DecodedMessage } from '@common/types/protocol'
import { BZ_CONFIG } from './bz.config'

export class BZProtocol implements IProtocol {
  constructor(private config = BZ_CONFIG) {}

  /** 编码：业务命令 -> HID 报文字节 */
  encode(message: EncodeMessage): Buffer {
    const commandBytes = this.config.sendCommands[message.command]
    if (!commandBytes) {
      throw new Error(`Unknown BZ command: ${message.command}`)
    }

    // HID 报文格式：[reportId=0x00, ...commandBytes]
    // report ID 0x00 是 HID 通讯的约定
    return Buffer.from([0x00, ...commandBytes])
  }

  /** 解码：HID 数据 -> 业务消息 */
  decode(data: Buffer): DecodedMessage {
    // 第一个字节为命令标识
    const commandHex = data[0].toString(16).toUpperCase()
    const commandName = this.config.receiveCommands[commandHex]
    const payload = data.subarray(1)

    // 尝试解析设备信息（特定命令处理）
    const parsedData = this.parsePayload(commandName, payload)

    return {
      command: commandName || `unknown_${commandHex}`,
      data: parsedData,
      isResponse: true, // BZ 协议：所有入站消息都视为对请求的响应
    }
  }

  /** 判断响应是否对应某请求 */
  isResponse(request: EncodeMessage, response: DecodedMessage): boolean {
    const expectedResponse = this.config.requestResponseMap[request.command]
    return expectedResponse === response.command
  }

  /** 解析特定命令的数据载荷 */
  private parsePayload(commandName: string | undefined, payload: Buffer): any {
    if (!commandName) return payload

    switch (commandName) {
      case 'receiveDeviceInfo': {
        try {
          const decoder = new TextDecoder()
          const imei = decoder.decode(payload.subarray(1, 14))
          const version = decoder.decode(payload.subarray(14, 29))
          return { imei, version }
        }
        catch {
          return payload
        }
      }
      default:
        return payload
    }
  }
}
