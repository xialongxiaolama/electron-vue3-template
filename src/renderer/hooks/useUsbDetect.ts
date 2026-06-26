/**
 * useUsbDetect — USB 热插拔检测 Hook
 *
 * 提供：
 * - 开启/关闭 USB 检测
 * - 设备插入/拔出事件
 * - USB/HID/串口设备列表
 * - 组件卸载自动清理
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { usbApi } from '@renderer/api/usb'

export function useUsbDetect() {
  const attachedDevices = ref<any[]>([])
  const detachedDevices = ref<any[]>([])
  const usbList = ref<any[]>([])
  const hidList = ref<any[]>([])
  const portList = ref<any[]>([])
  const detecting = ref(false)
  const unsubFns: (() => void)[] = []

  onMounted(() => {
    unsubFns.push(
      usbApi.onAttached((device) => {
        console.log('插入设备----', device);
        attachedDevices.value.push(device)
      }),
      usbApi.onDetached((device) => {
        detachedDevices.value.push(device)
      }),
    )
  })

  onUnmounted(() => {
    unsubFns.forEach(fn => fn())
    if (detecting.value) stop()
  })

  /** 开启 USB 检测 */
  async function start() {
    await usbApi.openDetect()
    detecting.value = true
  }

  /** 关闭 USB 检测 */
  async function stop() {
    await usbApi.closeDetect()
    detecting.value = false
  }

  /** 刷新 USB 设备列表 */
  async function refreshUsbList() {
    usbList.value = await usbApi.getList()
  }

  /** 刷新 HID 设备列表 */
  async function refreshHidList() {
    hidList.value = await usbApi.getHidList()
  }

  /** 刷新串口设备列表 */
  async function refreshPortList() {
    portList.value = await usbApi.getPortList()
  }

  return {
    attachedDevices,
    detachedDevices,
    usbList,
    hidList,
    portList,
    detecting,
    start,
    stop,
    refreshUsbList,
    refreshHidList,
    refreshPortList,
  }
}
