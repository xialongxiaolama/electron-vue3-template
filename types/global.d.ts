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
  interface log {
    
  }
}
