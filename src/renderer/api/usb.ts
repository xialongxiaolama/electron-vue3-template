/**
 * 渲染进程 - USB API 层
 * 直接 re-export window.electronAPI.usb，类型由注册表自动推导
 */
export const usbApi = window.electronAPI.usb
