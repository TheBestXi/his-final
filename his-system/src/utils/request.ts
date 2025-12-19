import axios from 'axios';
import { useUserStore } from '../store/user';
import { ElMessage } from 'element-plus';
import router from '../router/index';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000
});

// Request interceptor
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // Assuming 200 is success code based on doc
    if (res.code !== 200) {
      ElMessage.error(res.message || 'Error');
      
      // Handle 401 Token Expired
      if (res.code === 401) {
        const userStore = useUserStore();
        userStore.logout();
        router.push('/login');
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res.data; // Return business data directly
    }
  },
  (error) => {
    console.error('err' + error);
    ElMessage.error(error.message || 'Request Error');
    return Promise.reject(error);
  }
);

export default service;
