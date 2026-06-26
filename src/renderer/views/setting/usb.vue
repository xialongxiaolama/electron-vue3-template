<template>
    <div>
      <Button severity="success" label="获取设备列表" @click="getDeviceList" />
      <Button severity="success" :label="$t('device.openUsbDetect')" @click="startDetect" />
      <Button severity="success" label="关闭设备监听" @click="stopDetect" />

      <div v-if="usbList.length" class="mt-4">
        <h3>USB 设备</h3>
        <div v-for="(d, i) in usbList" :key="i">{{ d }}</div>
      </div>
    </div>
</template>

<script setup lang='ts'>
import { useUsbDetect } from '@renderer/hooks/useUsbDetect'

const {
  usbList,
  attachedDevices,
  detachedDevices,
  detecting,
  start,
  stop,
  refreshUsbList,
  refreshHidList,
  refreshPortList,
} = useUsbDetect()

const getDeviceList = async () => {
  await refreshUsbList()
  await refreshHidList()
  await refreshPortList()
}

const startDetect = () => start()
const stopDetect = () => stop()
</script>

<style lang='scss' scoped>

</style>
