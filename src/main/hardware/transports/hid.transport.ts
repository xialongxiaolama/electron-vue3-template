/**
 * USB HID 传输层实现
 * 使用 node-hid 库进行 HID 设备通讯
 */
import type { ITransport, TransportOptions } from '@common/types/transport'
import { HID } from 'node-hid'

export class HidTransport implements ITransport {
  readonly type = 'usb' as const
  readonly channel: string
  private _connected = false
  private hidDevice: HID | null = null
  private rawDataCallbacks: ((data: Buffer) => void)[] = []
  private errorCallbacks: ((error: Error) => void)[] = []
  private disconnectCallbacks: (() => void)[] = []
  private options: TransportOptions

  constructor(options: TransportOptions) {
    this.options = options
    this.channel = options.channel
  }

  get connected(): boolean {
    return this._connected
  }

  async connect(): Promise<void> {
    const { vid, pid } = this.options
    if (vid == null || pid == null) throw new Error('HID transport requires vid and pid')

    try {
      this.hidDevice = new HID(vid, pid)
      this._connected = true

      this.hidDevice.on('data', (data: number[]) => {
        const buffer = Buffer.from(data)
        this.rawDataCallbacks.forEach(cb => cb(buffer))
      })

      this.hidDevice.on('error', (err: Error) => {
        this.errorCallbacks.forEach(cb => cb(err))
      })
    }
    catch (err: any) {
      throw new Error(`Failed to open HID device (VID:${vid}, PID:${pid}): ${err.message}`)
    }
  }

  async disconnect(): Promise<void> {
    if (this.hidDevice) {
      this.hidDevice.removeAllListeners()
      this.hidDevice.close()
      this.hidDevice = null
    }
    this._connected = false
    this.disconnectCallbacks.forEach(cb => cb())
  }

  async send(data: Buffer): Promise<void> {
    if (!this.hidDevice) throw new Error('HID device not open')
    this.hidDevice.write(Array.from(data))
  }

  onRawData(callback: (data: Buffer) => void): () => void {
    this.rawDataCallbacks.push(callback)
    return () => {
      const idx = this.rawDataCallbacks.indexOf(callback)
      if (idx >= 0) this.rawDataCallbacks.splice(idx, 1)
    }
  }

  onError(callback: (error: Error) => void): () => void {
    this.errorCallbacks.push(callback)
    return () => {
      const idx = this.errorCallbacks.indexOf(callback)
      if (idx >= 0) this.errorCallbacks.splice(idx, 1)
    }
  }

  onDisconnect(callback: () => void): () => void {
    this.disconnectCallbacks.push(callback)
    return () => {
      const idx = this.disconnectCallbacks.indexOf(callback)
      if (idx >= 0) this.disconnectCallbacks.splice(idx, 1)
    }
  }
}
