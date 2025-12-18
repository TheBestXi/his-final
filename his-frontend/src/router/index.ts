import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

<<<<<<< HEAD
export type UserRole = 'ADMIN' | 'OUTPATIENT' | 'DOCTOR' | 'PHARMACY' | 'FINANCE' | 'TECH'

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
=======
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: 'Dashboard' }
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      },
      // Outpatient
      {
        path: 'outpatient/registration',
        name: 'Registration',
        component: () => import('../views/outpatient/registration/index.vue'),
<<<<<<< HEAD
        meta: { title: '挂号办理', requiresAuth: true, roles: ['ADMIN', 'OUTPATIENT'] }
=======
        meta: { title: '挂号办理' }
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      },
      {
        path: 'outpatient/history',
        name: 'RegistrationHistory',
        component: () => import('../views/outpatient/history/index.vue'),
<<<<<<< HEAD
        meta: { title: '挂号记录', requiresAuth: true, roles: ['ADMIN', 'OUTPATIENT'] }
=======
        meta: { title: '挂号记录' }
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      },
      // Patient
      {
        path: 'patient',
        name: 'Patient',
        component: () => import('../views/patient/index.vue'),
<<<<<<< HEAD
        meta: { title: '患者管理', requiresAuth: true, roles: ['ADMIN', 'OUTPATIENT', 'DOCTOR'] }
=======
        meta: { title: '患者管理' }
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      },
      // Doctor
      {
        path: 'doctor',
        name: 'DoctorStation',
        component: () => import('../views/doctor/index.vue'),
<<<<<<< HEAD
        meta: { title: '医生工作台', requiresAuth: true, roles: ['ADMIN', 'DOCTOR'] }
=======
        meta: { title: '医生工作台' }
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      },
      // Tech
      {
        path: 'tech',
        name: 'Tech',
        component: () => import('../views/tech/index.vue'),
<<<<<<< HEAD
        meta: { title: '检查检验', requiresAuth: true, roles: ['ADMIN', 'TECH', 'DOCTOR'] }
=======
        meta: { title: '检查检验' }
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      },
      // Pharmacy
      {
        path: 'pharmacy/dispensing',
        name: 'Dispensing',
        component: () => import('../views/pharmacy/dispensing/index.vue'),
<<<<<<< HEAD
        meta: { title: '药房发药', requiresAuth: true, roles: ['ADMIN', 'PHARMACY'] }
=======
        meta: { title: '药房发药' }
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      },
      {
        path: 'pharmacy/inventory',
        name: 'Inventory',
        component: () => import('../views/pharmacy/inventory/index.vue'),
<<<<<<< HEAD
        meta: { title: '药品库存', requiresAuth: true, roles: ['ADMIN', 'PHARMACY'] }
=======
        meta: { title: '药品库存' }
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      },
      // Finance
      {
        path: 'finance',
        name: 'Finance',
        component: () => import('../views/finance/index.vue'),
<<<<<<< HEAD
        meta: { title: '收费管理', requiresAuth: true, roles: ['ADMIN', 'FINANCE', 'OUTPATIENT'] }
=======
        meta: { title: '收费管理' }
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
