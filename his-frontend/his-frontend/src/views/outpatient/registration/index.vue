<template>
  <div class="space-y-4">
    <el-card class="h-full">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-bold">门诊挂号</span>
          <!-- Only show for staff -->
          <el-button v-if="!isPatient" type="primary" :icon="Plus" @click="handleNewPatient">建档/新患</el-button>
        </div>
      </template>
      
      <div v-if="!isPatient && activeStep === 0" class="flex flex-col items-center space-y-4 py-8">
        <div class="w-full max-w-lg">
          <el-autocomplete
            v-model="searchKeyword"
            :fetch-suggestions="querySearchAsync"
            placeholder="搜索姓名或身份证号 (H2: 老患者快速挂号)"
            class="w-full"
            @select="handleSelectPatient"
          >
            <template #default="{ item }">
              <div class="flex justify-between items-center">
                <span class="font-bold">{{ item.name }}</span>
                <span class="text-gray-400 text-xs">{{ item.idCard }}</span>
              </div>
            </template>
          </el-autocomplete>
        </div>
        
        <div v-if="selectedPatient" class="w-full max-w-lg border p-4 rounded bg-blue-50">
          <h3 class="font-bold text-lg mb-2">{{ selectedPatient.name }}</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <p><span class="text-gray-500">性别:</span> {{ selectedPatient.gender === 1 ? '男' : '女' }}</p>
            <p><span class="text-gray-500">年龄:</span> {{ selectedPatient.age }}</p>
            <p><span class="text-gray-500">身份证:</span> {{ selectedPatient.idCard }}</p>
            <p><span class="text-gray-500">电话:</span> {{ selectedPatient.phone }}</p>
            <p class="col-span-2 text-red-500" v-if="selectedPatient.allergyHistory">
              <span class="font-bold">过敏史:</span> {{ selectedPatient.allergyHistory }}
            </p>
          </div>
          <div class="mt-4 flex justify-end">
            <el-button type="primary" @click="confirmPatient">确认并下一步</el-button>
          </div>
        </div>
      </div>

      <div v-else class="flex h-[calc(100vh-200px)]">
        <!-- Step 1: Department Selection (Left Sidebar) -->
        <div v-if="!selectedDoctor" class="w-1/4 border-r pr-4 flex flex-col overflow-y-auto">
           <div class="font-bold text-lg mb-4 pl-2">科室列表</div>
           <div class="flex flex-1">
             <!-- Category List -->
             <div class="w-1/2 bg-gray-50">
               <div 
                 v-for="(cat, idx) in categories" 
                 :key="idx"
                 class="p-3 cursor-pointer hover:bg-white text-sm"
                 :class="{'bg-white font-bold text-blue-600 border-l-4 border-blue-600': activeCategory === cat.name}"
                 @click="activeCategory = cat.name"
               >
                 {{ cat.name }}
               </div>
             </div>
             <!-- Sub-Department List -->
             <div class="w-1/2 bg-white">
               <div 
                 v-for="dept in currentSubDepts" 
                 :key="dept"
                 class="p-3 cursor-pointer hover:bg-gray-100 text-sm"
                 :class="{'text-blue-600 font-bold': selectedDept === dept}"
                 @click="selectDept(dept)"
               >
                 {{ dept }}
               </div>
             </div>
           </div>
        </div>

        <!-- Step 2: Doctor List (Middle) -->
        <div v-if="!selectedDoctor" class="w-3/4 pl-4 flex flex-col">
           <div class="flex items-center justify-between mb-4 border-b pb-2">
             <div class="font-bold text-lg">{{ selectedDept || '请选择科室' }}</div>
             <!-- Date Tabs -->
             <div class="flex space-x-2 overflow-x-auto">
               <div 
                 v-for="date in availableDates" 
                 :key="date.full"
                 class="flex flex-col items-center px-3 py-1 rounded cursor-pointer border transition-all"
                 :class="selectedDate === date.full ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'"
                 @click="changeDate(date.full)"
               >
                 <span class="text-xs">{{ date.day }}</span>
                 <span class="font-bold text-sm">{{ date.date }}</span>
               </div>
             </div>
           </div>

           <div v-if="selectedDept" class="flex-1 overflow-y-auto">
             <div v-if="loadingDoctors" class="py-10 text-center text-gray-400">加载中...</div>
             <div v-else-if="doctors.length === 0" class="py-10 text-center text-gray-400">该科室暂无排班</div>
             <div v-else class="space-y-4">
               <div 
                 v-for="doc in doctors" 
                 :key="doc.id" 
                 class="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow cursor-pointer"
                 @click="viewDoctor(doc)"
               >
                 <div class="flex items-center space-x-4">
                   <el-avatar :size="60" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                   <div>
                     <div class="font-bold text-lg flex items-center space-x-2">
                       <span>{{ doc.name }}</span>
                       <span class="text-xs font-normal text-white bg-blue-500 px-1 rounded">{{ doc.title }}</span>
                     </div>
                     <div class="text-xs text-gray-500 mt-1 line-clamp-2 w-64">
                       擅长: {{ doc.department }}常见病诊治...
                     </div>
                   </div>
                 </div>
                 <div class="flex flex-col space-y-2 text-right">
                   <div class="flex space-x-2">
                     <span class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-600">上午余 {{ getMorningQuota(doc) }}</span>
                     <span class="px-2 py-0.5 text-xs rounded bg-green-100 text-green-600">下午余 {{ getAfternoonQuota(doc) }}</span>
                   </div>
                   <el-button size="small" type="primary" round>挂号 ¥50</el-button>
                 </div>
               </div>
             </div>
           </div>
           <div v-else class="flex-1 flex items-center justify-center text-gray-400">
             请先在左侧选择科室
           </div>
        </div>

        <!-- Step 3: Time Slot Selection (Full View) -->
        <div v-if="selectedDoctor" class="w-full flex flex-col">
           <div class="mb-4 flex items-center space-x-2 cursor-pointer text-gray-500 hover:text-blue-500" @click="selectedDoctor = null">
             <el-icon><ArrowLeft /></el-icon> <span>返回医生列表</span>
           </div>
           
           <div class="flex space-x-6">
             <!-- Doctor Info Card -->
             <div class="w-1/3">
               <el-card class="text-center">
                 <el-avatar :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="mb-4"/>
                 <h2 class="text-xl font-bold">{{ selectedDoctor.name }}</h2>
                 <p class="text-gray-500 mb-2">{{ selectedDoctor.title }}</p>
                 <p class="text-blue-500 text-sm mb-4">{{ selectedDoctor.department }}</p>
                 <div class="text-left text-xs text-gray-600 bg-gray-50 p-3 rounded">
                   <p class="font-bold mb-1">执业经历:</p>
                   从事{{ selectedDoctor.department }}临床工作多年，经验丰富。
                 </div>
               </el-card>
             </div>

             <!-- Slots -->
             <div class="w-2/3">
               <div class="bg-white rounded-lg border p-4">
                 <div class="flex justify-between items-center mb-4 border-b pb-2">
                   <div class="font-bold text-lg">选择就诊时段</div>
                   <div class="text-gray-500">{{ selectedDate }}</div>
                 </div>
                 
                 <div class="space-y-2">
                   <div 
                     v-for="(count, slot) in sortedSlots(selectedDoctor.slotAvailability)" 
                     :key="slot"
                     class="flex items-center justify-between p-3 rounded border transition-all"
                     :class="count > 0 ? 'hover:border-blue-500 cursor-pointer bg-white' : 'bg-gray-100 cursor-not-allowed border-gray-200'"
                     @click="count > 0 && confirmBooking(slot)"
                   >
                     <div class="flex items-center space-x-4">
                       <el-icon class="text-gray-400"><Clock /></el-icon>
                       <span class="font-mono text-lg">{{ slot }}</span>
                     </div>
                     <div class="flex items-center space-x-6">
                       <span :class="count > 0 ? 'text-green-500' : 'text-gray-400'">
                         {{ count > 0 ? `余号: ${count}` : '约满' }}
                       </span>
                       <span class="font-bold text-orange-500">¥ 50.00</span>
                       <el-icon v-if="count > 0" class="text-gray-300"><ArrowRight /></el-icon>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </el-card>

    <!-- Confirmation Dialog -->
    <el-dialog v-model="showConfirm" title="挂号确认" width="400px">
      <div class="space-y-2 text-sm" v-if="selectedDoctor && selectedPatient">
        <div class="flex justify-between"><span class="text-gray-500">就诊科室:</span> <span>{{ selectedDoctor.department }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500">就诊医生:</span> <span>{{ selectedDoctor.name }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500">就诊患者:</span> <span>{{ selectedPatient.name }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500">就诊时间:</span> <span class="font-bold text-blue-600">{{ selectedDate }} {{ selectedTimeSlot }}</span></div>
        <div class="flex justify-between pt-2 border-t mt-2"><span class="text-gray-500">挂号费用:</span> <span class="font-bold text-xl text-orange-500">¥ 50.00</span></div>
      </div>
      <template #footer>
        <el-button @click="showConfirm = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitRegistration">确认支付并挂号</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Plus, ArrowLeft, Clock, ArrowRight } from '@element-plus/icons-vue'
import { searchPatient, getDoctors, createAppointment } from '@/api/outpatient'
import type { Patient, Doctor } from '@/api/outpatient'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

// State
const activeStep = ref(0) // 0: Patient Search (if staff), 1: Main Flow
const searchKeyword = ref('')
const selectedPatient = ref<Patient | null>(null)
const selectedDept = ref('')
const activeCategory = ref('内科系统')
const doctors = ref<any[]>([])
const selectedDoctor = ref<any | null>(null)
const selectedDate = ref(new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'))
const selectedTimeSlot = ref('')
const showConfirm = ref(false)
const submitting = ref(false)
const loadingDoctors = ref(false)

const isPatient = computed(() => auth.role === 'PATIENT')

// Mock Categories
const categories = [
  { name: '内科门诊', subs: ['内科', '心血管科', '神经内科', '消化内科'] },
  { name: '外科门诊', subs: ['外科', '骨科', '泌尿外科', '普外科'] },
  { name: '妇儿门诊', subs: ['妇科', '儿科', '产科'] },
  { name: '五官科门诊', subs: ['眼科', '耳鼻喉科', '口腔科'] },
  { name: '其他门诊', subs: ['皮肤科', '中医科', '康复科'] }
]

const currentSubDepts = computed(() => {
  const cat = categories.find(c => c.name === activeCategory.value)
  return cat ? cat.subs : []
})

// Dates
const availableDates = computed(() => {
  const dates = []
  const today = new Date()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  for (let i = 0; i < 6; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push({
      full: d.toISOString().slice(0, 10),
      date: d.getDate(),
      day: i === 0 ? '今天' : '周' + weekDays[d.getDay()]
    })
  }
  return dates
})

// Methods
const querySearchAsync = (queryString: string, cb: (arg: any) => void) => {
  if (!queryString) { cb([]); return }
  searchPatient(queryString).then((res: any) => cb(res))
}

const handleSelectPatient = (item: any) => { selectedPatient.value = item }

const confirmPatient = () => {
  if (selectedPatient.value) activeStep.value = 1
}

const handleNewPatient = () => router.push('/patient')

const selectDept = (dept: string) => {
  selectedDept.value = dept
  // Only reset doctor selection, keep date
  selectedDoctor.value = null
  fetchDoctors()
}

const changeDate = (date: string) => {
  selectedDate.value = date
  fetchDoctors()
}

const fetchDoctors = async () => {
  if (!selectedDept.value) return
  loadingDoctors.value = true
  try {
    const res: any = await getDoctors(selectedDept.value, selectedDate.value)
    doctors.value = res
  } finally {
    loadingDoctors.value = false
  }
}

const viewDoctor = (doc: any) => {
  selectedDoctor.value = doc
}

const sortedSlots = (slots: Record<string, number>) => {
  // Sort by time
  if (!slots) return {}
  return Object.keys(slots).sort().reduce((acc: any, key) => {
    acc[key] = slots[key]
    return acc
  }, {})
}

const getMorningQuota = (doc: any) => {
  if (!doc.slotAvailability) return 0
  return Object.entries(doc.slotAvailability)
    .filter(([time]) => parseInt(time.split(':')[0]) < 12)
    .reduce((sum, [, count]) => sum + (count as number), 0)
}

const getAfternoonQuota = (doc: any) => {
  if (!doc.slotAvailability) return 0
  return Object.entries(doc.slotAvailability)
    .filter(([time]) => parseInt(time.split(':')[0]) >= 12)
    .reduce((sum, [, count]) => sum + (count as number), 0)
}

const confirmBooking = (slot: string) => {
  selectedTimeSlot.value = slot
  showConfirm.value = true
}

const submitRegistration = async () => {
  if (!selectedPatient.value || !selectedDoctor.value) return
  
  submitting.value = true
  try {
    await createAppointment({
      patientId: selectedPatient.value.patientId,
      doctorId: selectedDoctor.value.doctorId || selectedDoctor.value.id,
      department: selectedDoctor.value.department,
      registrationDate: selectedDate.value,
      registrationFee: 50.00,
      timeSlot: selectedTimeSlot.value
    })
    ElMessage.success('挂号成功')
    router.push('/outpatient/history')
  } catch (e: any) {
    ElMessage.error(e.message || '挂号失败')
  } finally {
    submitting.value = false
    showConfirm.value = false
  }
}

onMounted(() => {
  if (isPatient.value && auth.user) {
    selectedPatient.value = {
        patientId: auth.user.pid,
        name: auth.user.name,
        gender: 1,
        age: 0,
        phone: auth.user.phone
    } as Patient
    activeStep.value = 1
  }
  // Default select first category
  activeCategory.value = '内科门诊'
})
</script>
