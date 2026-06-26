/**
 * Preload 脚本 — 安全桥接
 *
 * 通过 createApiBridge 从注册表自动生成桥接对象，
 * 无需再为每个 API 域手写 .api.ts 文件。
 */
import { contextBridge } from 'electron'
import { createApiBridge } from './createApiBridge'
import { appApi, deviceApi, usbApi } from '@common/ipc/registry'

// 暴露类型安全的 API 到渲染进程的 window.electronAPI
contextBridge.exposeInMainWorld('electronAPI', {
  app: createApiBridge(appApi),
  device: createApiBridge(deviceApi),
  usb: createApiBridge(usbApi),
})

// 暴露 process 信息（保留兼容）
contextBridge.exposeInMainWorld('process', {
  argv: process.argv,
  env: process.env,
})
