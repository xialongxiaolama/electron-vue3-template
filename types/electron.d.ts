export{}

declare global {
  interface ipcRenderer{
      send: (channel: string, ...args?: any[]) => void
      on: (channel: string, callback: (event: any, data: any) => void) => void
      off: (channel: string, callback: (event: any, data: any) => void) => void
      once: (channel: string, callback: (event: any, data: any) => void) => void
      invoke: (channel: string, ...args?: any[]) => Promise<any>
      removeAllListeners: (channel: string) => void
  }
  const ipcRenderer:ipcRenderer
}