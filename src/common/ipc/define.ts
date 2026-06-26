/**
 * IPC 注册表 — 核心类型工具
 *
 * 通过 phantom type 技术在编译期推导完整的 API 类型，
 * 运行时仅保留 channel 字符串和 fields 数组。
 *
 * 用法：在 registry.ts 中用 invoke/send/event 定义 API，
 *      通过 DeriveApi<typeof xxxApi> 自动推导出完整类型。
 */

// ==================== 通道定义接口 ====================

/** invoke 通道（请求-响应，ipcRenderer.invoke ↔ ipcMain.handle） */
export interface InvokeDef<P extends any[] = any[], R = any> {
  readonly type: 'invoke'
  readonly channel: string
  /** Phantom brand — 仅类型层使用，运行时不存在 */
  readonly _p?: P
  readonly _r?: R
}

/** send 通道（单向，渲染进程 → 主进程，ipcRenderer.send ↔ ipcMain.on） */
export interface SendDef<P extends any[] = []> {
  readonly type: 'send'
  readonly channel: string
  readonly _p?: P
}

/** event 通道（单向，主进程 → 渲染进程，webContents.send → ipcRenderer.on） */
export interface EventDef<P extends any[] = any[]> {
  readonly type: 'event'
  readonly channel: string
  /** 从主进程推送的对象中提取哪些字段，按顺序传给回调 */
  readonly fields?: readonly string[]
  readonly _p?: P
}

// ==================== 辅助函数 ====================

/** 定义 invoke 通道 */
export function invoke<P extends any[] = any[], R = any>(channel: string): InvokeDef<P, R> {
  return { type: 'invoke', channel } as InvokeDef<P, R>
}

/** 定义 send 通道 */
export function send<P extends any[] = []>(channel: string): SendDef<P> {
  return { type: 'send', channel } as SendDef<P>
}

/** 定义 event 通道 */
export function event<P extends any[] = any[]>(channel: string, fields?: string[]): EventDef<P> {
  return { type: 'event', channel, fields } as EventDef<P>
}

// ==================== API 定义容器 ====================

export interface ApiDefinition {
  readonly namespace: string
  readonly invoke?: Record<string, InvokeDef>
  readonly send?: Record<string, SendDef>
  readonly event?: Record<string, EventDef>
}

/** 定义一个 API 域 */
export function defineApi<T extends ApiDefinition>(def: T): T {
  return def
}

// ==================== 类型推导工具 ====================

/** 从 InvokeDef 提取参数元组类型 */
export type InvokeParams<T> = T extends InvokeDef<infer P, any> ? P : never

/** 从 InvokeDef 提取返回值类型 */
export type InvokeResult<T> = T extends InvokeDef<any, infer R> ? R : never

/** 从 SendDef 提取参数元组类型 */
export type SendParams<T> = T extends SendDef<infer P> ? P : never

/** 从 EventDef 提取回调参数元组类型 */
export type EventParams<T> = T extends EventDef<infer P> ? P : never

/** 从注册表定义推导出完整 API 类型（用于 preload / renderer） */
export type DeriveApi<T extends ApiDefinition> =
  & {
    [K in keyof T['invoke']]: (...args: InvokeParams<T['invoke'][K]>) => Promise<InvokeResult<T['invoke'][K]>>
  }
  & {
    [K in keyof T['send']]: (...args: SendParams<T['send'][K]>) => void
  }
  & {
    [K in keyof T['event']]: (callback: (...args: EventParams<T['event'][K]>) => void) => () => void
  }
