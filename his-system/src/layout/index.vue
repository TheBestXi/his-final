<template>
  <div class="app-wrapper">
    <div class="sidebar-container">
      <Sidebar />
    </div>
    <div class="main-container">
      <div class="header">
        <Header />
      </div>
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
    <AiAssistant />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '../store/app';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import AiAssistant from '../components/AiAssistant/index.vue';

const appStore = useAppStore();
const sidebarWidth = computed(() => appStore.sidebar.opened ? '210px' : '64px');
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
}

.sidebar-container {
  width: v-bind(sidebarWidth);
  height: 100%;
  background-color: #304156;
  overflow: hidden;
  transition: width 0.3s;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
}

.app-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5;
}

/* Transitions */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
