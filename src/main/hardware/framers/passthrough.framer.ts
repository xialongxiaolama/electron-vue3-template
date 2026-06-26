/**
 * 透传帧处理器
 * 用于 HID 等已自动分包的传输方式，无需额外帧处理
 */
import type { IFramer, FrameResult } from '@common/types/framer'

export class PassthroughFramer implements IFramer {
  /** HID 已自动分包，直接返回原始数据 */
  process(incoming: Buffer, _buffer: Buffer): FrameResult {
    return { frames: [incoming], remaining: Buffer.alloc(0) }
  }

  /** 无需包装，原样返回 */
  frame(data: Buffer): Buffer {
    return data
  }
}
