<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :collapse="isCollapse"
      unique-opened
      router
    >
      <el-menu-item index="/dashboard">
        <el-icon><Odometer /></el-icon>
        <template #title>仪表盘</template>
      </el-menu-item>

      <el-sub-menu index="/patient">
        <template #title>
          <el-icon><User /></el-icon>
          <span>患者管理</span>
        </template>
        <el-menu-item index="/patient/list">患者列表</el-menu-item>
        <el-menu-item index="/patient/detail">患者建档</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/doctor/list">
        <el-icon><Avatar /></el-icon>
        <template #title>医生管理</template>
      </el-menu-item>

      <el-sub-menu index="/registration">
        <template #title>
          <el-icon><Ticket /></el-icon>
          <span>挂号收费</span>
        </template>
        <el-menu-item index="/registration/create">挂号办理</el-menu-item>
        <el-menu-item index="/registration/list">挂号记录</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/clinical/workbench">
        <el-icon><Monitor /></el-icon>
        <template #title>医生工作台</template>
      </el-menu-item>

      <el-sub-menu index="/pharmacy">
        <template #title>
          <el-icon><FirstAidKit /></el-icon>
          <span>药房管理</span>
        </template>
        <el-menu-item index="/pharmacy/inventory">药品库存</el-menu-item>
        <el-menu-item index="/pharmacy/dispense">发药窗口</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/finance/charge">
        <el-icon><Money /></el-icon>
        <template #title>财务管理</template>
      </el-menu-item>

      <el-menu-item index="/test/list">
        <el-icon><Files /></el-icon>
        <template #title>检查检验</template>
      </el-menu-item>

    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '../store/app';
import { Odometer, User, Avatar, Ticket, Monitor, FirstAidKit, Money, Files } from '@element-plus/icons-vue';

const route = useRoute();
const appStore = useAppStore();

const activeMenu = computed(() => route.path);
const isCollapse = computed(() => !appStore.sidebar.opened);
</script>

<style lang="scss" scoped>
.el-menu {
  border: none;
  height: 100%;
  width: 100%;
}
.scrollbar-wrapper {
  height: 100%;
  overflow-x: hidden !important;
}
</style>
