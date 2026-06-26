/**
 * Preload 桥接生成器
 *
 * 从 IPC 注册表定义自动生成 preload 桥接对象，
 * 替代原来每个 API 手写的 .api.ts 文件。
 */
import { ipcRenderer } from 'electron'
import type { ApiDefinition, DeriveApi } from '@common/ipc/define'

/**
 * 根据注册表定义自动创建 preload 桥接
 *
 * - invoke: (...args) => ipcRenderer.invoke(channel, ...args)
 * - send:   (...args) => ipcRenderer.send(channel, ...args)
 * - event:  (callback) => { 订阅 + 返回取消函数 }
 */
export function createApiBridge<T extends ApiDefinition>(apiDef: T): DeriveApi<T> {
  const bridge: Record<string, any> = {}

  // invoke 通道
  if (apiDef.invoke) {
    for (const [key, def] of Object.entries(apiDef.invoke)) {
      bridge[key] = (...args: any[]) => ipcRenderer.invoke(def.channel, ...args)
    }
  }

  // send 通道
  if (apiDef.send) {
    for (const [key, def] of Object.entries(apiDef.send)) {
      bridge[key] = (...args: any[]) => {
        ipcRenderer.send(def.channel, ...args)
      }
    }
  }

  // event 通道（主进程 → 渲染进程）
  if (apiDef.event) {
    for (const [key, def] of Object.entries(apiDef.event)) {
      bridge[key] = (callback: (...args: any[]) => void) => {
        const handler = (_event: Electron.IpcRendererEvent, data: any) => {
          if (def.fields && def.fields.length > 0) {
            // 有 fields 配置：从对象中按字段名解构，传给回调
            callback(...def.fields.map(f => data[f]))
          } else {
            // 无 fields：直接传递数据
            callback(data)
          }
        }
        ipcRenderer.on(def.channel, handler)
        return () => ipcRenderer.removeListener(def.channel, handler)
      }
    }
  }

  return bridge as DeriveApi<T>
}
