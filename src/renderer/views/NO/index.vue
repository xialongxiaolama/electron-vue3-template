<template>
  <div>
    NO首页测试
    <el-button type="primary" size="default" @click="start">打开USB监听</el-button>
    <el-button type="primary" size="default" @click="stop">关闭USB监听</el-button>
    <el-button type="primary" size="default" @click="stop">关闭USB监听</el-button>
  </div>
</template>

<script setup lang="ts" name="NOHome">
import { useUsbDetect } from "@renderer/hooks/useUsbDetect"
const { start, stop, refreshHidList, refreshPortList, refreshUsbList, portList, hidList, usbList } = useUsbDetect()
start()
await refreshHidList()
await refreshPortList()
await refreshUsbList()

window.electronAPI.device.onData((channel,data)=>{
  console.log("监听数据", channel, data);
})
</script>

<style scoped>

</style>