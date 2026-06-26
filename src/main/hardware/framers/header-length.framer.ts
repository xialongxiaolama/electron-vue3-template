/**
 * 头部长度帧处理器
 * 适用于自定义二进制协议：帧头 + 长度字段 + 数据
 * 解决粘包/半包问题
 */
import type { IFramer, FrameResult } from '@common/types/framer'

export interface HeaderLengthFramerOptions {
  /** 帧头标记字节（如 0xA5） */
  headerByte: number
  /** 长度字段在帧头中的偏移量 */
  lengthOffset: number
  /** 长度字段占用字节数（1 或 2） */
  lengthSize: 1 | 2
  /** 帧头总字节数 */
  headerSize: number
  /** 长度值是否包含帧头本身 */
  includesHeaderInLength: boolean
}

export class HeaderLengthFramer implements IFramer {
  private readonly headerByte: number
  private readonly lengthOffset: number
  private readonly lengthSize: 1 | 2
  private readonly headerSize: number
  private readonly includesHeaderInLength: boolean

  constructor(options: HeaderLengthFramerOptions) {
    this.headerByte = options.headerByte
    this.lengthOffset = options.lengthOffset
    this.lengthSize = options.lengthSize
    this.headerSize = options.headerSize
    this.includesHeaderInLength = options.includesHeaderInLength
  }

  process(incoming: Buffer, buffer: Buffer): FrameResult {
    const combined = Buffer.concat([buffer, incoming])
    const frames: Buffer[] = []
    let offset = 0

    while (offset < combined.length) {
      // 不够一个帧头长度，等待更多数据（半包）
      if (combined.length - offset < this.headerSize) break

      // 校验帧头标记，跳过无效字节
      if (combined[offset] !== this.headerByte) {
        offset++
        continue
      }

      // 读取长度字段
      const payloadLength = this.lengthSize === 1
        ? combined[offset + this.lengthOffset]
        : combined.readUInt16BE(offset + this.lengthOffset)

      const totalFrameLength = this.includesHeaderInLength
        ? payloadLength
        : this.headerSize + payloadLength

      // 不够完整帧长度，等待更多数据（半包）
      if (offset + totalFrameLength > combined.length) break

      // 提取完整帧
      frames.push(combined.subarray(offset, offset + totalFrameLength))
      offset += totalFrameLength
    }

    return {
      frames,
      remaining: combined.subarray(offset),
    }
  }

  frame(data: Buffer): Buffer {
    const header = Buffer.alloc(this.headerSize)
    header[0] = this.headerByte

    const lengthValue = this.includesHeaderInLength
      ? data.length + this.headerSize
      : data.length

    if (this.lengthSize === 1) {
      header[this.lengthOffset] = lengthValue
    }
    else {
      header.writeUInt16BE(lengthValue, this.lengthOffset)
    }

    return Buffer.concat([header, data])
  }
}
