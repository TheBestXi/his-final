<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <el-card class="w-full max-w-md">
      <template #header>
        <div class="font-bold text-lg">登录</div>
      </template>

      <el-form :model="form" label-width="80px" @keyup.enter="onSubmit">
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>

        <el-form-item>
          <div class="flex flex-col w-full gap-2">
            <el-button type="primary" :loading="loading" @click="onSubmit">登录</el-button>
            <div class="text-right">
              <el-button link type="primary" @click="showRegister = true">去注册建档</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Register Dialog -->
    <el-dialog v-model="showRegister" title="注册建档" width="500px">
      <el-form :model="regForm" label-width="80px" :rules="rules" ref="regFormRef">
        <el-form-item label="手机号" prop="phone" required>
          <el-input v-model="regForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="密码" prop="password" required>
          <el-input v-model="regForm.password" type="password" show-password placeholder="设置登录密码" />
        </el-form-item>
        <el-form-item label="姓名" prop="name" required>
          <el-input v-model="regForm.name" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender" required>
          <el-radio-group v-model="regForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age" required>
          <el-input v-model.number="regForm.age" placeholder="请输入年龄" type="number" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="regForm.address" placeholder="请输入居住地址" />
        </el-form-item>
        <el-form-item label="过敏史" prop="allergy">
          <el-input v-model="regForm.allergy" type="textarea" placeholder="无过敏史请填“无”" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRegister = false">取消</el-button>
        <el-button type="primary" :loading="regLoading" @click="onRegister">注册建档</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import request from '@/utils/request'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const form = reactive({
  phone: '',
  password: ''
})

const showRegister = ref(false)
const regLoading = ref(false)
const regFormRef = ref<FormInstance>()

const regForm = reactive({
  phone: '',
  password: '',
  name: '',
  gender: 1,
  age: 30,
  address: '',
  allergy: '无'
})

const rules = reactive<FormRules>({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '年龄必须为数字', trigger: 'blur' }
  ]
})

const onSubmit = async () => {
  if (!form.phone || !form.password) {
    ElMessage.warning('请输入手机号和密码')
    return
  }

  loading.value = true
  try {
    // Real API Login
    const res: any = await request({
       url: '/auth/login',
       method: 'post',
       data: {
         phone: form.phone,
         password: form.password
       }
    })
    
    // Update Store
    auth.login({
        userId: res.userId,
        pid: res.pid,
        phone: res.phone,
        name: res.name,
        token: res.token,
        role: 'PATIENT',
        displayName: res.name
    })

    ElMessage.success('登录成功')

    // Check Filing Status
    if (!res.pid || res.pid === 0) {
       ElMessage.warning('检测到您尚未建档，请先完善信息')
       await router.replace('/patient/create-file')
    } else {
       await router.replace('/outpatient/registration')
    }

  } catch (e: any) {
    // ElMessage.error(e?.message || '登录失败') // Handled by interceptor
    console.error(e)
  } finally {
    loading.value = false
  }
}

const onRegister = async () => {
    if (!regFormRef.value) return
    
    await regFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        regLoading.value = true
        try {
            await request({
                url: '/auth/register',
                method: 'post',
                data: regForm
            })
            ElMessage.success('注册建档成功，请登录')
            showRegister.value = false
        } catch (e: any) {
            ElMessage.error(e?.message || '注册失败')
        } finally {
            regLoading.value = false
        }
      }
    })
}
</script>
