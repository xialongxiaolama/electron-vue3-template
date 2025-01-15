<template>
  <div class='header flex justify-between'>
    <div v-if="env&&env==='development'">
      <Tag value="Primary">{{ env }}</Tag>
    </div>
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
const env = window.process.env.NODE_ENV
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