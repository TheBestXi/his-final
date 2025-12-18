<template>
  <el-container class="h-screen w-full">
    <el-aside :width="isCollapse ? '64px' : '240px'" class="transition-all duration-300 bg-white border-r">
      <div class="h-16 flex items-center justify-center border-b">
        <span class="text-xl font-bold text-primary" v-if="!isCollapse">HIS System</span>
        <span class="text-xl font-bold text-primary" v-else>HIS</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="border-none"
        :collapse="isCollapse"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <template #title>首页概览</template>
        </el-menu-item>

        <el-sub-menu v-if="menu.outpatient.length" index="/outpatient">
          <template #title>
            <el-icon><FirstAidKit /></el-icon>
            <span>门诊工作台</span>
          </template>
          <el-menu-item v-for="it in menu.outpatient" :key="it.path" :index="it.path">{{ it.title }}</el-menu-item>
        </el-sub-menu>

        <el-menu-item v-if="menu.patient" index="/patient">
          <el-icon><User /></el-icon>
          <template #title>患者管理</template>
        </el-menu-item>

        <el-menu-item v-if="menu.doctor" index="/doctor">
          <el-icon><Monitor /></el-icon>
          <template #title>医生工作台</template>
        </el-menu-item>
        
        <el-menu-item v-if="menu.tech" index="/tech">
          <el-icon><Aim /></el-icon>
          <template #title>检查检验</template>
        </el-menu-item>

        <el-sub-menu v-if="menu.pharmacy.length" index="/pharmacy">
          <template #title>
            <el-icon><Box /></el-icon>
            <span>药房工作台</span>
          </template>
          <el-menu-item v-for="it in menu.pharmacy" :key="it.path" :index="it.path">{{ it.title }}</el-menu-item>
        </el-sub-menu>

        <el-menu-item v-if="menu.finance" index="/finance">
          <el-icon><Money /></el-icon>
          <template #title>收费管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="bg-white border-b h-16 flex items-center justify-between px-4">
        <div class="flex items-center">
          <el-button link @click="toggleCollapse">
            <el-icon :size="20"><Fold v-if="!isCollapse"/><Expand v-else/></el-icon>
          </el-button>
          <el-breadcrumb class="ml-4" separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="flex items-center space-x-4">
          <el-dropdown trigger="click">
            <span class="flex items-center space-x-2 cursor-pointer">
              <el-avatar :size="32" class="bg-primary text-white">{{ auth.user?.displayName?.slice(0, 1) || '医' }}</el-avatar>
              <span class="text-sm font-medium">{{ auth.user?.displayName || '未登录' }}</span>
              <span class="text-xs text-gray-500">({{ roleName }})</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="bg-gray-50 p-4">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DataBoard,
  FirstAidKit,
  Monitor,
  Box,
  Money,
  Fold,
  Expand,
  User,
  Aim
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const isCollapse = ref(false)

const activeMenu = computed(() => route.path)
const currentRouteName = computed(() => route.meta.title || '首页概览')

const roleName = computed(() => {
  const map: Record<string, string> = {
    ADMIN: '管理员',
    OUTPATIENT: '挂号/收费',
    DOCTOR: '医生',
    PHARMACY: '药房',
    FINANCE: '财务',
    TECH: '检查检验',
    PATIENT: '患者'
  }
  return auth.role ? map[auth.role] || auth.role : '未登录'
})

const menu = computed(() => {
  const role = auth.role
  const isAdmin = role === 'ADMIN'
  const has = (roles: string[]) => isAdmin || (!!role && roles.includes(role))

  return {
    outpatient: [
      { path: '/outpatient/registration', title: '挂号办理', roles: ['ADMIN', 'OUTPATIENT', 'PATIENT'] },
      { path: '/outpatient/history', title: '挂号记录', roles: ['ADMIN', 'OUTPATIENT', 'PATIENT'] }
    ].filter(i => has(i.roles)),
    patient: has(['ADMIN', 'OUTPATIENT', 'DOCTOR']),
    doctor: has(['ADMIN', 'DOCTOR']),
    tech: has(['ADMIN', 'TECH', 'DOCTOR']),
    pharmacy: [
      { path: '/pharmacy/dispensing', title: '药房发药', roles: ['ADMIN', 'PHARMACY'] },
      { path: '/pharmacy/inventory', title: '药品库存', roles: ['ADMIN', 'PHARMACY'] }
    ].filter(i => has(i.roles)),
    finance: has(['ADMIN', 'FINANCE', 'OUTPATIENT'])
  }
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const logout = async () => {
  auth.logout()
  await router.push('/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
