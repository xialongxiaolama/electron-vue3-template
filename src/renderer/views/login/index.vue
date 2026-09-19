<template>
    <div class="p-8 bg-white drag">
      <el-form @submit.prevent="handleLogin" class="space-y-4 nodrag">
        <h1 class="text-2xl font-bold text-center text-primary mb-6 cursor-pointer">欢迎登录</h1>
        <el-input v-model="username" placeholder="用户名" class="w-full" />
        <el-input type="password" v-model="password" placeholder="密码" class="w-full" />
        <el-button type="success" @click="handleLogin">登录</el-button>
      </el-form>
    </div>
</template>

<script setup name='login'>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const username = ref('admin')
const password = ref('123456')

const handleLogin = () => {
  console.log('登录信息:', { username: username.value, password: password.value })
  // 这里可以添加实际的登录逻辑
  router.push("/home")
}
</script>

<style lang='scss' scoped>
// 可以根据需要添加额外的样式
</style>