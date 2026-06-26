/**
 * 协议层接口定义
 * 负责业务命令与字节流之间的编解码
 */

/** 编码时的消息结构 */
export interface EncodeMessage {
  /** 命令名称，如 "sendDeviceInfo" */
  command: string
  /** 命令参数 */
  params?: Record<string, any>
  /** 序列号，用于请求-响应关联 */
  sequenceId?: number
}

/** 解码后的消息结构 */
export interface DecodedMessage {
  /** 命令名称，如 "receiveDeviceInfo" */
  command: string
  /** 解码后的数据 */
  data: any
  /** 序列号（与请求对应） */
  sequenceId?: number
  /** 是否为响应消息 */
  isResponse: boolean
}

/**
 * 协议层接口
 * - encode: 业务命令 -> 字节流
 * - decode: 字节流 -> 业务数据
 * - isResponse: 判断响应是否对应某个请求
 */
export interface IProtocol {
  /** 编码：业务消息 -> 字节流 */
  encode(message: EncodeMessage): Buffer
  /** 解码：字节流 -> 业务消息 */
  decode(data: Buffer): DecodedMessage
  /** 判断响应是否对应某请求（用于请求-响应关联） */
  isResponse(request: EncodeMessage, response: DecodedMessage): boolean
}
