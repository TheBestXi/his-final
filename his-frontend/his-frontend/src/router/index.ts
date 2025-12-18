import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

export type UserRole = 'ADMIN' | 'OUTPATIENT' | 'DOCTOR' | 'PHARMACY' | 'FINANCE' | 'TECH' | 'PATIENT'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    public?: boolean
    requiresAuth?: boolean
    roles?: UserRole[]
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '首页概览', requiresAuth: true, roles: ['ADMIN', 'OUTPATIENT', 'DOCTOR', 'PHARMACY', 'FINANCE', 'TECH'] }
      },
      // Outpatient
      {
        path: 'outpatient/registration',
        name: 'Registration',
        component: () => import('../views/outpatient/registration/index.vue'),
        meta: { title: '挂号办理', requiresAuth: true, roles: ['ADMIN', 'OUTPATIENT', 'PATIENT'] }
      },
      {
        path: 'outpatient/history',
        name: 'RegistrationHistory',
        component: () => import('../views/outpatient/history/index.vue'),
        meta: { title: '挂号记录', requiresAuth: true, roles: ['ADMIN', 'OUTPATIENT', 'PATIENT'] }
      },
      // Patient
      {
        path: 'patient',
        name: 'Patient',
        component: () => import('../views/patient/index.vue'),
        meta: { title: '患者管理', requiresAuth: true, roles: ['ADMIN', 'OUTPATIENT', 'DOCTOR'] }
      },
      // Create File (New)
      {
        path: 'patient/create-file',
        name: 'CreateFile',
        component: () => import('../views/patient/create-file/index.vue'),
        meta: { title: '患者建档', requiresAuth: true, roles: ['ADMIN', 'OUTPATIENT', 'DOCTOR', 'PHARMACY', 'FINANCE', 'TECH', 'PATIENT'] }
      },
      // Doctor
      {
        path: 'doctor',
        name: 'DoctorStation',
        component: () => import('../views/doctor/index.vue'),
        meta: { title: '医生工作台', requiresAuth: true, roles: ['ADMIN', 'DOCTOR'] }
      },
      // Tech
      {
        path: 'tech',
        name: 'Tech',
        component: () => import('../views/tech/index.vue'),
        meta: { title: '检查检验', requiresAuth: true, roles: ['ADMIN', 'TECH', 'DOCTOR'] }
      },
      // Pharmacy
      {
        path: 'pharmacy/dispensing',
        name: 'Dispensing',
        component: () => import('../views/pharmacy/dispensing/index.vue'),
        meta: { title: '药房发药', requiresAuth: true, roles: ['ADMIN', 'PHARMACY'] }
      },
      {
        path: 'pharmacy/inventory',
        name: 'Inventory',
        component: () => import('../views/pharmacy/inventory/index.vue'),
        meta: { title: '药品库存', requiresAuth: true, roles: ['ADMIN', 'PHARMACY'] }
      },
      // Finance
      {
        path: 'finance',
        name: 'Finance',
        component: () => import('../views/finance/index.vue'),
        meta: { title: '收费管理', requiresAuth: true, roles: ['ADMIN', 'FINANCE', 'OUTPATIENT'] }
      }
    ]
  }
]

import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !auth.token) {
    return next('/login')
  }

  // Check Role
  if (to.meta.roles && auth.role) {
      if (!(to.meta.roles as string[]).includes(auth.role)) {
          ElMessage.error('无权访问')
          return next(from.path || '/')
      }
  }

  // Patient Filing Check
  if (auth.role === 'PATIENT' && to.path !== '/login') {
      const isFiled = auth.user?.pid && auth.user.pid > 0
      if (!isFiled && to.path !== '/patient/create-file') {
          ElMessage.warning('请先完善患者档案')
          return next('/patient/create-file')
      }
      if (isFiled && to.path === '/patient/create-file') {
          return next('/outpatient/registration')
      }
  }

  next()
})

export default router
