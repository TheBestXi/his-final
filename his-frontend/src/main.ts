import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
<<<<<<< HEAD
import { useAuthStore } from './stores/auth'
=======
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
<<<<<<< HEAD

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

=======
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
app.use(router)
app.use(ElementPlus)

app.mount('#app')
