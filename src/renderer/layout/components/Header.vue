<template>
  <div class="header flex justify-between">
    <div v-if="env && env === 'development'">
      <el-tag>{{ env }}</el-tag>
    </div>
    <div class="btn-list flex">
      <span @click="jumpSettings"> {{ $t('setting.title') }}</span>
      <span @click="handleMinimize"> _ </span>
      <span @click="handleMaximize"> [] </span>
      <span @click="handleClose"> X </span>
    </div>
  </div>
</template>

<script setup name="Header">
import { ElMessage, ElMessageBox } from 'element-plus'
import { appApi } from '@renderer/api/app'

const router = useRouter()
const env = process.env.NODE_ENV

function jumpSettings() {
  router.push('/setting')
}

function handleMinimize() {
  appApi.minimize()
}

function handleMaximize() {
  appApi.maximize()
}

function handleClose() {
  ElMessageBox.confirm('退出软件', '提示', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    appApi.close()
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
