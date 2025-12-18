import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.public) {
    return true
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }

  if (to.meta.roles && auth.role && auth.role !== 'ADMIN') {
    if (!to.meta.roles.includes(auth.role)) {
      return { path: '/dashboard' }
    }
  }

  return true
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : 'HIS'
  document.title = `${title} - HIS`
})

app.use(router)
app.use(ElementPlus)

app.mount('#app')
