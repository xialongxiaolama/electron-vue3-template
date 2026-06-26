/**
 * 网络传输层实现
 * 使用 node:net 进行 TCP/UDP 通讯
 */
import type { ITransport, TransportOptions } from '@common/types/transport'
import net from 'node:net'

export class NetworkTransport implements ITransport {
  readonly type = 'network' as const
  readonly channel: string
  private _connected = false
  private socket: net.Socket | null = null
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
    const { host, port } = this.options
    if (!host || !port) throw new Error('Network transport requires host and port')

    this.socket = new net.Socket()

    this.socket.on('data', (data: Buffer) => {
      this.rawDataCallbacks.forEach(cb => cb(data))
    })

    this.socket.on('error', (err: Error) => {
      this.errorCallbacks.forEach(cb => cb(err))
    })

    this.socket.on('close', () => {
      this._connected = false
      this.disconnectCallbacks.forEach(cb => cb())
    })

    await new Promise<void>((resolve, reject) => {
      this.socket!.connect(port, host, () => {
        this._connected = true
        resolve()
      })
      this.socket!.on('error', (err) => {
        reject(new Error(`Failed to connect to ${host}:${port}: ${err.message}`))
      })
    })
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.removeAllListeners()
      this.socket.destroy()
      this.socket = null
    }
    this._connected = false
  }

  async send(data: Buffer): Promise<void> {
    if (!this.socket) throw new Error('Network socket not connected')
    return new Promise((resolve, reject) => {
      this.socket!.write(data, (err) => {
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
