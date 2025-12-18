import request from '@/utils/request'
import type { PharmacyInventoryDTO } from './types'

export type { PharmacyInventoryDTO }

export interface InventoryItem extends PharmacyInventoryDTO {
  medicineId?: number // Alias for id
}

export interface DispensingTask {
  prescriptionId: number
  patientName: string
  items: string // JSON or comma separated string for display
  totalCost: number
  status: number // 1: Pending, 2: Dispensed
}

export const getInventory = () => {
  return request<PharmacyInventoryDTO[]>({
    url: '/pharmacy/inventory',
    method: 'get'
  })
}

export const addMedicine = (data: Partial<InventoryItem>) => {
  return request<PharmacyInventoryDTO>({
    url: '/pharmacy/inventory',
    method: 'post',
    data
  })
}

export const updateMedicine = (id: number, data: Partial<InventoryItem>) => {
  // Backend uses POST /inventory for save (create/update)
  const payload = { ...data, id }
  return request<PharmacyInventoryDTO>({
    url: '/pharmacy/inventory',
    method: 'post',
    data: payload
  })
}

export const deleteMedicine = (id: number) => {
  // Backend missing DELETE endpoint, Mocking it
  return request({
    url: `/pharmacy/inventory/${id}`,
    method: 'delete'
  })
}

export const getDispensingQueue = () => {
  // Backend missing queue endpoint
  return request({
    url: '/pharmacy/dispensing/queue',
    method: 'get'
  })
}

export const dispenseMedicine = (taskId: number) => {
  // Adapter: Frontend sends Task ID (Prescription ID)
  // Backend expects specific medicine dispensing.
  // We'll simulate a "Batch Dispense" call to the mock.
  return request({
    url: '/pharmacy/dispense', // Changed from /dispensing/:id
    method: 'post',
    params: { prescriptionId: taskId, operator: 'admin' } // Backend uses RequestParam currently
  })
}
