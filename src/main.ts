import { createApp } from 'vue'
import { devtools } from '@vue/devtools'
import '@/assets/styles/style.css'
import router from './router'
import App from './App.vue'
import pinia from '@/store/index'
import i18n from './i18n'
import PrimeVue from "primevue/config";
import ToastService from 'primevue/toastservice';
import Aura from "@primevue/themes/aura";
import ConfirmationService from 'primevue/confirmationservice';

// 导入svg 引入文件
import 'virtual:svg-icons-register'
import 'uno.css'
import 'virtual:uno.css'

// Make sure to invoke devtools connect function before creating Vue App, otherwise it might not work as expected.
const openState = sessionStorage.getItem('DEVTOOLS_STATE')
console.log(openState)
// TODO 监听工具初始化后连接
openState&&devtools.connect()

const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(pinia)
app.use(PrimeVue, {
  ripple: true, // 启用水波纹效果
  theme: {
    preset: Aura,
    options: {
        darkModeSelector: '.my-app-dark',
    }
  },
  csp: {
    nonce: '...'
  }
})
import('@/usbPlugins/USBManage')

app.use(ConfirmationService)
app.use(ToastService)
// 加载完成清除preload中加载等待
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})

