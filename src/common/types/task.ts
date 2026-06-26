/**
 * 任务执行器类型定义
 * 支持重试、超时、顺序/并行执行
 */

/** 任务状态 */
export type TaskState = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

/** 任务选项 */
export interface TaskOptions {
  /** 单步超时时间（ms） */
  timeout?: number
  /** 失败重试次数 */
  retries?: number
  /** 重试间隔（ms） */
  retryDelay?: number
  /** 取消信号 */
  abortSignal?: AbortSignal
}

/** 任务步骤 */
export interface TaskStep {
  /** 步骤名称 */
  name: string
  /** 步骤执行函数 */
  execute: () => Promise<any>
}

/** 任务执行结果 */
export interface TaskResult<T = any> {
  /** 是否成功 */
  success: boolean
  /** 结果数据 */
  data?: T
  /** 错误信息 */
  error?: Error
  /** 执行耗时（ms） */
  duration: number
}

/** 任务接口 */
export interface ITask<T = any> {
  /** 任务 ID */
  readonly id: string
  /** 任务状态 */
  readonly state: TaskState
  /** 任务结果 */
  readonly result?: TaskResult<T>
  /** 执行任务 */
  execute(): Promise<TaskResult<T>>
  /** 取消任务 */
  cancel(): void
  /** 监听进度，返回取消订阅函数 */
  onProgress(callback: (step: number, total: number) => void): () => void
}
