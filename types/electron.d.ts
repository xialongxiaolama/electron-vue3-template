/**
 * Electron API 全局类型声明
 *
 * 通过 DeriveApi 从注册表自动推导 API 类型，
 * 无需再为每个 API 域手写接口定义。
 */
import type { DeriveApi } from '@common/ipc/define'
import type { appApi, deviceApi, usbApi } from '@common/ipc/registry'

export {}

declare global {
  interface Window {
    electronAPI: {
      app: DeriveApi<typeof appApi>
      device: DeriveApi<typeof deviceApi>
      usb: DeriveApi<typeof usbApi>
    }
  }
}
