/**
 * useDevice — 设备交互 Hook
 *
 * 提供：
 * - 设备连接/断开
 * - 命令执行（含 loading 状态）
 * - 实时数据/错误/状态监听
 * - 组件卸载自动清理
 */
import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { deviceApi } from '@renderer/api/device'
import type { DeviceState } from '@common/types/device'

export function useDevice(deviceId: Ref<string>) {
  const state = ref<DeviceState>('disconnected')
  const lastData = ref<any>(null)
  const lastError = ref<Error | null>(null)
  const loading = ref(false)
  const unsubFns: (() => void)[] = []

  onMounted(() => {
    unsubFns.push(
      deviceApi.onStateChanged((id, newState) => {
        if (id === deviceId.value) state.value = newState
      }),
      deviceApi.onData((id, data) => {
        if (id === deviceId.value) lastData.value = data
      }),
      deviceApi.onError((id, error) => {
        if (id === deviceId.value) lastError.value = error
      }),
    )
  })

  onUnmounted(() => {
    unsubFns.forEach(fn => fn())
  })

  /** 连接设备 */
  async function connect() {
    loading.value = true
    try {
      await deviceApi.connect(deviceId.value)
    }
    finally {
      loading.value = false
    }
  }

  /** 断开设备 */
  async function disconnect() {
    loading.value = true
    try {
      await deviceApi.disconnect(deviceId.value)
    }
    finally {
      loading.value = false
    }
  }

  /** 执行设备命令 */
  async function execute(command: string, params?: any) {
    loading.value = true
    try {
      const result = await deviceApi.execute(deviceId.value, command, params)
      lastError.value = null
      return result
    }
    catch (err: any) {
      lastError.value = err
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return { state, lastData, lastError, loading, connect, disconnect, execute }
}
