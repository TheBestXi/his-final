import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Layout from '../layout/index.vue';
import PatientLayout from '../layout/PatientLayout.vue';
import { useUserStore } from '../store/user';
import { ElMessage } from 'element-plus';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { hidden: true }
  },
  // Admin / Staff Routes
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { roles: ['doctor', 'admin'] },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'dashboard', roles: ['doctor', 'admin'] }
      }
    ]
  },
  {
    path: '/patient',
    component: Layout,
    redirect: '/patient/list',
    name: 'Patient',
    meta: { title: '患者管理', icon: 'user', roles: ['doctor', 'admin'] },
    children: [
      {
        path: 'list',
        name: 'PatientList',
        component: () => import('../views/patient/list.vue'),
        meta: { title: '患者列表' }
      },
      {
        path: 'detail/:id?',
        name: 'PatientDetail',
        component: () => import('../views/patient/detail.vue'),
        meta: { title: '患者详情' }
      }
    ]
  },
  {
    path: '/doctor',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'list',
        name: 'DoctorList',
        component: () => import('../views/doctor/list.vue'),
        meta: { title: '医生列表', icon: 'doctor' }
      }
    ]
  },
  {
    path: '/registration',
    component: Layout,
    meta: { title: '挂号收费', icon: 'money', roles: ['doctor', 'admin'] },
    children: [
      {
        path: 'create',
        name: 'RegistrationCreate',
        component: () => import('../views/registration/create.vue'),
        meta: { title: '挂号办理' }
      },
      {
        path: 'list',
        name: 'RegistrationList',
        component: () => import('../views/registration/list.vue'),
        meta: { title: '挂号记录' }
      }
    ]
  },
  {
    path: '/clinical',
    component: Layout,
    meta: { roles: ['doctor'] },
    children: [
      {
        path: 'workbench',
        name: 'ClinicalWorkbench',
        component: () => import('../views/clinical/workbench.vue'),
        meta: { title: '医生工作台', icon: 'clinical' }
      }
    ]
  },
  {
    path: '/pharmacy',
    component: Layout,
    meta: { title: '药房管理', icon: 'pharmacy', roles: ['admin', 'pharmacist'] },
    children: [
      {
        path: 'inventory',
        name: 'PharmacyInventory',
        component: () => import('../views/pharmacy/inventory.vue'),
        meta: { title: '药品库存' }
      },
      {
        path: 'dispense',
        name: 'PharmacyDispense',
        component: () => import('../views/pharmacy/dispense.vue'),
        meta: { title: '发药窗口' }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    meta: { roles: ['admin', 'cashier'] },
    children: [
      {
        path: 'charge',
        name: 'FinanceCharge',
        component: () => import('../views/finance/charge.vue'),
        meta: { title: '收费窗口', icon: 'finance' }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    meta: { roles: ['doctor', 'technician'] },
    children: [
      {
        path: 'list',
        name: 'TestList',
        component: () => import('../views/test/list.vue'),
        meta: { title: '检查检验', icon: 'test' }
      }
    ]
  },
  
  // Patient Portal Routes
  {
    path: '/patient-portal',
    component: PatientLayout,
    redirect: '/patient-portal/dashboard',
    meta: { roles: ['patient'] },
    children: [
      {
        path: 'dashboard',
        name: 'PatientDashboard',
        component: () => import('../views/patient-portal/dashboard.vue'),
        meta: { title: '患者首页' }
      },
      {
        path: 'booking',
        name: 'PatientBooking',
        component: () => import('../views/patient-portal/booking.vue'),
        meta: { title: '预约挂号' }
      },
      {
        path: 'appointments',
        name: 'PatientAppointments',
        component: () => import('../views/patient-portal/appointments.vue'),
        meta: { title: '我的挂号' }
      },
      {
        path: 'profile',
        name: 'PatientProfile',
        component: () => import('../views/patient-portal/profile.vue'),
        meta: { title: '个人档案' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();
  const token = userStore.token;
  const userRole = userStore.userInfo?.role;

  if (to.path === '/login') {
    if (token) {
      // Already logged in
      if (userRole === 'patient') {
        next('/patient-portal/dashboard');
      } else {
        next('/');
      }
    } else {
      next();
    }
  } else {
    if (!token) {
      next('/login');
    } else {
      // Check permissions
      if (to.meta.roles && Array.isArray(to.meta.roles)) {
        if (to.meta.roles.includes(userRole)) {
          next();
        } else {
          ElMessage.error('无权访问该页面');
          // Redirect to appropriate home based on role
          if (userRole === 'patient') {
            next('/patient-portal/dashboard');
          } else {
            next('/');
          }
        }
      } else {
        // No roles defined means public or accessible to authenticated users
        next();
      }
    }
  }
});

export default router;
