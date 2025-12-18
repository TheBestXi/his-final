import request from '@/utils/request'
<<<<<<< HEAD
import type { PatientDTO, AppointmentDTO, DoctorDTO } from './types'

// Re-export types for views
export type { PatientDTO, AppointmentDTO, DoctorDTO }
export type Doctor = DoctorDTO // Alias for backward compatibility

// Frontend compatibility interfaces (Adapter Layer)
export interface Patient extends PatientDTO {
  patientId?: number // Alias for pid
  allergyHistory?: string // Alias for allergy
  medicalHistory?: string
}

// Mapper Helper
const mapPatientResponse = (p: PatientDTO): Patient => {
  return {
    ...p,
    patientId: p.pid,
    allergyHistory: p.allergy
  }
}

export const searchPatient = async (name: string) => {
  const res = await request<PatientDTO[]>({
    url: '/api/patient/search',
    method: 'get',
    params: { name }
  })
  return res.map(mapPatientResponse)
}

export const createPatient = async (data: Partial<Patient>) => {
  // Adapter: Map frontend fields to backend fields
  const payload: Partial<PatientDTO> = {
    ...data,
    pid: data.patientId,
    allergy: data.allergyHistory
  }
  const res = await request<PatientDTO>({
    url: '/api/patient',
    method: 'post',
    data: payload
  })
  return mapPatientResponse(res)
}

export const updatePatient = async (id: number, data: Partial<Patient>) => {
  const payload: Partial<PatientDTO> = {
    ...data,
    pid: id,
    allergy: data.allergyHistory
  }
  const res = await request<PatientDTO>({
    url: '/api/patient',
    method: 'post',
    data: payload
  })
  return mapPatientResponse(res)
}

export const getDoctors = (department?: string) => {
  return request<DoctorDTO[]>({
=======

export interface Patient {
  patientId: number // patient_id
  name: string
  gender: number // 1: Male, 2: Female
  age: number
  phone: string
  address: string
  idCard?: string // Not in DB schema but useful for frontend search
  medicalHistory?: string // medical_history
  allergyHistory?: string // allergy_history
  createdAt?: string // created_at
}

export interface Doctor {
  doctorId: number // doctor_id
  name: string
  title: string
  department: string
  phone?: string
  createdAt?: string
}

export interface AppointmentDTO {
  patientId: number // patient_id
  doctorId: number // doctor_id
  department: string
  registrationDate: string // registration_date
  registrationFee: number // registration_fee
  status?: number // status (0: Pending, 1: Waiting, 2: In Progress, 3: Completed)
}

// Extended Appointment for display
export interface Appointment extends AppointmentDTO {
  appointmentId: number // appointment_id
  patientName: string
  doctorName: string
}

export const searchPatient = (keyword: string) => {
  return request({
    url: '/api/patient/search',
    method: 'get',
    params: { keyword }
  })
}

export const createPatient = (data: Partial<Patient>) => {
  return request({
    url: '/api/patient',
    method: 'post',
    data
  })
}

export const updatePatient = (id: number, data: Partial<Patient>) => {
  return request({
    url: `/api/patient/${id}`,
    method: 'put',
    data
  })
}

export const getDoctors = (department?: string) => {
  return request({
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
    url: '/api/doctor',
    method: 'get',
    params: { department }
  })
}

<<<<<<< HEAD
export const createAppointment = async (data: any) => {
  const payload: AppointmentDTO = {
    pid: data.patientId,
    doctorId: data.doctorId,
    department: data.department,
    registrationDate: data.registrationDate,
    registrationFee: data.registrationFee,
    status: 0
  }
  const res = await request<any>({ // Backend/Mock returns Entity or DTO
    url: '/api/appointment',
    method: 'post',
    data: payload
  })
  // Map response if necessary (ensure appointmentId is present)
  return res
}

// Mock-only or Future Backend Endpoints
=======
export const createAppointment = (data: AppointmentDTO) => {
  return request({
    url: '/api/appointment',
    method: 'post',
    data
  })
}

>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
export const getTodayAppointments = () => {
  return request({
    url: '/api/appointment/today',
    method: 'get'
  })
}

export const getRegistrationStats = () => {
  return request({
    url: '/api/statistics/registration',
    method: 'get'
  })
}
