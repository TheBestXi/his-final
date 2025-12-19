<template>
  <div class="header-container">
    <div class="left">
      <el-icon 
        class="hamburger" 
        :class="{'is-active': sidebar.opened}" 
        @click="toggleSideBar"
      >
        <Expand v-if="!sidebar.opened" />
        <Fold v-else />
      </el-icon>
      
      <el-tooltip content="返回上一页" placement="bottom">
        <div v-if="showBack" class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回</span>
        </div>
      </el-tooltip>

      <span class="title">HIS 医院信息系统</span>
    </div>
    <div class="right">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ userStore.userInfo?.name || 'Admin' }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '../store/user';
import { useAppStore } from '../store/app';
import { useRouter, useRoute } from 'vue-router';
import { ArrowDown, Expand, Fold, ArrowLeft } from '@element-plus/icons-vue';

const userStore = useUserStore();
const appStore = useAppStore();
const router = useRouter();
const route = useRoute();

const sidebar = computed(() => appStore.sidebar);

const showBack = computed(() => route.path !== '/dashboard');

const goBack = () => {
  router.back();
};

const toggleSideBar = () => {
  appStore.toggleSidebar();
};

const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.logout();
    router.push('/login');
  }
};
</script>

<style lang="scss" scoped>
.header-container {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .title {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
    margin-left: 10px;
  }

  .hamburger {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 20px;
  }

  .back-btn {
    display: flex;
    align-items: center;
    margin-left: 15px;
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

  .left {
    display: flex;
    align-items: center;
  }


  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    display: flex;
    align-items: center;
  }
}
</style>
