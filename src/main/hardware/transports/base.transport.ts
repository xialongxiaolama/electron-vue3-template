// 定义基础传输层接口
export interface ITransport {
  connect(): Promise<void>
  disconnect(): Promise<void>
  send(data: Buffer): Promise<void>
  onRawData(callback: (data: Buffer) => void): void
  onError(callback: (error: Error) => void): void
}