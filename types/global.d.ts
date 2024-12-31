import type { VNodeChild } from 'vue'

declare global {
  export type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }

  type Recordable<T = any> = Record<string, T>
  type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }

  interface ViteEnv {
    VITE_OPEN_PROXY?: Boolean
    VITE_USE_COMPRESS: Boolean
    VITE_USE_MOCK: Boolean
    command: string
  }
  interface Window {
    ipcRenderer: {
      send: (channel: string, data?: any) => void
      on: (channel: string, callback: (event: any, data: any) => void) => void
      removeListener: (channel: string, callback: (event: any, data: any) => void) => void
      removeAllListeners: (channel: string) => void
      invoke: (channel: string, data: any) => Promise<any>
    }
  }
  interface ipcRenderer{
      send: (channel: string, data?: any) => void
      on: (channel: string, callback: (event: any, data: any) => void) => void
      removeListener: (channel: string, callback: (event: any, data: any) => void) => void
      removeAllListeners: (channel: string) => void
      invoke: (channel: string, data: any) => Promise<any>
  }
  var ipcRenderer:ipcRenderer
}
