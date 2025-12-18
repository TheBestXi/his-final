import request from '@/utils/request'
<<<<<<< HEAD
import type { FinanceDTO } from './types'

export type { FinanceDTO }
=======
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3

export interface FinanceRecord {
  financeId: number
  appointmentId: number
<<<<<<< HEAD
  patientName: string // Helper from join
=======
  patientName: string
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
  registrationFee: number
  medicineFee: number
  testFee?: number
  totalFee: number
<<<<<<< HEAD
  status: number // 0: Unpaid, 1: Paid (Mapped from paymentStatus)
  paymentStatus?: string // Original backend status
=======
  status: number // 0: Unpaid, 1: Paid
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
  createdAt: string
}

export interface DailyStats {
  date: string
  visits: number
  income: number
}

export const getPendingBills = () => {
<<<<<<< HEAD
  // Backend missing "list all pending"
  // Mock returns FinanceRecord[]
  return request<FinanceRecord[]>({
=======
  return request({
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
    url: '/api/finance/bills',
    method: 'get'
  })
}

export const payBill = (financeId: number) => {
  return request({
    url: `/api/finance/pay/${financeId}`,
    method: 'post'
  })
}

export const getDailyStats = () => {
  return request({
    url: '/api/statistics/daily',
    method: 'get'
  })
}
