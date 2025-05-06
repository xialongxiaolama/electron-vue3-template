import type { RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'
import Login from '@/views/login/index.vue'

const router: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    redirect: '/home',
    component: Layout,
    children: [],
  },
  {
    path:'/login',
    name:'login',
    component: Login
  }
]

export default router
