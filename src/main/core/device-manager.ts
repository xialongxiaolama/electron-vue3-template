/**
 * 设备管理器（单例）
 * 管理所有设备实例的生命周期、插件匹配、事件转发
 */
import { EventEmitter } from 'events'
import { DeviceInstance } from './device-instance'
import type { DeviceDescriptor, DeviceState, DeviceMatchRule, DevicePluginDescriptor } from '@common/types/device'
import type { ITransport } from '@common/types/transport'
import type { IProtocol } from '@common/types/protocol'
import type { IFramer } from '@common/types/framer'
import { HEALTH_CHECK_INTERVAL } from '@common/constants'

/** 设备插件定义 */
export interface DevicePlugin {
  descriptor: DevicePluginDescriptor
  createTransport: (descriptor: DeviceDescriptor) => ITransport
  createProtocol: () => IProtocol
  createFramer: () => IFramer
}

export class DeviceManager extends EventEmitter {
  private static instance: DeviceManager | null = null
  private instances = new Map<string, DeviceInstance>()
  private descriptors = new Map<string, DeviceDescriptor>()
  private plugins = new Map<string, DevicePlugin>()
  private healthCheckIntervals = new Map<string, ReturnType<typeof setInterval>>()

  private constructor() {
    super()
  }

  static getInstance(): DeviceManager {
    if (!DeviceManager.instance) {
      DeviceManager.instance = new DeviceManager()
    }
    return DeviceManager.instance
  }

  // ========== 监听连接 ==========

  // 

  // ========== 插件注册 ==========

  /** 注册设备插件 */
  registerPlugin(plugin: DevicePlugin): void {
    if (this.plugins.has(plugin.descriptor.tag)) {
      console.warn(`[DeviceManager] Plugin "${plugin.descriptor.tag}" already registered, overwriting`)
    }
    this.plugins.set(plugin.descriptor.tag, plugin)
    console.log(`[DeviceManager] Plugin registered: ${plugin.descriptor.tag} (${plugin.descriptor.name})`)
  }

  // ========== 设备匹配 ==========

  /** 根据 VID/PID 等信息匹配插件 */
  matchDevice(rawDevice: { vid?: number; pid?: number; type?: string; path?: string }): DevicePlugin | null {
    for (const plugin of this.plugins.values()) {
      for (const rule of plugin.descriptor.match) {
        if (this.matchesRule(rule, rawDevice)) {
          return plugin
        }
      }
    }
    return null
  }

  private matchesRule(rule: DeviceMatchRule, raw: any): boolean {
    if (rule.vid !== undefined && raw.vid !== rule.vid) return false
    if (rule.pid !== undefined && raw.pid !== rule.pid) return false
    if (rule.path !== undefined && raw.path !== rule.path) return false
    if (rule.usagePage !== undefined && raw.usagePage !== rule.usagePage) return false
    if (rule.usage !== undefined && raw.usage !== rule.usage) return false
    return true
  }

  // ========== 生命周期：连接/断开 ==========

  /** 连接设备 */
  async connect(descriptor: DeviceDescriptor): Promise<{ success: boolean; error?: string }> {
    if (this.instances.has(descriptor.id)) {
      return { success: true }
    }

    const plugin = this.plugins.get(descriptor.tag)
    if (!plugin) {
      return { success: false, error: `No plugin registered for tag "${descriptor.tag}"` }
    }

    const transport = plugin.createTransport(descriptor)
    const protocol = plugin.createProtocol()
    const framer = plugin.createFramer()
    const instance = new DeviceInstance(descriptor, transport, protocol, framer)

    // 转发实例事件
    instance.on('stateChange', (state: DeviceState) => {
      this.emit('deviceStateChanged', { deviceId: descriptor.id, state })
    })
    instance.on('data', (decoded) => {
      this.emit('deviceData', { deviceId: descriptor.id, data: decoded })
    })
    instance.on('error', (error) => {
      this.emit('deviceError', { deviceId: descriptor.id, error })
    })

    try {
      await instance.connect()
      this.instances.set(descriptor.id, instance)
      this.descriptors.set(descriptor.id, descriptor)
      this.startHealthCheck(descriptor.id)
      return { success: true }
    }
    catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  /** 断开设备 */
  async disconnect(deviceId: string): Promise<{ success: boolean; error?: string }> {
    const instance = this.instances.get(deviceId)
    if (!instance) return { success: false, error: 'Device not found' }

    try {
      this.stopHealthCheck(deviceId)
      await instance.disconnect()
      this.instances.delete(deviceId)
      return { success: true }
    }
    catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  // ========== 命令执行 ==========

  /** 通过设备实例执行命令 */
  async execute(deviceId: string, command: string, params?: any): Promise<any> {
    const instance = this.instances.get(deviceId)
    if (!instance) throw new Error(`Device "${deviceId}" not connected`)
    return instance.execute(command, params)
  }

  /** 获取设备状态 */
  getState(deviceId: string): DeviceState | null {
    return this.instances.get(deviceId)?.state ?? null
  }

  /** 获取设备描述符 */
  getDescriptor(deviceId: string): DeviceDescriptor | undefined {
    return this.descriptors.get(deviceId)
  }

  /** 获取所有已连接设备描述符 */
  list(): DeviceDescriptor[] {
    return Array.from(this.instances.values()).map(i => i.descriptor)
  }

  // ========== 健康监控 ==========

  private startHealthCheck(deviceId: string): void {
    const interval = setInterval(() => {
      const instance = this.instances.get(deviceId)
      if (!instance || instance.state !== 'connected') {
        this.stopHealthCheck(deviceId)
        return
      }
      // TODO: 如果协议支持心跳/ping，可在此发送
    }, HEALTH_CHECK_INTERVAL)
    this.healthCheckIntervals.set(deviceId, interval)
  }

  private stopHealthCheck(deviceId: string): void {
    const interval = this.healthCheckIntervals.get(deviceId)
    if (interval) {
      clearInterval(interval)
      this.healthCheckIntervals.delete(deviceId)
    }
  }

  // ========== 清理 ==========

  /** 断开所有设备 */
  async disconnectAll(): Promise<void> {
    const promises = Array.from(this.instances.keys()).map(id => this.disconnect(id))
    await Promise.allSettled(promises)
  }
}
