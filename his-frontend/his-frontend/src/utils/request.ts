import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 5000
})

service.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // If using mock, sometimes it returns data directly or wrapped
    if (res.code === 200) {
      return res.data
    }
    // Allow direct return for some mock scenarios if strict structure isn't followed
    if (import.meta.env.VITE_USE_MOCK === 'true' && res.code === undefined) {
      return res
    }
    
    ElMessage.error(res.message || 'Error')
    return Promise.reject(new Error(res.message || 'Error'))
  },
  (error) => {
    ElMessage.error(error.message || 'Request Failed')
    return Promise.reject(error)
  }
)

// Wrapper to type the return value correctly (since interceptor unwraps it)
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service.request<any, T>(config)
}

export default request
