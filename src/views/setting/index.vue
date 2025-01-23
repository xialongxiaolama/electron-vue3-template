<template>
  <div>
    <div class="text-left" @click="goHome">返回首页</div>
    <div
      v-for="(item, index) in keyBoardArr"
      :key="index"
      class="flex justify-between px-2 h-10 leading-10 text-align-center"
    >
      <span>{{ item.description }}</span>

      <div
        class="w-48 border-1 border-blue"
        @focus="addBindKeyListener(item)"
        @blur="removeBindKeyListener(item)"
        :tabindex="index"
      >
        {{ item.key }}
      </div>
    </div>
  </div>
</template>

<script setup name="Setting">
const router = useRouter()
const keyBoardArr = ref([])
let keydownListener = null

function addBindKeyListener(item) {
  const keys = []
  keydownListener = (ev) => {
    if (!ev.repeat) {
      if (keys.length < 3) {
        keys.push(ev.key)
      } else {
        keys[2] = ev.key
      }
    }
    item.key = keys.join('+')
  }
  document.addEventListener('keydown', keydownListener)
}
function removeBindKeyListener(item) {
  document.removeEventListener('keydown', keydownListener)
  ipcRenderer.invoke('update-shortcut-key', item.action, item.key)
  keydownListener = null
}

function goHome() {
  router.push('/home')
}
ipcRenderer.invoke('get-all-shortcuts').then((res) => {
  keyBoardArr.value = res
})
</script>

<style lang="scss" scoped></style>
