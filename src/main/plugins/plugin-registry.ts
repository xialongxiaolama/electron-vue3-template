/**
 * 设备插件注册中心
 * 自动发现并注册 plugins/ 目录下的所有设备插件
 *
 * 新增设备只需：
 * 1. 在 plugins/ 下创建新目录（如 xyz/）
 * 2. 创建 index.ts 导出 DevicePlugin
 * 3. 即可被自动发现和注册，无需修改任何核心代码
 */
import { DeviceManager } from '../core/device-manager'
import type { DevicePlugin } from '../core/device-manager'

export interface DevicePluginModule {
  default: DevicePlugin
}

export class PluginRegistry {
  private manager: DeviceManager

  constructor(manager: DeviceManager) {
    this.manager = manager
  }

  /** 自动发现并注册 plugins/ 目录下的所有插件 */
  async autoRegister(): Promise<void> {
    const pluginModules = import.meta.glob('./*/index.ts', { eager: true }) as Record<string, DevicePluginModule>

    for (const [path, module] of Object.entries(pluginModules)) {
      if (module?.default) {
        this.register(module.default)
      }
      else {
        console.warn(`[PluginRegistry] Invalid plugin module at ${path}`)
      }
    }

    console.log(`[PluginRegistry] ${Object.keys(pluginModules).length} plugin(s) registered`)
  }

  /** 注册单个插件 */
  register(plugin: DevicePlugin): void {
    this.manager.registerPlugin(plugin)
  }
}
