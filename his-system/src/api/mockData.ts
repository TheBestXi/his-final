export interface Appointment {
  id: string;
  date: string;
  time: string;
  department: string;
  doctor: string;
  cost: number;
  status: '待就诊' | '已完成' | '已取消';
  created_at: number;
}

const STORAGE_KEY = 'his_appointments_data';

// Initialize default data if empty
const initData = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const defaultData: Appointment[] = [
      { id: 'REG20231220001', date: '2023-12-20', time: '09:00', department: '内科', doctor: '张医生', cost: 10.00, status: '待就诊', created_at: Date.now() },
      { id: 'REG20231201005', date: '2023-12-01', time: '14:30', department: '外科', doctor: '李医生', cost: 12.00, status: '已完成', created_at: Date.now() - 10000000 },
      { id: 'REG20231115003', date: '2023-11-15', time: '10:00', department: '眼科', doctor: '王医生', cost: 10.00, status: '已取消', created_at: Date.now() - 20000000 },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  }
};

export const getAppointments = (): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      initData();
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      // Sort by created_at desc
      data.sort((a: Appointment, b: Appointment) => b.created_at - a.created_at);
      resolve(data);
    }, 500);
  });
};

export const addAppointment = (appt: Omit<Appointment, 'id' | 'status' | 'created_at'>): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      initData();
      const data: Appointment[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      
      const newAppt: Appointment = {
        ...appt,
        id: `REG${new Date().toISOString().slice(0,10).replace(/-/g, '')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        status: '待就诊',
        created_at: Date.now()
      };
      
      data.unshift(newAppt);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      resolve();
    }, 500);
  });
};

export const cancelAppointment = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      initData();
      const data: Appointment[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const index = data.findIndex(item => item.id === id);
      if (index !== -1 && data[index]) {
        data[index].status = '已取消';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      resolve();
    }, 500);
  });
};
