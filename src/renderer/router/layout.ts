import type { RouteRecordRaw } from 'vue-router'

import Layout from '@renderer/layout/index.vue'
import Login from '@renderer/views/login/index.vue'

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
