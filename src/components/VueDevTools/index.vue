<template>
    <div v-if="isShowBtn">
      <Button v-show="!isOpen" :label="$t('tools.openBtn')" size="small" @click="openDevtools"/>
      <Button v-show="isOpen" :label="$t('tools.closeBtn')" size="small" @click="closeDevTools"/>
    </div>
</template>

<script setup lang='ts' name=''>
const isShowBtn = process.env.NODE_ENV === 'development';
const isOpen = ref(!!sessionStorage.getItem('DEVTOOLS_STATE'))

function openDevtools(){
  ipcRenderer.send('open-devtools');
}
function closeDevTools(){
  ipcRenderer.send('close-devtools');
}

ipcRenderer.on('devtools-open-success',()=>{
  console.log('开')
  isOpen.value = true
  sessionStorage.setItem('DEVTOOLS_STATE',true+'')
})
ipcRenderer.on('devtools-closed',()=>{
  console.log('关')
  isOpen.value = false
  sessionStorage.setItem('DEVTOOLS_STATE','')
})

</script>

<style lang='scss' scoped>
    
</style>