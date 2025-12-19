export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface UserInfo {
  id: number;
  username: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface LoginResult {
  token: string;
  userInfo: UserInfo;
}

export interface Patient {
  patientId: number;
  name: string;
  gender: number; // 1:男, 2:女
  age: number;
  phone: string;
  idCard?: string;
  medicalHistory?: string;
  allergyHistory?: string;
}

export interface Doctor {
  doctorId: number;
  name: string;
  department: string;
  title: string;
  phone: string;
}

export interface Appointment {
  appointmentId: number;
  pid: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  department: string;
  status: number; // 0:待支付, 1:待就诊(已支付), 2:就诊中, 3:已完成/取消
  registrationDate: string;
  registrationFee: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  code: string;
  specification: string;
  unit: string;
  quantity: number;
  price: number;
  expiryDate: string;
}
