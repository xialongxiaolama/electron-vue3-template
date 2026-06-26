/**
 * 渲染进程 - 设备 API 层
 * 直接 re-export window.electronAPI.device，类型由注册表自动推导
 */
export const deviceApi = window.electronAPI.device
