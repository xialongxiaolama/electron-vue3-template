<template>
  <div class="home">
    <SvgIcon name="svg-github" />
    <Button  severity="success" :label="$t('message.hello')"  @click="pickApp"/>
  </div>
</template>

<script setup name="home">
const name = ref("home");
function pickApp(){
  console.log(`output->1231`,1231)
  ipcRenderer.send('show-context-menu','传递数据---')
}
</script>

<style lang="scss" scoped>
.home{
  height: 100%;
}
</style>
