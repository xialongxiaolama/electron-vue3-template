/**
 * 设备 IPC 处理器
 * 桥接渲染进程的设备操作请求到 DeviceManager
 */
import { ipcMain, BrowserWindow } from 'electron'
import { DeviceManager } from '../core/device-manager'
import { deviceApi } from '@common/ipc/registry'

const manager = DeviceManager.getInstance()

export default function setupDevice(): void {
  // ========== 请求-响应通道 ==========

  ipcMain.handle(deviceApi.invoke.list.channel, () => {
    return manager.list()
  })

  ipcMain.handle(deviceApi.invoke.connect.channel, async (_event, deviceId: string) => {
    const descriptor = manager.getDescriptor(deviceId)
    if (!descriptor) return { success: false, error: `Unknown device: ${deviceId}` }
    return manager.connect(descriptor)
  })

  ipcMain.handle(deviceApi.invoke.disconnect.channel, async (_event, deviceId: string) => {
    return manager.disconnect(deviceId)
  })

  ipcMain.handle(deviceApi.invoke.execute.channel, async (_event, deviceId: string, command: string, params?: any) => {
    try {
      const result = await manager.execute(deviceId, command, params)
      return result
    }
    catch (err: any) {
      return { error: err.message }
    }
  })

  ipcMain.handle(deviceApi.invoke.getState.channel, (_event, deviceId: string) => {
    return manager.getState(deviceId)
  })

  // ========== 事件推送：DeviceManager -> 渲染进程 ==========

  const forwardEvent = (channel: string, data: any) => {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send(channel, data)
    })
  }

  manager.on('deviceStateChanged', (data) => {
    forwardEvent(deviceApi.event.onStateChanged.channel, data)
  })

  manager.on('deviceData', (data) => {
    forwardEvent(deviceApi.event.onData.channel, data)
  })

  manager.on('deviceError', (data) => {
    forwardEvent(deviceApi.event.onError.channel, data)
  })
}
