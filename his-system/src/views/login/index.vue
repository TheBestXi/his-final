<template>
  <div class="login-container">
    <div class="login-card">
      <div class="title">
        <h2>HIS 医院信息系统</h2>
      </div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="0">
        <el-form-item prop="role">
          <el-radio-group v-model="loginForm.role" style="width: 100%; display: flex; justify-content: center;">
            <el-radio-button label="doctor">医护人员</el-radio-button>
            <el-radio-button label="patient">患者</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" placeholder="手机号" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" :prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" class="login-btn" @click="handleLogin">
            {{ loginForm.role === 'patient' ? '登录/注册' : '登录' }}
          </el-button>
        </el-form-item>
        <div class="tips" v-if="loginForm.role === 'doctor'">
          <span>默认账号: 任意手机号 &nbsp;&nbsp; 密码: 任意密码</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
// import { login } from '../../api/auth';
import { ElMessage, type FormInstance } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();

const loginForm = reactive({
  phone: '',
  password: '',
  role: 'doctor' // Default to doctor
});

const loginRules = {
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const loginFormRef = ref<FormInstance>();
const loading = ref(false);

const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // Mock login for demonstration if backend is not ready
        // In real scenario, use: const res = await login(loginForm);
        
        // Simulating API call for now since I don't have the backend running
        // Remove this mock block and uncomment real call when connected
        /*
        const res = await login(loginForm);
        userStore.setToken(res.data.token);
        userStore.setUserInfo(res.data.userInfo);
        */
        
        // Mock behavior
        console.log('Login with:', loginForm);
        // Simulate success
        setTimeout(() => {
           userStore.setToken('mock-token-' + Date.now());
           userStore.setUserInfo({
             id: 1,
             username: loginForm.phone,
             name: loginForm.role === 'patient' ? '张三(患者)' : '测试医生',
             role: loginForm.role
           });
           ElMessage.success('登录成功');
           if (loginForm.role === 'patient') {
             router.push('/patient-portal/dashboard');
           } else {
             router.push('/dashboard');
           }
           loading.value = false;
        }, 1000);

      } catch (error) {
        console.error(error);
        loading.value = false;
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1f4037 0%, #99f2c8 100%);
  background-size: cover;
  
  .login-card {
    width: 420px;
    padding: 50px 35px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    
    .title {
      text-align: center;
      margin-bottom: 40px;
      h2 {
        margin: 0;
        color: #1f2d3d;
        font-weight: 600;
        font-size: 24px;
        letter-spacing: 1px;
      }
    }
    
    .login-btn {
      width: 100%;
      padding: 20px 0;
      font-size: 16px;
      letter-spacing: 2px;
    }

    .tips {
      margin-top: 15px;
      font-size: 12px;
      color: #909399;
      text-align: center;
    }
  }
}
</style>
