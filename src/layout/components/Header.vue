<template>
  <div class='header flex justify-end'>
    <div class="btn-list flex">
      <span @click="handleSetting"> {{ $t('setting.title') }}</span>
      <span @click="handleSetting"> _ </span>
      <span @click="handleSetting"> [] </span>
      <span @click="handleSetting"> X </span>
    </div>
  </div>
</template>

<script setup name='Header'>
const router = useRouter()
function handleSetting(){
  router.push('/setting')
}
</script>

<style lang='scss' scoped>
.header{
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: var(--header-bg);
  -webkit-app-region: drag;
  
  .btn-list{
    -webkit-app-region: no-drag;

    span{
      display: inline-block;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>