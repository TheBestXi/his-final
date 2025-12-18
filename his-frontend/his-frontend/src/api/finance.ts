import request from '@/utils/request'
import type { FinanceDTO } from './types'

export type { FinanceDTO }

export interface FinanceRecord {
  financeId: number
  appointmentId: number
  patientName: string // Helper from join
  registrationFee: number
  medicineFee: number
  testFee?: number
  totalFee: number
  status: number // 0: Unpaid, 1: Paid (Mapped from paymentStatus)
  paymentStatus?: string // Original backend status
  createdAt: string
}

export interface DailyStats {
  date: string
  visits: number
  income: number
}

export const getPendingBills = () => {
  // Backend missing "list all pending"
  // Mock returns FinanceRecord[]
  return request<FinanceRecord[]>({
    url: '/finance/bills',
    method: 'get'
  })
}

export const payBill = (financeId: number) => {
  return request({
    url: `/finance/pay/${financeId}`,
    method: 'post'
  })
}

export const getDailyStats = () => {
  return request({
    url: '/statistics/daily',
    method: 'get'
  })
}
