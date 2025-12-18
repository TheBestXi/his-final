import axios from 'axios'
<<<<<<< HEAD
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

const service: AxiosInstance = axios.create({
=======
import { ElMessage } from 'element-plus'

const service = axios.create({
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 5000
})

service.interceptors.request.use(
  (config) => {
<<<<<<< HEAD
    const token = localStorage.getItem('his_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
=======
    // Add token here if needed
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
<<<<<<< HEAD
  (response: AxiosResponse) => {
=======
  (response) => {
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
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

<<<<<<< HEAD
// Wrapper to type the return value correctly (since interceptor unwraps it)
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service.request<any, T>(config)
}

export default request
=======
export default service
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
