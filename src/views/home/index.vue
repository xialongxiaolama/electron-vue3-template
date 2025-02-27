<template>
  <div class="home">
    <SvgIcon name="svg-github" />
    <Button @click="testLink">连接测试</Button>
  </div>
</template>


<script setup lang="ts">
import DeviceManage from '@/utils/DeviceManage'
const device = ref<Device>();
const deviceList = ref<Device[]>([]);

console.log(DeviceManage);
const VID = 0x10C4;
const PID = 0xEA60;

ipcRenderer.invoke('get-ports-list').then((res) => {
  console.log(res)
  deviceList.value = res
})

const testLink = ()=>{
  device.value = deviceList.value.find((item)=>{
    console.log(item.deviceDescriptor.idProduct,item.deviceDescriptor.idVendor);
      return item.deviceDescriptor.idProduct === PID && item.deviceDescriptor.idVendor === VID
  })
  device.value
}

</script>

<style lang="scss" scoped>
.home{
  height: 100%;
}
</style>