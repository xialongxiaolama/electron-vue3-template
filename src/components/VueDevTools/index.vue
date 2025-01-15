<template>
    <div>
      <Button v-if="isShowBtn" :label="$t('tools.openBtn')" size="small" @click="openDevtool"/>
    </div>
</template>

<script setup lang='ts' name=''>
import { devtools } from '@vue/devtools'
// const { proxy } = getCurrentInstance()
// const router = useRouter()
// const route = useRoute()
const isShowBtn = process.env.NODE_ENV === 'development';

function openDevtool(){
  ipcRenderer.send('open-devtool');
}
ipcRenderer.on('devtools-open-success',(event,arg)=>{
  console.log('devtools-open-success',arg)
  devtools.connect()
})
</script>

<style lang='scss' scoped>
    
</style>