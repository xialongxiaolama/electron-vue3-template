/**
 * USB IPC 处理器
 * 负责 USB 设备检测、设备列表查询
 * 设备自动连接委托给 DeviceManager
 *
 * 移除旧接口：hid:openDevice, hid:sendData, hid:data:${channel}, port:createPort
 * 这些操作现在由 Transport 层在主进程内部处理
 */
import { ipcMain } from 'electron'
import { usb, getDeviceList } from 'usb'
import { devices as hidDevices } from 'node-hid'
import { SerialPort } from 'serialport'
import { usbApi } from '@common/ipc/registry'
import { DeviceManager } from '../core/device-manager'

export default function setupUsb(): void {
  const manager = DeviceManager.getInstance()
  let isDetecting = false

  // ========== USB 热插拔检测 ==========

  ipcMain.handle(usbApi.invoke.openDetect.channel, async (_event) => {
    if (isDetecting) return
    isDetecting = true

    usb.on('attach', (device: usb.Device) => {
      console.log('设备插入', device);
      const descriptor = device.deviceDescriptor

      // 通知渲染进程有设备插入
      _event.sender.send(usbApi.event.onAttached.channel, { device })

      // 尝试自动匹配并连接设备
      const plugin = manager.matchDevice({
        vid: descriptor.idVendor,
        pid: descriptor.idProduct,
        type: 'usb',
      })

      if (plugin) {
        const deviceDescriptor = {
          id: `usb:${descriptor.idVendor}:${descriptor.idProduct}:${device.deviceAddress}`,
          name: plugin.descriptor.name,
          type: 'usb' as const,
          tag: plugin.descriptor.tag,
          vid: descriptor.idVendor,
          pid: descriptor.idProduct,
        }
        manager.connect(deviceDescriptor)
      }
    })

    usb.on('detach', (device: usb.Device) => {
      const descriptor = device.deviceDescriptor

      // 通知渲染进程有设备拔出
      _event.sender.send(usbApi.event.onDetached.channel, { device })

      // 自动断开匹配的设备
      const deviceId = `usb:${descriptor.idVendor}:${descriptor.idProduct}:${device.deviceAddress}`
      manager.disconnect(deviceId)
    })
  })

  ipcMain.handle(usbApi.invoke.closeDetect.channel, async () => {
    usb.removeAllListeners('attach')
    usb.removeAllListeners('detach')
    isDetecting = false
  })

  // ========== 设备列表查询 ==========

  ipcMain.handle(usbApi.invoke.getList.channel, () => {
    return getDeviceList()
  })

  ipcMain.handle(usbApi.invoke.getHidList.channel, () => {
    return hidDevices()
  })

  ipcMain.handle(usbApi.invoke.getPortList.channel, () => {
    return SerialPort.list()
  })
}
