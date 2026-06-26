/**
 * 固定长度帧处理器
 * 适用于固定包长的协议
 */
import type { IFramer, FrameResult } from '@common/types/framer'

export class FixedLengthFramer implements IFramer {
  constructor(private frameSize: number) {}

  process(incoming: Buffer, buffer: Buffer): FrameResult {
    const combined = Buffer.concat([buffer, incoming])
    const frames: Buffer[] = []
    let offset = 0

    while (offset + this.frameSize <= combined.length) {
      frames.push(combined.subarray(offset, offset + this.frameSize))
      offset += this.frameSize
    }

    return { frames, remaining: combined.subarray(offset) }
  }

  frame(data: Buffer): Buffer {
    if (data.length !== this.frameSize) {
      throw new Error(`Expected ${this.frameSize} bytes, got ${data.length}`)
    }
    return data
  }
}
