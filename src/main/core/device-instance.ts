/**
 * 设备实例：Transport + Protocol + Framer 的粘合剂
 *
 * 核心改进：
 * 1. connect() 时一次性注册 onRawData，不再每次 execute 都注册
 * 2. 使用 sequenceId + pendingRequests Map 实现请求-响应关联
 * 3. IFramer 处理粘包/半包后再交给 Protocol 解码
 * 4. 事件监听返回取消订阅函数，避免内存泄漏
 */
import { EventEmitter } from 'events'
import type { ITransport } from '@common/types/transport'
import type { IProtocol, EncodeMessage, DecodedMessage } from '@common/types/protocol'
import type { IFramer } from '@common/types/framer'
import type { DeviceDescriptor, DeviceState } from '@common/types/device'
import { DEFAULT_RESPONSE_TIMEOUT } from '@common/constants'

interface PendingRequest {
  resolve: (value: any) => void
  reject: (reason: Error) => void
  timer: ReturnType<typeof setTimeout>
}

export class DeviceInstance extends EventEmitter {
  private _state: DeviceState = 'disconnected'
  private sequenceId = 0
  private pendingRequests = new Map<number, PendingRequest>()
  private frameBuffer = Buffer.alloc(0)
  private unsubFns: (() => void)[] = []

  constructor(
    public readonly descriptor: DeviceDescriptor,
    private transport: ITransport,
    private protocol: IProtocol,
    private framer: IFramer,
    private responseTimeout: number = DEFAULT_RESPONSE_TIMEOUT,
  ) {
    super()
  }

  get id(): string {
    return this.descriptor.id
  }

  get state(): DeviceState {
    return this._state
  }

  /** 建立连接，注册数据监听 */
  async connect(): Promise<void> {
    this._state = 'connecting'
    this.emitStateChange()

    // 一次性订阅 transport 事件，保存取消订阅函数
    this.unsubFns.push(
      this.transport.onRawData((data) => this.handleRawData(data)),
      this.transport.onError((error) => this.handleError(error)),
      this.transport.onDisconnect(() => this.handleDisconnect()),
    )

    try {
      await this.transport.connect()
      this._state = 'connected'
      this.emitStateChange()
    }
    catch (err) {
      this._state = 'error'
      this.emitStateChange()
      throw err
    }
  }

  /** 断开连接，清理所有资源 */
  async disconnect(): Promise<void> {
    // 拒绝所有待处理请求
    this.rejectAllPending('Device disconnected')

    // 取消 transport 事件订阅
    this.unsubFns.forEach(fn => fn())
    this.unsubFns = []

    await this.transport.disconnect()
    this._state = 'disconnected'
    this.emitStateChange()
  }

  /**
   * 执行命令并等待响应（请求-响应模式）
   * 使用 sequenceId 关联请求与响应，超时自动拒绝
   */
  async execute(commandName: string, params?: any): Promise<any> {
    if (this._state !== 'connected') {
      throw new Error(`Device not connected (state: ${this._state})`)
    }

    const seqId = ++this.sequenceId
    const message: EncodeMessage = { command: commandName, params, sequenceId: seqId }
    const encoded = this.protocol.encode(message)
    const framed = this.framer.frame(encoded)

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(seqId)
        reject(new Error(`Command "${commandName}" timed out after ${this.responseTimeout}ms`))
      }, this.responseTimeout)

      this.pendingRequests.set(seqId, { resolve, reject, timer })

      this.transport.send(framed).catch((err) => {
        clearTimeout(timer)
        this.pendingRequests.delete(seqId)
        reject(err)
      })
    })
  }

  /**
   * 发送命令不等待响应（单向/事件模式）
   * 用于主动推送数据到设备
   */
  async send(commandName: string, params?: any): Promise<void> {
    if (this._state !== 'connected') {
      throw new Error(`Device not connected (state: ${this._state})`)
    }

    const message: EncodeMessage = { command: commandName, params }
    const encoded = this.protocol.encode(message)
    const framed = this.framer.frame(encoded)
    await this.transport.send(framed)
  }

  // ========== 私有方法：数据流处理 ==========

  /** 处理从 transport 收到的原始数据 */
  private handleRawData(incoming: Buffer): void {
    // 1. Framer 处理：从原始字节流中提取完整帧（解决粘包/半包）
    const { frames, remaining } = this.framer.process(incoming, this.frameBuffer)
    this.frameBuffer = remaining

    // 2. Protocol 解码：将每个完整帧解码为业务消息
    for (const frame of frames) {
      try {
        const decoded = this.protocol.decode(frame)
        this.dispatchDecoded(decoded)
      }
      catch (err) {
        this.emit('error', err)
      }
    }
  }

  /** 分发解码后的消息 */
  private dispatchDecoded(decoded: DecodedMessage): void {
    // 如果是响应消息，关联到对应的 pending 请求
    if (decoded.isResponse && decoded.sequenceId != null) {
      const pending = this.pendingRequests.get(decoded.sequenceId)
      if (pending) {
        clearTimeout(pending.timer)
        this.pendingRequests.delete(decoded.sequenceId)
        pending.resolve(decoded.data)
        return
      }
    }

    // 非响应/未匹配的消息 -> 作为设备事件发出
    this.emit('data', decoded)
  }

  /** 处理 transport 错误 */
  private handleError(error: Error): void {
    this._state = 'error'
    this.emitStateChange()
    this.emit('error', error)
  }

  /** 处理 transport 意外断开 */
  private handleDisconnect(): void {
    this._state = 'disconnected'
    this.emitStateChange()
    this.rejectAllPending('Device disconnected unexpectedly')
  }

  /** 拒绝所有待处理请求 */
  private rejectAllPending(reason: string): void {
    for (const [, pending] of this.pendingRequests) {
      clearTimeout(pending.timer)
      pending.reject(new Error(reason))
    }
    this.pendingRequests.clear()
  }

  /** 发出状态变更事件 */
  private emitStateChange(): void {
    this.emit('stateChange', this._state)
  }
}
