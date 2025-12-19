import request from '../utils/request';
import type { ApiResponse, Patient } from './types';

export function getPatientList(params: { name?: string }) {
  return request<ApiResponse<Patient[]>>({
    url: '/patient/search',
    method: 'get',
    params
  });
}

export function getPatientDetail(id: number) {
  return request<ApiResponse<Patient>>({
    url: `/patient/${id}`,
    method: 'get'
  });
}

export function savePatient(data: Patient) {
  return request<ApiResponse<void>>({
    url: '/patient',
    method: 'post',
    data
  });
}
