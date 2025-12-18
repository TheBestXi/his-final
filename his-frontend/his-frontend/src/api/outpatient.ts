import request from '@/utils/request'
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
    url: '/patient/search',
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
    url: '/patient',
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
    url: '/patient',
    method: 'post',
    data: payload
  })
  return mapPatientResponse(res)
}

export const getDoctors = (department?: string, date?: string) => {
  return request<DoctorDTO[]>({
    url: '/doctor',
    method: 'get',
    params: { department, date }
  })
}

export const createAppointment = async (data: any) => {
  const payload: AppointmentDTO = {
    pid: data.patientId,
    doctorId: data.doctorId,
    department: data.department,
    registrationDate: data.registrationDate,
    registrationFee: data.registrationFee,
    timeSlot: data.timeSlot, // Add timeSlot
    status: 0
  }
  const res = await request<any>({ // Backend/Mock returns Entity or DTO
    url: '/appointment',
    method: 'post',
    data: payload
  })
  // Map response if necessary (ensure appointmentId is present)
  return res
}

// Mock-only or Future Backend Endpoints
export const getTodayAppointments = () => {
  return request({
    url: '/appointment/today',
    method: 'get'
  })
}

export const getRegistrationStats = () => {
  return request({
    url: '/statistics/registration',
    method: 'get'
  })
}

export const getAppointmentsByPatient = (pid: number) => {
  return request<any[]>({
    url: `/appointment/patient/${pid}`,
    method: 'get'
  })
}

export const cancelAppointment = (id: number) => {
  return request({
    url: `/appointment/${id}/status`,
    method: 'put',
    params: { status: 0 }
  })
}
