<template>
  <div class="header flex justify-between">
    <div v-if="env && env === 'development'">
      <Tag value="Primary">{{ env }}</Tag>
    </div>
    <div class="btn-list flex">
      <span @click="jumpSettings">主题</span>
      <span @click="jumpSettings"> {{ $t('setting.title') }}</span>
      <span @click="handleMinimize"> _ </span>
      <span @click="handleMaximize"> [] </span>
      <span @click="handleClose"> X </span>
    </div>
  </div>
</template>

<script setup name="Header">
import { useConfirm } from 'primevue/useconfirm'
import { appApi } from '@renderer/api/app'

const router = useRouter()
const confirm = useConfirm()
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
  confirm.require({
    message: '退出软件',
    header: '提示',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: '取消',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: '确定',
    },
    accept: () => {
      appApi.close()
    },
  })
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
