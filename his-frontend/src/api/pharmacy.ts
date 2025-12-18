import request from '@/utils/request'
<<<<<<< HEAD
import type { PharmacyInventoryDTO } from './types'

export type { PharmacyInventoryDTO }

export interface InventoryItem extends PharmacyInventoryDTO {
  medicineId?: number // Alias for id
=======

export interface InventoryItem {
  medicineId: number
  name: string
  specification: string
  manufacturer: string
  category: string
  price: number
  quantity: number
  unit: string
  expirationDate: string // expiration_date
  createdAt?: string
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
}

export interface DispensingTask {
  prescriptionId: number
  patientName: string
  items: string // JSON or comma separated string for display
  totalCost: number
  status: number // 1: Pending, 2: Dispensed
}

export const getInventory = () => {
<<<<<<< HEAD
  return request<PharmacyInventoryDTO[]>({
=======
  return request({
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
    url: '/api/pharmacy/inventory',
    method: 'get'
  })
}

export const addMedicine = (data: Partial<InventoryItem>) => {
<<<<<<< HEAD
  return request<PharmacyInventoryDTO>({
=======
  return request({
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
    url: '/api/pharmacy/inventory',
    method: 'post',
    data
  })
}

export const updateMedicine = (id: number, data: Partial<InventoryItem>) => {
<<<<<<< HEAD
  // Backend uses POST /inventory for save (create/update)
  const payload = { ...data, id }
  return request<PharmacyInventoryDTO>({
    url: '/api/pharmacy/inventory',
    method: 'post',
    data: payload
=======
  return request({
    url: `/api/pharmacy/inventory/${id}`,
    method: 'put',
    data
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
  })
}

export const deleteMedicine = (id: number) => {
<<<<<<< HEAD
  // Backend missing DELETE endpoint, Mocking it
=======
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
  return request({
    url: `/api/pharmacy/inventory/${id}`,
    method: 'delete'
  })
}

export const getDispensingQueue = () => {
<<<<<<< HEAD
  // Backend missing queue endpoint
=======
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
  return request({
    url: '/api/pharmacy/dispensing/queue',
    method: 'get'
  })
}

export const dispenseMedicine = (taskId: number) => {
<<<<<<< HEAD
  // Adapter: Frontend sends Task ID (Prescription ID)
  // Backend expects specific medicine dispensing.
  // We'll simulate a "Batch Dispense" call to the mock.
  return request({
    url: '/api/pharmacy/dispense', // Changed from /dispensing/:id
    method: 'post',
    params: { prescriptionId: taskId, operator: 'admin' } // Backend uses RequestParam currently
=======
  return request({
    url: `/api/pharmacy/dispensing/${taskId}`,
    method: 'post'
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
  })
}
