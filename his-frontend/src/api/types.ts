// Common Result Wrapper
export interface GlobalResult<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

// Entity: Patient (Matches sys_patient)
export interface PatientDTO {
  pid?: number
  name: string
  gender: number // 1: Male, 2: Female
  age: number
  phone: string
  address: string
  idCard?: string // Frontend requirement (missing in backend currently)
  medicalHistory?: string
  allergy?: string // Backend uses 'allergy'
  isDeleted?: number
}

// Entity: Doctor (Matches sys_doctor)
export interface DoctorDTO {
  id?: number
  userId?: number
  deptId?: number
  department?: string // Helper for frontend display
  name?: string // Helper
  title?: string
}

// Entity: Appointment (Matches op_registration)
export interface AppointmentDTO {
  appointmentId?: number
  pid: number
  doctorId: number
  department: string
  registrationDate: string // LocalDate YYYY-MM-DD
  registrationTime?: string
  registrationFee: number
  status: number // 0:Pending, 1:Waiting, 2:In Progress, 3:Completed
  callNumberTime?: string
  consultStartTime?: string
  consultEndTime?: string
}

// Entity: Medical Record (Matches MedicalRecord)
export interface MedicalRecordDTO {
  id?: number
  pid: number
  doctorId: number
  appointmentId: number
  chiefComplaint: string
  presentIllness: string
  physicalExamination: string
  preliminaryDiagnosis: string
  createdAt?: string
}

// Entity: Prescription (Matches Prescription)
export interface PrescriptionDTO {
  id?: number
  pid: number
  doctorId: number
  appointmentId: number
  medicineId: number
  medicineName?: string // Helper
  dosage: string
  dosageUnit: string
  frequency: string
  quantity: number
  amount?: number
}

// Entity: Pharmacy Inventory (Matches PharmacyInventory)
export interface PharmacyInventoryDTO {
  id?: number
  medicineName: string
  specification: string
  manufacturer: string
  category: string
  price: number
  stockQuantity: number
  unit: string
  expirationDate: string
}

// Entity: Finance/Bill (Matches Finance)
export interface FinanceDTO {
  id?: number
  appointmentId: number
  pid?: number // Helper
  patientName?: string // Helper
  totalFee: number
  status: number // 0: Unpaid, 1: Paid
  items?: any[] // Detail items
  createdAt?: string
}
