<template>
  <div class="home">
    <el-input v-model="msg" type="text" size="small" placeholder="Small" />
    <el-button @click="send" severity="secondary" label="发送通知"/>
  </div>
</template>


<script setup lang="ts">
import { appApi } from '@renderer/api/app'
import { useDeviceStore } from '@renderer/store/device/device.store'

const deviceStore = useDeviceStore()
console.log('首页')
const msg = ref('')

async function send() {
  const options: Electron.NotificationConstructorOptions = {
    title: '提示信息',
    subtitle: '子标题',
    icon: 'https://www.dmoe.cc/random.php',
    body: msg.value,
    silent: false,
    hasReply: true,
    replyPlaceholder: '请输入内容',
    closeButtonText: '确认关闭吗',
  }
  await appApi.notify('通知', options)
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
