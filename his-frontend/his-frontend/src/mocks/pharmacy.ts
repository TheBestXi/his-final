import type { MockMethod } from 'vite-plugin-mock'

<<<<<<< HEAD
// Structure matches PharmacyInventoryDTO
let inventory = [
  { 
    id: 1, 
    medicineName: '阿莫西林胶囊', 
    specification: '0.25g*24', 
    manufacturer: '白云山制药',
    category: '抗生素',
    stockQuantity: 100, 
=======
let inventory = [
  { 
    medicineId: 1, 
    name: '阿莫西林胶囊', 
    specification: '0.25g*24', 
    manufacturer: '白云山制药',
    category: '抗生素',
    quantity: 100, 
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
    unit: '盒', 
    price: 25.5, 
    expirationDate: '2025-12-31' 
  },
  { 
<<<<<<< HEAD
    id: 2, 
    medicineName: '布洛芬缓释胶囊', 
    specification: '0.1g*100', 
    manufacturer: '中美史克',
    category: '解热镇痛',
    stockQuantity: 50, 
=======
    medicineId: 2, 
    name: '布洛芬缓释胶囊', 
    specification: '0.1g*100', 
    manufacturer: '中美史克',
    category: '解热镇痛',
    quantity: 50, 
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
    unit: '瓶', 
    price: 12.0, 
    expirationDate: '2024-06-30' 
  },
  { 
<<<<<<< HEAD
    id: 3, 
    medicineName: '对乙酰氨基酚片', 
    specification: '0.5g*10', 
    manufacturer: '东北制药',
    category: '解热镇痛',
    stockQuantity: 5, 
=======
    medicineId: 3, 
    name: '对乙酰氨基酚片', 
    specification: '0.5g*10', 
    manufacturer: '东北制药',
    category: '解热镇痛',
    quantity: 5, 
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
    unit: '板', 
    price: 5.0, 
    expirationDate: '2024-01-01' 
  }
]

let dispensingQueue = [
  { 
    prescriptionId: 1001, 
    patientName: '张三', 
    items: '阿莫西林胶囊 x2', 
    totalCost: 51.0,
    status: 1 
  },
  { 
    prescriptionId: 1003, 
    patientName: '王五', 
    items: '布洛芬缓释胶囊 x1', 
    totalCost: 12.0,
    status: 2 
  }
]

export default [
  {
    url: '/api/pharmacy/inventory',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: inventory
      }
    }
  },
  {
    url: '/api/pharmacy/inventory',
<<<<<<< HEAD
    method: 'post', // Create or Update
    response: ({ body }: any) => {
      if (body.id) {
        // Update
        const index = inventory.findIndex(i => i.id === body.id)
        if (index !== -1) {
          inventory[index] = { ...inventory[index], ...body }
          return { code: 200, message: 'success', data: inventory[index] }
        }
        return { code: 500, message: 'Item not found' }
      } else {
        // Create
        const newItem = { ...body, id: inventory.length + 1 }
        inventory.push(newItem)
        return {
          code: 200,
          message: 'success',
          data: newItem
        }
=======
    method: 'post',
    response: ({ body }: any) => {
      const newItem = { ...body, medicineId: inventory.length + 1 }
      inventory.push(newItem)
      return {
        code: 200,
        message: 'success',
        data: newItem
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      }
    }
  },
  {
    url: RegExp('/api/pharmacy/inventory/\\d+'),
    method: 'delete',
    response: ({ url }: any) => {
      const match = url.match(/\/api\/pharmacy\/inventory\/(\d+)/)
      const id = match ? parseInt(match[1]) : 0
<<<<<<< HEAD
      inventory = inventory.filter(i => i.id !== id)
=======
      inventory = inventory.filter(i => i.medicineId !== id)
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      return {
        code: 200,
        message: 'success'
      }
    }
  },
  {
    url: '/api/pharmacy/dispensing/queue',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: dispensingQueue
      }
    }
  },
  {
<<<<<<< HEAD
    url: '/api/pharmacy/dispense', // Changed to match API
    method: 'post',
    response: ({ query, body }: any) => {
      // API might send params (if GET/POST params) or body (if JSON)
      // Adapter sends params: { prescriptionId, operator }
      const params = query || body || {}
      const id = parseInt(params.prescriptionId)
      
=======
    url: RegExp('/api/pharmacy/dispensing/\\d+'),
    method: 'post',
    response: ({ url }: any) => {
      const match = url.match(/\/api\/pharmacy\/dispensing\/(\d+)/)
      const id = match ? parseInt(match[1]) : 0
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      const task = dispensingQueue.find(t => t.prescriptionId === id)
      if (task) {
        task.status = 2
      }
      return {
        code: 200,
        message: 'success'
      }
    }
  }
] as MockMethod[]
