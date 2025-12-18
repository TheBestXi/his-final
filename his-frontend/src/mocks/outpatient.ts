import type { MockMethod } from 'vite-plugin-mock'

// In-memory storage for mock data (reset on reload)
// Structure matches PatientDTO
let patients = [
  {
    pid: 1,
    name: '张三',
    gender: 1,
    age: 30,
    idCard: '110101199001011234', // Not in DTO but kept for search mock
    phone: '13800138000',
    address: '北京市朝阳区',
    medicalHistory: '高血压',
    allergy: '青霉素过敏',
    createdAt: '2024-01-01'
  },
  {
    pid: 2,
    name: '李四',
    gender: 2,
    age: 25,
    idCard: '110101199501011234',
    phone: '13900139000',
    address: '上海市浦东新区',
    medicalHistory: '无',
    allergy: '无',
    createdAt: '2024-01-02'
  }
]

let appointments: any[] = []

export default [
  {
    url: '/api/patient/search',
    method: 'get',
    response: ({ query }: any) => {
      // Backend uses 'name', frontend adapter sends 'name'
      // But we also support searching by idCard for "Old Patient Quick Registration"
      const { name } = query
      if (!name) return { code: 200, data: patients }
      
      const res = patients.filter(p => 
        p.name.includes(name) || (p.idCard && p.idCard.includes(name))
      )
      return {
        code: 200,
        message: 'success',
        data: res
      }
    }
  },
  {
    url: '/api/patient',
    method: 'post', // Handles Create AND Update
    response: ({ body }: any) => {
      if (body.pid) {
        // Update
        const index = patients.findIndex(p => p.pid === body.pid)
        if (index !== -1) {
          patients[index] = { ...patients[index], ...body }
          return { code: 200, message: 'success', data: patients[index] }
        }
        return { code: 500, message: 'Patient not found' }
      } else {
        // Create
        const newPatient = {
          ...body,
          pid: patients.length + 1,
          createdAt: new Date().toISOString().slice(0, 10)
        }
        patients.push(newPatient)
        return {
          code: 200,
          message: 'success',
          data: newPatient
        }
      }
    }
  },
  {
    url: '/api/doctor',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: [
          { id: 101, name: '王医生', title: '主任医师', department: '内科' },
          { id: 102, name: '张医生', title: '主治医师', department: '外科' },
          { id: 103, name: '李医生', title: '住院医师', department: '儿科' }
        ]
      }
    }
  },
  {
    url: '/api/appointment',
    method: 'post',
    response: ({ body }: any) => {
      const newAppt = {
        ...body,
        appointmentId: 1000 + appointments.length + 1,
        status: 1 // Waiting
      }
      appointments.push(newAppt)
      return {
        code: 200,
        message: 'success',
        data: newAppt
      }
    }
  },
  {
    url: '/api/appointment/today',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: appointments
      }
    }
  },
  {
    url: '/api/statistics/registration',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [
          { date: '2025-12-10', count: 120 },
          { date: '2025-12-11', count: 132 },
          { date: '2025-12-12', count: 101 },
          { date: '2025-12-13', count: 134 },
          { date: '2025-12-14', count: 90 },
          { date: '2025-12-15', count: 230 },
          { date: '2025-12-16', count: 210 }
        ]
      }
    }
  }
] as MockMethod[]
