/**
 * 串口传输层实现
 * 使用 serialport 库进行串口通讯
 */
import type { ITransport, TransportOptions } from '@common/types/transport'
import { SerialPort } from 'serialport'

export class SerialTransport implements ITransport {
  readonly type = 'serial' as const
  readonly channel: string
  private _connected = false
  private port: SerialPort | null = null
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
    const { path, baudRate } = this.options
    if (!path || !baudRate) throw new Error('Serial transport requires path and baudRate')

    this.port = new SerialPort({ path, baudRate })

    await new Promise<void>((resolve, reject) => {
      this.port!.open((err) => {
        if (err) {
          reject(new Error(`Failed to open serial port: ${err.message}`))
          return
        }
        this._connected = true
        resolve()
      })
    })

    this.port!.on('data', (data: Buffer) => {
      this.rawDataCallbacks.forEach(cb => cb(data))
    })

    this.port!.on('error', (err: Error) => {
      this.errorCallbacks.forEach(cb => cb(err))
    })

    this.port!.on('close', () => {
      this._connected = false
      this.disconnectCallbacks.forEach(cb => cb())
    })
  }

  async disconnect(): Promise<void> {
    if (this.port?.isOpen) {
      await new Promise<void>((resolve) => {
        this.port!.close(() => resolve())
      })
    }
    this._connected = false
  }

  async send(data: Buffer): Promise<void> {
    if (!this.port?.isOpen) throw new Error('Serial port not open')
    return new Promise((resolve, reject) => {
      this.port!.write(data, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
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
