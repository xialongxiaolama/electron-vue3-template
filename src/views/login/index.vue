<template>
  <div class="flex h-screen items-center justify-center bg-gray-100">
    <div class="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center text-primary mb-6">欢迎登录</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <PrimeVue.InputText v-model="username" placeholder="用户名" class="w-full" />
        <PrimeVue.InputPassword v-model="password" placeholder="密码" class="w-full" />
        <PrimeVue.Button label="登录" type="submit" class="w-full bg-primary hover:bg-primary_hover" />
      </form>
    </div>
  </div>
</template>

<script setup name='login'>
import { ref } from 'vue'
import { InputText } from 'primevue/inputtext'
import { InputPassword } from 'primevue/inputpassword'
import { Button } from 'primevue/button'

const username = ref('')
const password = ref('')

const handleLogin = () => {
  console.log('登录信息:', { username: username.value, password: password.value })
  // 这里可以添加实际的登录逻辑
}
</script>

<style lang='scss' scoped>
// 可以根据需要添加额外的样式
</style>