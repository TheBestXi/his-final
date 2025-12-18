<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <el-card class="w-full max-w-md">
      <template #header>
        <div class="font-bold text-lg">HIS 登录</div>
      </template>

      <el-form :model="form" label-width="80px" @keyup.enter="onSubmit">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password autocomplete="current-password" />
        </el-form-item>

        <el-form-item>
          <div class="flex flex-col w-full gap-2">
            <el-button type="primary" :loading="loading" @click="onSubmit">登录</el-button>
            <div class="text-xs text-gray-500">
              演示账号：admin / outpatient / doctor / pharmacy / finance / tech（密码同用户名）
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const loading = ref(false)
const form = reactive({
  username: 'admin',
  password: 'admin'
})

const defaultHomeByRole = () => {
  const role = auth.role
  if (role === 'DOCTOR') return '/doctor'
  if (role === 'PHARMACY') return '/pharmacy/dispensing'
  if (role === 'FINANCE') return '/finance'
  if (role === 'OUTPATIENT') return '/outpatient/registration'
  if (role === 'TECH') return '/tech'
  return '/dashboard'
}

const onSubmit = async () => {
  loading.value = true
  try {
    await auth.login({ username: form.username, password: form.password })
    ElMessage.success('登录成功')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
    await router.replace(redirect || defaultHomeByRole())
  } catch (e: any) {
    ElMessage.error(e?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

