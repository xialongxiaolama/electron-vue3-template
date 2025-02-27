<template>
    <div>
      <Button  severity="success" label="获取设备列表" @click.once="getDeviceList"/>
      <Button  severity="success" :label="$t('device.openUsbDetect')" @click.once="openUsbDetect"/>
      <Button  severity="success" label="关闭设备监听" @click.once="closeUsbDetect"/>
    </div>
</template>

<script setup lang='ts' name=''>
// const { proxy } = getCurrentInstance()
// const router = useRouter()
// const route = useRoute()
const getDeviceList = () => {
  ipcRenderer.invoke('get-usb-devices').then((res) => {
    console.log(`output->res`,res)
  })
}
const openUsbDetect = () => {
  ipcRenderer.invoke('open-usb-detect')

  ipcRenderer.on('usb-attach', (_event, device) => {
    console.log(`output->device`,device)
  })
  ipcRenderer.on('usb-detach', (_event, arg) => {
    console.log(`output->arg`,arg)
  })
}
const closeUsbDetect = () => {
  ipcRenderer.invoke('close-usb-detect')

  ipcRenderer.removeAllListeners('usb-attach')
  ipcRenderer.removeAllListeners('usb-detach')
}
</script>

<style lang='scss' scoped>
    
</style>