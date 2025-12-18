import request from '@/utils/request'
<<<<<<< HEAD
import type { MedicalRecordDTO, PrescriptionDTO } from './types'

export type { MedicalRecordDTO, PrescriptionDTO }

// Frontend Interfaces
=======

>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
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

<<<<<<< HEAD
export interface MedicalRecord extends MedicalRecordDTO {
  recordId?: number
  patientId: number // Alias for pid
}

export interface PrescriptionItem {
  medicineId?: number // Added for backend link
=======
export interface MedicalRecord {
  recordId?: number
  patientId: number
  doctorId: number
  chiefComplaint: string // chief_complaint
  presentIllness: string // present_illness
  physicalExamination: string // physical_examination
  preliminaryDiagnosis: string // preliminary_diagnosis
  createdAt?: string
}

export interface PrescriptionItem {
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
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
<<<<<<< HEAD
  appointmentId?: number // Added
  items: PrescriptionItem[]
=======
  items: PrescriptionItem[] // Simplified representation for frontend
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
  totalCost: number
  createdAt?: string
}

export interface LabTest {
  testId?: number
  patientId: number
<<<<<<< HEAD
  appointmentId?: number
=======
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
  testType: string
  testDate: string
  result?: string
  status: number // 0: Pending, 1: Completed
<<<<<<< HEAD
  testFee?: number
}

// APIs

export const getPatientQueue = () => {
  // Backend missing generic queue endpoint, usually filtered listByDoctor
  return request({
    url: '/api/doctor/queue', // Keep as Mock/Composite for now
=======
}

export const getPatientQueue = () => {
  return request({
    url: '/api/doctor/queue',
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
    method: 'get'
  })
}

export const updateStatus = (appointmentId: number, status: number) => {
  return request({
    url: `/api/appointment/${appointmentId}/status`,
    method: 'put',
    params: { status }
  })
}

export const saveMedicalRecord = (data: MedicalRecord) => {
<<<<<<< HEAD
  // Adapter
  const payload: MedicalRecordDTO = {
    ...data,
    pid: data.patientId,
    appointmentId: data.appointmentId || 0, // Should be passed from frontend
    // map other fields if needed
  }
  return request<MedicalRecordDTO>({
    url: '/api/medical-record',
    method: 'post',
    data: payload
=======
  return request({
    url: '/api/doctor/record',
    method: 'post',
    data
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
  })
}

export const getMedicalHistory = (patientId: number) => {
  return request({
<<<<<<< HEAD
    url: `/api/medical-record/patient/${patientId}`,
=======
    url: `/api/doctor/history/${patientId}`,
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
    method: 'get'
  })
}

export const savePrescription = (data: Prescription) => {
<<<<<<< HEAD
  // Note: Backend currently supports single item creation via DTO.
  // We send the whole object to Mock, but for real backend we might need a batch endpoint.
  return request({
    url: '/api/prescription',
=======
  return request({
    url: '/api/doctor/prescription',
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
    method: 'post',
    data
  })
}

export const applyLabTest = (data: LabTest) => {
<<<<<<< HEAD
  // Adapter
  const payload: any = {
    pid: data.patientId,
    appointmentId: data.appointmentId,
    testType: 1, // Need mapping string->int if backend uses int enum
    testFee: 100 // Mock fee
  }
  return request({
    url: '/api/test',
    method: 'post',
    data: payload
=======
  return request({
    url: '/api/doctor/lab',
    method: 'post',
    data
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
  })
}

export const getDoctorWorkload = () => {
  return request({
    url: '/api/statistics/doctor/workload',
    method: 'get'
  })
}
