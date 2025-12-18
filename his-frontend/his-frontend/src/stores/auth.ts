import { defineStore } from 'pinia'
import type { UserRole } from '@/router'

type AuthUser = {
  username: string
  displayName: string
  role: UserRole
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
    role: (s) => s.user?.role
  },
  actions: {
    async login(payload: { username: string; password: string }) {
      const username = payload.username.trim()
      const password = payload.password

      const allow =
        (username === 'admin' && password === 'admin') ||
        (username === 'outpatient' && password === 'outpatient') ||
        (username === 'doctor' && password === 'doctor') ||
        (username === 'pharmacy' && password === 'pharmacy') ||
        (username === 'finance' && password === 'finance') ||
        (username === 'tech' && password === 'tech')

      if (!allow) {
        throw new Error('用户名或密码错误')
      }

      const roleMap: Record<string, UserRole> = {
        admin: 'ADMIN',
        outpatient: 'OUTPATIENT',
        doctor: 'DOCTOR',
        pharmacy: 'PHARMACY',
        finance: 'FINANCE',
        tech: 'TECH'
      }

      const role = roleMap[username] || 'ADMIN'

      const displayName =
        role === 'ADMIN'
          ? '管理员'
          : role === 'OUTPATIENT'
            ? '挂号/收费'
            : role === 'DOCTOR'
              ? '医生'
              : role === 'PHARMACY'
                ? '药房'
                : role === 'FINANCE'
                  ? '财务'
                  : '检查检验'

      const user: AuthUser = { username, displayName, role }
      const token = `mock-${role}-${Date.now()}`

      this.token = token
      this.user = user
      localStorage.setItem(TOKEN_KEY, token)
      writeUser(user)
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem(TOKEN_KEY)
      writeUser(null)
    }
  }
})

