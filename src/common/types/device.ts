export type DeviceType = 'usb' | 'serial' | 'bluetooth' | 'network'

export interface Device {
  id: string
  name: string
  type: DeviceType
  info?: Record<string, any>
}

// 硬件操作标准接口 (Adapter 模式)
export interface IConnection {
  connect(option: any): Promise<void>
  disconnect(): Promise<void>
  send(data: Uint8Array): Promise<void>
  onData(callback: (data: Uint8Array) => void): void,
  onError(callback: (error: Error) => void): void
}

// 插件模式
// 1.抽象接口 2.多个插件类实现这个抽象接口 3.管理器统一注册\调度插件
// 本质是策略模式 + 工厂模式