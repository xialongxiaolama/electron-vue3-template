/**
 * 设备相关类型定义
 * 统一 DeviceType、DeviceDescriptor、DeviceState 等核心类型
 */

/** 设备连接类型 */
export type DeviceType = 'usb' | 'serial' | 'bluetooth' | 'network'

/** 设备连接状态 */
export type DeviceState = 'disconnected' | 'connecting' | 'connected' | 'error'

/** 设备实例描述符（唯一标识一个设备） */
export interface DeviceDescriptor {
  /** 唯一设备实例 ID，如 "usb:0483:B601:1" */
  id: string
  /** 人类可读名称 */
  name: string
  /** 设备连接类型 */
  type: DeviceType
  /** 设备插件标签，如 "BZ" */
  tag: string
  // HID 参数
  vid?: number
  pid?: number
  // 串口参数
  path?: string
  baudRate?: number
  // 网络参数
  host?: string
  port?: number
  protocol?: 'tcp' | 'udp'
  // 蓝牙参数
  address?: string
  serviceUuid?: string
  /** 其他设备信息 */
  info?: Record<string, any>
}

/** 设备匹配规则（用于 USB 插入时自动匹配） */
export interface DeviceMatchRule {
  type: DeviceType
  vid?: number
  pid?: number
  path?: string
  usagePage?: number
  usage?: number
}

/** 设备插件描述符（由插件注册） */
export interface DevicePluginDescriptor {
  /** 插件标签，如 "BZ" */
  tag: string
  /** 插件名称 */
  name: string
  /** 设备类型 */
  type: DeviceType
  /** 设备匹配规则列表 */
  match: DeviceMatchRule[]
}
