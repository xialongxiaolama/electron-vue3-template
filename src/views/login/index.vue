<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
    <div class="w-full max-w-md mx-auto px-2">
      <Card class="rounded-xl shadow-lg overflow-hidden">
        <template #header>
          <div class="bg-gradient-to-r from-sky-300 to-blue-500 p-6 text-center">
            <img src="@/assets/icon_rui.ico"
                 alt="App Logo"
                 class="w-20 h-20 mx-auto rounded-full bg-white p-1 shadow-lg mt-4 mb-2">
            <p class="text-sky-100 mt-1">请登录您的账号</p>
          </div>
        </template>

        <template #content>
          <form @submit.prevent="handleLogin" class="space-y-6 p-6 sm:p-8">
            <div>
              <FloatLabel>
                <label for="username">用户名或邮箱</label>
                <InputText inputId="username"
                           v-model="formData.username"
                           class="w-full p-3 rounded-lg border border-gray-300" />
              </FloatLabel>
              <Message v-if="errors.username"
                       variant="simple"
                       severity="error"
                       size="small">
                {{ errors.username }}
              </Message>
            </div>

            <div>
              <FloatLabel>
                <Password v-model="formData.password"
                          :feedback="false"
                          id="password"
                          toggleMask
                          inputClass="w-full"
                          class="w-full block" />
                <label for="password">密码</label>
              </FloatLabel>
              <Message v-if="errors.password"
                       variant="simple"
                       severity="error"
                       size="small">
                {{ errors.password }}
              </Message>
            </div>

            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center">
                <Checkbox v-model="rememberMe"
                          :binary="true"
                          class="mr-2"
                          inputId="remember" />
                <label for="remember"
                       class="text-gray-600 cursor-pointer select-none">记住我</label>
              </div>
              <a href="#"
                 class="text-sky-400 hover:text-sky-600 text-sm font-medium">忘记密码?</a>
            </div>

            <Button label="登录"
                    class="w-full"
                    @click="handleLogin"
                    :loading="loading" />
          </form>
        </template>

        <template #footer>
          <Divider />
          <div class="py-4 text-center">
            <p class="text-gray-600 text-sm">
              还没有账号?
              <a href="#"
                 class="text-sky-600 hover:text-sky-800 font-medium">立即注册</a>
            </p>
          </div>
        </template>
      </Card>
      <div class="pt-3 pb-3 text-center text-gray-500 text-sm">
        <p> · 隐私政策 · 使用条款</p>
      </div>
    </div>
  </div>
</template>

<script setup name='login'>
import useStore from '@/store/app/user'
const userStore = useStore()
const loading = ref(false)
const rememberMe = ref(false)

// 表单数据和错误处理
const formData = reactive({
  username: '',
  password: '',
})

const errors = reactive({
  username: '',
  password: '',
})

// 登录验证和提交
const handleLogin = async () => {
  // 重置错误信息
  errors.username = ''
  errors.password = ''

  // 简单验证
  if (!formData.username.trim()) {
    console.log(errors)
    errors.username = '请输入用户名或邮箱'
    return
  }

  if (!formData.password) {
    errors.password = '请输入密码'
    return
  }

  // 如果密码长度小于6位
  if (formData.password.length < 6) {
    errors.password = '密码长度至少为6位'
    return
  }

  loading.value = true

  try {
    // 调用Pinia store的登录方法
    await userStore.login(formData.username, formData.password)

    // 登录成功后跳转
    router.push('/dashboard')
  } catch (error) {
    // 错误处理
    errors.password = error.message || '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}
</script>

<style lang='scss'>
// 响应式优化和美化
@media (max-width: 640px) {
  .min-h-screen {
    align-items: flex-start;
    padding-top: 1rem;
  }
  .max-w-md {
    max-width: 100%;
  }
  .rounded-xl {
    border-radius: 1rem;
  }
  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  .p-6 {
    padding: 1.25rem;
  }
  .sm\:p-8 {
    padding: 1.5rem;
  }
}

:deep(.p-password-input) {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
}

:deep(.p-password:focus-within) {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  border-color: #818cf8;
  border-radius: 0.5rem;
}

:deep(.p-button.p-button-loading) {
  background: linear-gradient(to right, #4f46e5, #7c3aed);
  opacity: 0.8;
}
</style>