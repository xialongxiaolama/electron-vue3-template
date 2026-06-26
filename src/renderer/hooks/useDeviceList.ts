/**
 * useDeviceList — 设备列表 Hook
 */
import { ref, onMounted } from 'vue'
import { deviceApi } from '@renderer/api/device'
import type { DeviceDescriptor } from '@common/types/device'

export function useDeviceList() {
  const devices = ref<DeviceDescriptor[]>([])
  const loading = ref(false)

  async function refresh() {
    loading.value = true
    try {
      devices.value = await deviceApi.list()
    }
    finally {
      loading.value = false
    }
  }

  onMounted(refresh)

  return { devices, loading, refresh }
}
