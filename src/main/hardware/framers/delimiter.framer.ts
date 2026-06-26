/**
 * 分隔符帧处理器
 * 适用于以特定字节序列分隔的协议（如换行符、0x7E 等）
 */
import type { IFramer, FrameResult } from '@common/types/framer'

export class DelimiterFramer implements IFramer {
  constructor(private delimiter: Buffer) {}

  process(incoming: Buffer, buffer: Buffer): FrameResult {
    const combined = Buffer.concat([buffer, incoming])
    const frames: Buffer[] = []
    let searchStart = 0

    while (searchStart < combined.length) {
      const delimiterIndex = combined.indexOf(this.delimiter, searchStart)
      if (delimiterIndex === -1) break

      frames.push(combined.subarray(searchStart, delimiterIndex))
      searchStart = delimiterIndex + this.delimiter.length
    }

    return { frames, remaining: combined.subarray(searchStart) }
  }

  frame(data: Buffer): Buffer {
    return Buffer.concat([data, this.delimiter])
  }
}
