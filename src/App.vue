<script setup lang="ts">
window.addEventListener('contextmenu',()=>{
  ipcRenderer.send('show-context-menu','传递数据---')
})
window.ipcRenderer.on('main-process-message',(event,arg)=>{
  console.log('main-process-message',arg)
})
</script>

<template>

  <router-view></router-view>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
