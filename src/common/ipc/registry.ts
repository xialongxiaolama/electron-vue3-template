/**
 * IPC 注册表 — 唯一真相源
 *
 * 所有 API 的通道名、参数类型、返回类型在此定义一次，
 * preload 桥接、TypeScript 类型声明、renderer API 均从此自动推导。
 *
 * 新增接口只需：
 * 1. 在此处添加一行
 * 2. 在 main/ipc 写 handler
 */
import { defineApi, invoke, send, event } from './define'
import type { DeviceDescriptor, DeviceState } from '../types/device'
import type { ShortcutConfig } from '../../main/shortcut'

// ========== App 域（窗口控制、通知、快捷键） ==========
export const appApi = defineApi({
  namespace: 'app',
  invoke: {
    notify:              invoke<[string, Electron.NotificationConstructorOptions?], any>('notify'),
    updateShortcut:      invoke<[string, string], void>('update-shortcut'),
    updateShortcutKey:   invoke<[string, string], void>('update-shortcut-key'),
    registerShortcut:    invoke<[ShortcutConfig], void>('register-shortcut'),
    unregisterShortcut:  invoke<[string], void>('unregister-shortcut'),
    unregisterAll:       invoke<[], void>('unregister-all-shortcuts'),
    getAllShortcuts:      invoke<[], any[]>('get-all-shortcuts'),
  },
  send: {
    minimize: send('min-window'),
    maximize: send('max-window'),
    close:    send('close-window'),
  },
  event: {},
})

// ========== Device 域（设备管理） ==========
export const deviceApi = defineApi({
  namespace: 'device',
  invoke: {
    list:       invoke<[], DeviceDescriptor[]>('device:list'),
    connect:    invoke<[string], { success: boolean; error?: string }>('device:connect'),
    disconnect: invoke<[string], { success: boolean; error?: string }>('device:disconnect'),
    execute:    invoke<[string, string, any?], any>('device:execute'),
    getState:   invoke<[string], DeviceState | null>('device:getState'),
  },
  send: {},
  event: {
    onStateChanged: event<[string, DeviceState]>('device:event:stateChanged', ['deviceId', 'state']),
    onData:         event<[string, any]>('device:event:data', ['deviceId', 'data']),
    onError:        event<[string, Error]>('device:event:error', ['deviceId', 'error']),
  },
})

// ========== USB 域（USB 检测与设备列表） ==========
export const usbApi = defineApi({
  namespace: 'usb',
  invoke: {
    openDetect:  invoke<[], void>('usb:openDetect'),
    closeDetect: invoke<[], void>('usb:closeDetect'),
    getList:     invoke<[], any[]>('usb:getList'),
    getHidList:  invoke<[], any[]>('hid:getList'),
    getPortList: invoke<[], any[]>('port:getList'),
  },
  send: {},
  event: {
    onAttached: event<[any]>('usb:event:attached', ['device']),
    onDetached: event<[any]>('usb:event:detached', ['device']),
  },
})
