<template>
  <div class="home">
    {{bzStore.$state.imeiBZ}}
    <InputText v-model="msg" type="text" size="small" placeholder="Small" />
    <Button @click="send" severity="secondary" label="发送通知"/>
  </div>
</template>


<script setup lang="ts">
import useBZStore from '@renderer/store/device/BZStore'
const bzStore = useBZStore()
console.log('首页');
const msg = ref('')
async function send(){
  const options:Electron.NotificationConstructorOptions = {
    title:'提示信息',
    subtitle:'子标题',
    icon:"https://www.dmoe.cc/random.php",
    body: msg.value,
    silent: false,
    hasReply: true, // mac 有效
    replyPlaceholder: "请输入内容", // mac有效
    closeButtonText:"确认关闭吗"
  }
  await ipcRenderer.invoke('notify', '通知', options)
}
</script>

<style lang="scss" scoped>
.home{
  height: 100%;
}
</style>