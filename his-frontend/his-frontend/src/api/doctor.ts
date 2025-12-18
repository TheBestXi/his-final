import request from '@/utils/request'
import type { MedicalRecordDTO, PrescriptionDTO } from './types'

export type { MedicalRecordDTO, PrescriptionDTO }

// Frontend Interfaces
export interface QueueItem {
  appointmentId: number
  patientId: number
  patientName: string
  gender: number
  age: number
  status: number // 1: Waiting, 2: In Progress, 3: Completed
  visitTime: string
  medicalHistory?: string
  allergyHistory?: string
}

export interface MedicalRecord extends MedicalRecordDTO {
  recordId?: number
  patientId: number // Alias for pid
}

export interface PrescriptionItem {
  medicineId?: number // Added for backend link
  medicineName: string
  dosage: string
  quantity: number
  price: number
  totalCost: number
}

export interface Prescription {
  prescriptionId?: number
  patientId: number
  doctorId: number
  appointmentId?: number // Added
  items: PrescriptionItem[]
  totalCost: number
  createdAt?: string
}

export interface LabTest {
  testId?: number
  patientId: number
  appointmentId?: number
  testType: string
  testDate: string
  result?: string
  status: number // 0: Pending, 1: Completed
  testFee?: number
}

// APIs

export const getPatientQueue = () => {
  // Backend missing generic queue endpoint, usually filtered listByDoctor
  return request({
    url: '/doctor/queue', // Keep as Mock/Composite for now
    method: 'get'
  })
}

export const updateStatus = (appointmentId: number, status: number) => {
  return request({
    url: `/appointment/${appointmentId}/status`,
    method: 'put',
    params: { status }
  })
}

export const saveMedicalRecord = (data: MedicalRecord) => {
  // Adapter
  const payload: MedicalRecordDTO = {
    ...data,
    pid: data.patientId,
    appointmentId: data.appointmentId || 0, // Should be passed from frontend
    // map other fields if needed
  }
  return request<MedicalRecordDTO>({
    url: '/medical-record',
    method: 'post',
    data: payload
  })
}

export const getMedicalHistory = (patientId: number) => {
  return request({
    url: `/medical-record/patient/${patientId}`,
    method: 'get'
  })
}

export const savePrescription = (data: Prescription) => {
  // Note: Backend currently supports single item creation via DTO.
  // We send the whole object to Mock, but for real backend we might need a batch endpoint.
  return request({
    url: '/prescription',
    method: 'post',
    data
  })
}

export const applyLabTest = (data: LabTest) => {
  // Adapter
  const payload: any = {
    pid: data.patientId,
    appointmentId: data.appointmentId,
    testType: 1, // Need mapping string->int if backend uses int enum
    testFee: 100 // Mock fee
  }
  return request({
    url: '/test',
    method: 'post',
    data: payload
  })
}

export const getDoctorWorkload = () => {
  return request({
    url: '/statistics/doctor/workload',
    method: 'get'
  })
}
