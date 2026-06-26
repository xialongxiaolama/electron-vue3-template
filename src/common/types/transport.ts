/**
 * 统一传输层接口
 * 合并旧 ITransport + IConnection 为一套接口
 */
import type { DeviceType } from './device'

/** 传输层连接选项 */
export interface TransportOptions {
  type: DeviceType
  /** 唯一通道标识 */
  channel: string
  // HID 选项
  vid?: number
  pid?: number
  // 串口选项
  path?: string
  baudRate?: number
  // 网络选项
  host?: string
  port?: number
  protocol?: 'tcp' | 'udp'
  // 蓝牙选项
  address?: string
  serviceUuid?: string
}

/**
 * 统一传输层接口
 * - 所有 Transport 实现此接口
 * - 事件监听返回取消订阅函数，避免内存泄漏
 */
export interface ITransport {
  /** 设备类型 */
  readonly type: DeviceType
  /** 通道标识 */
  readonly channel: string
  /** 是否已连接 */
  readonly connected: boolean

  /** 建立连接 */
  connect(): Promise<void>
  /** 断开连接 */
  disconnect(): Promise<void>
  /** 发送数据 */
  send(data: Buffer): Promise<void>

  /** 监听原始数据，返回取消订阅函数 */
  onRawData(callback: (data: Buffer) => void): () => void
  /** 监听错误，返回取消订阅函数 */
  onError(callback: (error: Error) => void): () => void
  /** 监听意外断开，返回取消订阅函数 */
  onDisconnect(callback: () => void): () => void
}
