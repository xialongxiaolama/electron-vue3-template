/**
 * 帧处理器接口定义
 * 解决粘包（多包合一次读取）和半包（一包分多次读取）问题
 */

/** 帧处理结果 */
export interface FrameResult {
  /** 提取出的完整帧列表 */
  frames: Buffer[]
  /** 剩余不完整数据（等待下次拼接） */
  remaining: Buffer
}

/**
 * 帧处理器接口
 * - process: 从原始字节流中提取完整帧（处理粘包/半包）
 * - frame: 将编码数据包装成帧格式（发送时使用）
 */
export interface IFramer {
  /** 处理收到的原始数据，提取完整帧 */
  process(incoming: Buffer, buffer: Buffer): FrameResult
  /** 将数据包装成帧格式 */
  frame(data: Buffer): Buffer
}
