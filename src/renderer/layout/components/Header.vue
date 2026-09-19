<template>
  <div class="header flex justify-between">
    <div v-if="env && env === 'development'">
      <el-tag>{{ env }}</el-tag>
    </div>
    <div class="btn-list flex">
      <span @click="jumpSettings" class="i-tabler-settings text-lg" />
      <span @click="minimize" class="i-tabler-minimize text-lg" />
      <span @click="maximize" class="i-tabler-maximize text-lg" />
      <span @click="close" class="i-tabler-x text-lg" />
    </div>
  </div>
</template>

<script setup name="Header">
import { ElMessage, ElMessageBox } from 'element-plus'

// 使用 useI18n 获取 $t 方法
const router = useRouter()
const env = process.env.NODE_ENV

function jumpSettings() {
  router.push('/setting')
}
function minimize() {
  ipcRenderer.send('min-window')
}
function maximize() {
  ipcRenderer.send('max-window')
}
function close() {
  ElMessageBox.confirm('退出软件', '提示', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    ipcRenderer.send('close-window')
  }).catch((err) => {
    console.log(err);
  });
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: var(--header-bg);
  -webkit-app-region: drag;

  .btn-list {
    -webkit-app-region: no-drag;

    span {
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
