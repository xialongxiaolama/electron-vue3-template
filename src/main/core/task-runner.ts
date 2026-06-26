/**
 * 任务执行器
 * 支持重试、超时、顺序/并行执行多步骤任务
 */
import type { ITask, TaskOptions, TaskResult, TaskStep, TaskState } from '@common/types/task'
import { DEFAULT_TASK_TIMEOUT, DEFAULT_TASK_RETRIES, DEFAULT_TASK_RETRY_DELAY } from '@common/constants'

export class Task<T = any> implements ITask<T> {
  readonly id: string
  private _state: TaskState = 'pending'
  private _result?: TaskResult<T>
  private steps: TaskStep[]
  private options: Required<Omit<TaskOptions, 'abortSignal'>>
  private abortController: AbortController
  private progressCallbacks: ((step: number, total: number) => void)[] = []

  constructor(id: string, steps: TaskStep[], options: TaskOptions = {}) {
    this.id = id
    this.steps = steps
    this.options = {
      timeout: options.timeout ?? DEFAULT_TASK_TIMEOUT,
      retries: options.retries ?? DEFAULT_TASK_RETRIES,
      retryDelay: options.retryDelay ?? DEFAULT_TASK_RETRY_DELAY,
    }
    this.abortController = new AbortController()
    if (options.abortSignal) {
      options.abortSignal.addEventListener('abort', () => this.cancel())
    }
  }

  get state(): TaskState {
    return this._state
  }

  get result(): TaskResult<T> | undefined {
    return this._result
  }

  async execute(): Promise<TaskResult<T>> {
    if (this._state === 'running') throw new Error('Task already running')
    this._state = 'running'
    const startTime = Date.now()

    try {
      let lastResult: any
      for (let i = 0; i < this.steps.length; i++) {
        if (this.abortController.signal.aborted) throw new Error('Task cancelled')

        const step = this.steps[i]
        lastResult = await this.executeStepWithRetry(step)

        this.progressCallbacks.forEach(cb => cb(i + 1, this.steps.length))
      }

      this._result = { success: true, data: lastResult, duration: Date.now() - startTime }
      this._state = 'completed'
    }
    catch (err: any) {
      this._result = { success: false, error: err, duration: Date.now() - startTime }
      this._state = 'failed'
    }

    return this._result
  }

  /** 带重试的步骤执行 */
  private async executeStepWithRetry(step: TaskStep): Promise<any> {
    let lastError: Error | undefined

    for (let attempt = 0; attempt <= this.options.retries; attempt++) {
      try {
        return await Promise.race([
          step.execute(),
          this.createTimeout(this.options.timeout),
        ])
      }
      catch (err: any) {
        lastError = err
        if (attempt < this.options.retries) {
          await this.delay(this.options.retryDelay)
        }
      }
    }

    throw lastError
  }

  private createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Step timed out after ${ms}ms`)), ms),
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  cancel(): void {
    this.abortController.abort()
    if (this._state === 'running') {
      this._state = 'cancelled'
    }
  }

  onProgress(callback: (step: number, total: number) => void): () => void {
    this.progressCallbacks.push(callback)
    return () => {
      const idx = this.progressCallbacks.indexOf(callback)
      if (idx >= 0) this.progressCallbacks.splice(idx, 1)
    }
  }
}

/** 任务执行器工厂 */
export class TaskRunner {
  /** 创建任务 */
  static create<T = any>(id: string, steps: TaskStep[], options?: TaskOptions): ITask<T> {
    return new Task(id, steps, options)
  }

  /** 顺序执行多个任务 */
  static async sequence(tasks: ITask[]): Promise<TaskResult[]> {
    const results: TaskResult[] = []
    for (const task of tasks) {
      results.push(await task.execute())
    }
    return results
  }

  /** 并行执行多个任务 */
  static async parallel(tasks: ITask[]): Promise<TaskResult[]> {
    return Promise.all(tasks.map(t => t.execute()))
  }
}
