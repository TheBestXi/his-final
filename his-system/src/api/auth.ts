import request from '../utils/request';
import type { LoginResult, ApiResponse } from './types';

export function login(data: { phone: string; password: string }) {
  return request<ApiResponse<LoginResult>>({
    url: '/auth/login',
    method: 'post',
    data
  });
}
