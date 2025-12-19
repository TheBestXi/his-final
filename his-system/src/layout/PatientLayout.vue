<template>
  <div class="patient-layout">
    <header class="patient-header">
      <div class="header-content">
        <div class="left-container">
          <div v-if="showBack" class="back-btn" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            <span>返回</span>
          </div>
          <div class="logo">
            <span class="icon">🏥</span>
            <span class="text">HIS 患者服务平台</span>
          </div>
        </div>
        <div class="user-menu">
          <span class="username">欢迎您, {{ userStore.userInfo?.name }}</span>
          <el-button link type="primary" @click="handleLogout">退出</el-button>
        </div>
      </div>
    </header>
    <main class="patient-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '../store/user';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const showBack = computed(() => route.path !== '/patient-portal/dashboard');

const goBack = () => {
  router.back();
};

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<style lang="scss" scoped>
.patient-layout {
  min-height: 100vh;
  background-color: #f5f7fa;

  .patient-header {
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 100;

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;

      .left-container {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .back-btn {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #606266;
        font-size: 14px;
        transition: color 0.3s;
        
        &:hover {
          color: #409EFF;
        }

        .el-icon {
          margin-right: 4px;
          font-size: 16px;
        }
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 20px;
        font-weight: bold;
        color: #409EFF;
      }

      .user-menu {
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 14px;
        color: #606266;
      }
    }
  }

  .patient-main {
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 20px;
  }
}
</style>
