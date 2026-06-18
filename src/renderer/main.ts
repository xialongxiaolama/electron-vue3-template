import { createApp } from 'vue'
import '@renderer/assets/styles/style.css'
import router from './router'
import App from './App.vue'
import pinia from '@renderer/store/index'
import i18n from './i18n'
import PrimeVue from "primevue/config";
import ToastService from 'primevue/toastservice';
import Aura from "@primevue/themes/aura";
import ConfirmationService from 'primevue/confirmationservice';

// 导入svg 引入文件
import 'virtual:svg-icons-register'
import 'uno.css'
import 'virtual:uno.css'


const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(pinia)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  },
  csp: {
    nonce: '...'
  }
})
import('@renderer/usbPlugins/USBManage.ts')

app.use(ConfirmationService)
app.use(ToastService)
// 加载完成清除preload中加载等待
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})

