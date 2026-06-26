/**
 * 渲染进程 - App API 层
 * 直接 re-export window.electronAPI.app，类型由注册表自动推导
 */
export const appApi = window.electronAPI.app
