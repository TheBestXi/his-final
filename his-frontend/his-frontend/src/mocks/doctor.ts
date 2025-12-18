import type { MockMethod } from 'vite-plugin-mock'

<<<<<<< HEAD
// Mock Data
=======
// Sync with outpatient.ts patients
const patients = [
  {
    patientId: 1,
    name: '张三',
    gender: 1,
    age: 30,
    medicalHistory: '高血压',
    allergyHistory: '青霉素过敏'
  },
  {
    patientId: 2,
    name: '李四',
    gender: 2,
    age: 45,
    medicalHistory: '无',
    allergyHistory: '无'
  },
  {
    patientId: 3,
    name: '王五',
    gender: 1,
    age: 28,
    medicalHistory: '糖尿病',
    allergyHistory: '磺胺类过敏'
  }
]

>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
let queueData = [
  { 
    appointmentId: 1001, 
    patientId: 1,
    patientName: '张三', 
    gender: 1, 
    age: 30, 
    status: 1, 
    visitTime: '09:00',
    medicalHistory: '高血压',
    allergyHistory: '青霉素过敏'
  },
  { 
    appointmentId: 1002, 
    patientId: 2,
    patientName: '李四', 
    gender: 2, 
    age: 45, 
    status: 1, 
    visitTime: '09:15',
    medicalHistory: '无',
    allergyHistory: '无'
  },
  { 
    appointmentId: 1003, 
    patientId: 3,
    patientName: '王五', 
    gender: 1, 
    age: 28, 
    status: 3, 
    visitTime: '08:45',
    medicalHistory: '糖尿病',
    allergyHistory: '磺胺类过敏'
  }
]

let records: any[] = []
let prescriptions: any[] = []
let labTests: any[] = []

export default [
  {
    url: '/api/doctor/queue',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: queueData
      }
    }
  },
  {
    url: RegExp('/api/appointment/\\d+/status'),
    method: 'put',
    response: ({ url, query }: any) => {
      const match = url.match(/\/api\/appointment\/(\d+)\/status/)
      const id = match ? parseInt(match[1]) : 0
      const status = parseInt(query.status)
      
      const item = queueData.find(q => q.appointmentId === id)
      if (item) {
        item.status = status
      }
      return {
        code: 200,
        message: 'success',
        data: { status }
      }
    }
  },
  {
<<<<<<< HEAD
    url: '/api/medical-record', // Was /api/doctor/record
    method: 'post',
    response: ({ body }: any) => {
      const newRecord = { ...body, id: records.length + 1, createdAt: new Date().toISOString() }
=======
    url: '/api/doctor/record',
    method: 'post',
    response: ({ body }: any) => {
      const newRecord = { ...body, recordId: records.length + 1, createdAt: new Date().toISOString() }
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      records.push(newRecord)
      return {
        code: 200,
        message: 'success',
        data: newRecord
      }
    }
  },
  {
<<<<<<< HEAD
    url: RegExp('/api/medical-record/patient/\\d+'), // Was /api/doctor/history/
    method: 'get',
    response: ({ url }: any) => {
      const match = url.match(/\/api\/medical-record\/patient\/(\d+)/)
      const pid = match ? parseInt(match[1]) : 0
      // Return mock historical records
      return {
        code: 200,
        data: [
            {
                id: 1,
                pid: pid,
                chiefComplaint: "Previous headache",
                presentIllness: "History of migraines",
                createdAt: "2023-01-01"
            }
        ]
=======
    url: RegExp('/api/doctor/history/\\d+'),
    method: 'get',
    response: ({ url }: any) => {
      const match = url.match(/\/api\/doctor\/history\/(\d+)/)
      const pid = match ? parseInt(match[1]) : 0
      const patient = patients.find(p => p.patientId === pid)
      return {
        code: 200,
        data: patient || {}
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
      }
    }
  },
  {
<<<<<<< HEAD
    url: '/api/prescription', // Was /api/doctor/prescription
    method: 'post',
    response: ({ body }: any) => {
      // Backend expects DTO, Frontend sends { items: [...] }
      // Mock handles the Frontend payload for now
      const newPrescription = { 
        ...body, 
        id: prescriptions.length + 1, 
=======
    url: '/api/doctor/prescription',
    method: 'post',
    response: ({ body }: any) => {
      const newPrescription = { 
        ...body, 
        prescriptionId: prescriptions.length + 1, 
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
        createdAt: new Date().toISOString() 
      }
      prescriptions.push(newPrescription)
      return {
        code: 200,
        message: 'success',
        data: newPrescription
      }
    }
  },
  {
<<<<<<< HEAD
    url: '/api/test', // Was /api/doctor/lab
=======
    url: '/api/doctor/lab',
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
    method: 'post',
    response: ({ body }: any) => {
      const newTest = { 
        ...body, 
<<<<<<< HEAD
        id: labTests.length + 1, 
=======
        testId: labTests.length + 1, 
>>>>>>> b636d06c0cc2129a138e4d0f0e9c17c1de95e9a3
        status: 0 
      }
      labTests.push(newTest)
      return {
        code: 200,
        message: 'success',
        data: newTest
      }
    }
  },
  {
    url: '/api/statistics/doctor/workload',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          todayPatients: 12,
          pending: queueData.filter(q => q.status === 1).length,
          completed: queueData.filter(q => q.status === 3).length
        }
      }
    }
  }
] as MockMethod[]
