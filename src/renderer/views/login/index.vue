<template>
  <div class='login flex'>
    <div class="columns-2">
        <div text="red-1" font="thin">测试unocss 属性话类名</div>
    </div>
    <InputMask id="basic" v-model="value" mask="99-999999" placeholder="99-999999" />
  </div>
</template>

<script setup name='login'>
// const { proxy } = getCurrentInstance()
// const router = useRouter()
// const route = useRoute()
const value = ref('')
</script>

<style lang='scss' scoped>
</style>