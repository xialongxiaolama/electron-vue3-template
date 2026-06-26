/**
 * 统一设备 Store
 * 替代旧 BZStore + usb store，管理所有设备的状态和数据
 */
import { defineStore } from 'pinia'
import type { DeviceDescriptor, DeviceState } from '@common/types/device'

export const useDeviceStore = defineStore('device', {
  state: () => ({
    /** 所有已连接设备描述符 */
    devices: [] as DeviceDescriptor[],
    /** 设备连接状态 { deviceId -> state } */
    states: {} as Record<string, DeviceState>,
    /** 设备最新数据 { deviceId -> data } */
    deviceData: {} as Record<string, any>,
  }),

  getters: {
    /** 获取已连接的设备列表 */
    connectedDevices: (state) => state.devices.filter(d => state.states[d.id] === 'connected'),

    /** 获取 BZ 设备信息（兼容旧 BZStore） */
    bzDeviceInfo: (state) => {
      const bzDevice = state.devices.find(d => d.tag === 'BZ')
      if (!bzDevice) return null
      return state.deviceData[bzDevice.id] as { imei: string; version: string } | null
    },
  },

  actions: {
    /** 更新设备状态 */
    updateDeviceState(deviceId: string, state: DeviceState) {
      this.states[deviceId] = state
    },

    /** 更新设备数据 */
    updateDeviceData(deviceId: string, data: any) {
      this.deviceData[deviceId] = data
    },

    /** 设置设备列表 */
    setDevices(devices: DeviceDescriptor[]) {
      this.devices = devices
    },

    /** 移除设备 */
    removeDevice(deviceId: string) {
      this.devices = this.devices.filter(d => d.id !== deviceId)
      delete this.states[deviceId]
      delete this.deviceData[deviceId]
    },

    /** 清空所有 */
    clearAll() {
      this.devices = []
      this.states = {}
      this.deviceData = {}
    },
  },
})
