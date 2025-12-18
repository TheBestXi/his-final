<template>
  <div class="max-w-2xl mx-auto py-8">
    <el-card>
      <template #header>
        <div class="font-bold text-lg text-center">完善患者档案</div>
        <div class="text-xs text-gray-500 text-center mt-2">为了您的就诊体验，请先完善个人基本信息</div>
      </template>
      
      <el-form :model="form" label-width="100px" ref="formRef" :rules="rules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入真实姓名" />
        </el-form-item>
        
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="0" :max="150" />
        </el-form-item>
        
        <el-form-item label="联系电话">
           <el-input v-model="phone" disabled />
           <div class="text-xs text-gray-400">手机号绑定账号，不可修改</div>
        </el-form-item>
        
        <el-form-item label="居住地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入居住地址" />
        </el-form-item>
        
        <el-form-item label="既往病史">
          <el-input v-model="form.medicalHistory" type="textarea" :rows="3" placeholder="如有既往病史请填写" />
        </el-form-item>
        
        <el-form-item label="过敏史">
          <el-input v-model="form.allergyHistory" type="textarea" :rows="3" placeholder="如有过敏史请填写" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" class="w-full" :loading="submitting" @click="onSubmit">提交并建档</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const auth = useAuthStore()
const submitting = ref(false)
const formRef = ref()

const phone = computed(() => auth.user?.phone || '')

const form = reactive({
  name: auth.user?.name || '',
  gender: 1,
  age: 30,
  address: '',
  medicalHistory: '',
  allergyHistory: ''
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }]
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        const res: any = await request({
            url: '/auth/create-file',
            method: 'post',
            data: form
        })
        
        // Update local user info
        auth.updateUser({
            pid: res.pid,
            name: res.name
        })
        
        ElMessage.success('建档成功')
        router.replace('/outpatient/registration')
      } catch (e: any) {
        ElMessage.error(e?.message || '建档失败')
      } finally {
        submitting.value = false
      }
    }
  })
}
</script>
