<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">挂号记录</h2>
      <el-button @click="fetchData" :icon="Refresh" circle />
    </div>

    <el-card v-loading="loading">
      <el-table :data="appointments" style="width: 100%" stripe>
        <el-table-column prop="registrationDate" label="就诊日期" width="120" sortable />
        <el-table-column prop="timeSlot" label="时段" width="140">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.timeSlot || '全天' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="科室" width="120" />
        <!-- Doctor ID is stored, but name might not be directly available in Appointment entity unless joined. 
             Backend returns Appointment entity. Let's see if we can get doctor name or if we need to fetch it.
             The Appointment entity usually has doctorId. 
             Ideally backend should return DTO with doctorName. 
             For now, let's just show doctorId or try to match if possible, but standard is DTO.
             Wait, looking at AppointmentController, it returns List<Appointment>. 
             Appointment entity usually just has IDs. 
             Let's check Appointment.java to see if it has @ManyToOne for Doctor and if it's serialized.
        -->
        <el-table-column prop="doctorId" label="医生" width="120">
           <template #default="{ row }">
             <span>{{ getDoctorName(row.doctorId) }}</span>
           </template>
        </el-table-column>
        
        <el-table-column prop="registrationFee" label="费用" width="100">
          <template #default="{ row }">
            <span class="font-mono">¥{{ row.registrationFee }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="挂号时间" min-width="160" sortable>
           <template #default="{ row }">
             {{ formatTime(row.createdAt) }}
           </template>
        </el-table-column>
        
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 1" 
              type="primary" 
              link 
              @click="handleDetail(row)"
            >
              查看详情
            </el-button>
            <el-popconfirm
              v-if="row.status === 1"
              title="确定要取消这个挂号吗？"
              @confirm="handleCancel(row)"
            >
              <template #reference>
                <el-button type="danger" link>退号</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!loading && appointments.length === 0" class="text-center py-10 text-gray-500">
        暂无挂号记录
      </div>
    </el-card>
    <!-- Detail Dialog -->
    <el-dialog v-model="showDetail" title="挂号详情" width="500px">
      <div v-if="detailRow" class="space-y-4">
        <div class="flex justify-between border-b pb-2">
          <span class="text-gray-500">挂号单号</span>
          <span class="font-mono">{{ detailRow.appointmentId }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-gray-500">就诊科室</span>
          <span class="font-bold">{{ detailRow.department }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-gray-500">就诊医生</span>
          <span>{{ getDoctorName(detailRow.doctorId) }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-gray-500">就诊时间</span>
          <span class="text-blue-600 font-bold">{{ detailRow.registrationDate }} {{ detailRow.timeSlot }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-gray-500">挂号费用</span>
          <span class="text-orange-500 font-bold">¥{{ detailRow.registrationFee }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span class="text-gray-500">当前状态</span>
          <el-tag :type="getStatusType(detailRow.status)">{{ getStatusText(detailRow.status) }}</el-tag>
        </div>
        <div class="flex justify-between pt-2">
          <span class="text-gray-500">创建时间</span>
          <span class="text-sm text-gray-400">{{ formatTime(detailRow.createdAt) }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDetail = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAppointmentsByPatient, getDoctors, cancelAppointment } from '@/api/outpatient'
import { useAuthStore } from '@/stores/auth'
import { Refresh, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const auth = useAuthStore()
const loading = ref(false)
const appointments = ref<any[]>([])
const doctorMap = ref<Record<number, string>>({})
const showDetail = ref(false)
const detailRow = ref<any>(null)

const getStatusText = (status: number) => {
  const map: Record<number, string> = {
    0: '已取消',
    1: '待就诊',
    2: '就诊中',
    3: '已完成'
  }
  return map[status] || '未知'
}

const getStatusType = (status: number) => {
  const map: Record<number, string> = {
    0: 'info',
    1: 'primary',
    2: 'warning',
    3: 'success'
  }
  return map[status] || 'info'
}

const formatTime = (time: string) => {
  if (!time) return ''
  return new Date(time).toLocaleString()
}

const getDoctorName = (id: number) => {
  return doctorMap.value[id] || `医生ID:${id}`
}

const fetchDoctorsData = async () => {
  try {
    const res = await getDoctors()
    if (res) {
      const map: Record<number, string> = {}
      res.forEach((d: any) => {
        // Backend Doctor entity uses doctorId
        map[d.doctorId] = d.name
      })
      doctorMap.value = map
    }
  } catch (e) {
    console.error('Fetch doctors failed', e)
  }
}

const fetchData = async () => {
  if (!auth.user?.pid) {
    ElMessage.warning('未找到患者信息')
    return
  }
  
  loading.value = true
  try {
    const res = await getAppointmentsByPatient(auth.user.pid)
    appointments.value = res
  } catch (e) {
    console.error(e)
    ElMessage.error('获取记录失败')
  } finally {
    loading.value = false
  }
}

const handleDetail = (row: any) => {
  detailRow.value = row
  showDetail.value = true
}

const handleCancel = (row: any) => {
  ElMessageBox.confirm(
    '确定要取消这个挂号吗？取消后无法恢复。',
    '退号确认',
    {
      confirmButtonText: '确定退号',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await cancelAppointment(row.appointmentId)
      ElMessage.success('退号成功')
      fetchData()
    } catch (e: any) {
      console.error(e)
      ElMessage.error(e.message || '退号失败')
    }
  }).catch(() => {
    // Cancelled
  })
}

onMounted(async () => {
  await fetchDoctorsData()
  fetchData()
})
</script>
