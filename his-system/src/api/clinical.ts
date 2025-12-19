import request from '../utils/request';
import type { ApiResponse, Appointment } from './types';

export function getMyQueue() {
  // Normally pass doctor ID, or backend infers from token
  return request<ApiResponse<Appointment[]>>({
    url: '/appointment/queue', // Mocked endpoint
    method: 'get'
  });
}

export function updateAppointmentStatus(id: number, status: number) {
  return request<ApiResponse<void>>({
    url: `/appointment/${id}/status`,
    method: 'put',
    params: { status }
  });
}

export function saveMedicalRecord(data: any) {
  return request<ApiResponse<void>>({
    url: '/medical-record',
    method: 'post',
    data
  });
}

export function savePrescription(data: any) {
  return request<ApiResponse<void>>({
    url: '/prescription',
    method: 'post',
    data
  });
}

export function saveTest(data: any) {
  return request<ApiResponse<void>>({
    url: '/test',
    method: 'post',
    data
  });
}
