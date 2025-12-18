import { defineStore } from 'pinia'
import type { UserRole } from '@/router'
import request from '@/utils/request'

type AuthUser = {
  userId: number
  pid: number
  phone: string
  name: string
  role: UserRole
  displayName: string
}

const TOKEN_KEY = 'his_token'
const USER_KEY = 'his_user'

const readUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

const writeUser = (user: AuthUser | null) => {
  if (!user) {
    localStorage.removeItem(USER_KEY)
    return
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || '',
    user: readUser() as AuthUser | null
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
    role: (s) => s.user?.role,
    isFiled: (s) => !!s.user?.pid && s.user.pid > 0
  },
  actions: {
    login(userData: User) {
      this.user = userData
      this.token = userData.token || ''
      this.role = 'PATIENT' // Default to Patient for this flow
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    
    updateUser(userData: User) {
        this.user = { ...this.user, ...userData }
        localStorage.setItem('user', JSON.stringify(this.user))
    },
    
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem(TOKEN_KEY)
      writeUser(null)
    }
  }
})
