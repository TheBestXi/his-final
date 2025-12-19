<template>
  <div class="booking-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>预约挂号</span>
        </div>
      </template>

      <el-steps :active="activeStep" finish-status="success" simple style="margin-bottom: 20px;">
        <el-step title="选择科室" />
        <el-step title="选择医生" />
        <el-step title="选择时间" />
        <el-step title="确认挂号" />
      </el-steps>

      <!-- Step 1: Select Department -->
      <div v-if="activeStep === 0" class="step-content">
        <div class="department-grid">
          <div 
            v-for="dept in departments" 
            :key="dept" 
            class="dept-item"
            @click="selectDepartment(dept)"
          >
            {{ dept }}
          </div>
        </div>
      </div>

      <!-- Step 2: Select Doctor -->
      <div v-if="activeStep === 1" class="step-content">
        <el-table :data="doctors" style="width: 100%">
          <el-table-column prop="name" label="医生姓名" width="180" />
          <el-table-column prop="title" label="职称" width="180" />
          <el-table-column prop="specialty" label="擅长" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="selectDoctor(row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px;">
          <el-button @click="activeStep--">上一步</el-button>
        </div>
      </div>

      <!-- Step 3: Select Date & Time -->
      <div v-if="activeStep === 2" class="step-content">
        <div class="time-selection">
          <div class="date-picker-container">
             <span class="label">选择日期：</span>
             <el-date-picker
               v-model="selectedDate"
               type="date"
               placeholder="选择就诊日期"
               :disabled-date="disabledDate"
               value-format="YYYY-MM-DD"
             />
          </div>
          
          <div class="time-slots" v-if="selectedDate">
            <p class="label">选择时间段：</p>
            <div class="slots-grid">
              <el-tag
                v-for="slot in timeSlots"
                :key="slot"
                class="time-slot-item"
                :effect="selectedTime === slot ? 'dark' : 'plain'"
                @click="selectTime(slot)"
              >
                {{ slot }}
              </el-tag>
            </div>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <el-button @click="activeStep--">上一步</el-button>
          <el-button type="primary" :disabled="!selectedDate || !selectedTime" @click="activeStep++">下一步</el-button>
        </div>
      </div>

      <!-- Step 4: Confirm -->
      <div v-if="activeStep === 3" class="step-content confirm-step">
        <el-descriptions title="挂号信息确认" border :column="1">
          <el-descriptions-item label="就诊科室">{{ selectedDept }}</el-descriptions-item>
          <el-descriptions-item label="就诊医生">{{ selectedDoc?.name }} ({{ selectedDoc?.title }})</el-descriptions-item>
          <el-descriptions-item label="就诊时间">{{ selectedDate }} {{ selectedTime }}</el-descriptions-item>
          <el-descriptions-item label="挂号费">¥ 10.00</el-descriptions-item>
        </el-descriptions>
        <div style="margin-top: 30px; text-align: center;">
          <el-button @click="activeStep--">上一步</el-button>
          <el-button type="primary" :loading="submitting" @click="confirmBooking">确认挂号并支付</el-button>
        </div>
      </div>

    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { addAppointment } from '../../api/mockData';

const router = useRouter();
const activeStep = ref(0);
const selectedDept = ref('');
const selectedDoc = ref<any>(null);
const selectedDate = ref('');
const selectedTime = ref('');
const submitting = ref(false);

const timeSlots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'];

const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7;
};

const selectTime = (slot: string) => {
  selectedTime.value = slot;
};

const departments = ['内科', '外科', '儿科', '妇产科', '眼科', '口腔科', '皮肤科', '中医科'];
const doctors = ref([
  { id: 1, name: '张医生', title: '主任医师', specialty: '高血压、糖尿病' },
  { id: 2, name: '王医生', title: '副主任医师', specialty: '消化系统疾病' },
]);

const selectDepartment = (dept: string) => {
  selectedDept.value = dept;
  activeStep.value = 1;
};

const selectDoctor = (doc: any) => {
  selectedDoc.value = doc;
  activeStep.value = 2;
};

const confirmBooking = async () => {
  submitting.value = true;
  try {
    await addAppointment({
      date: selectedDate.value,
      time: selectedTime.value,
      department: selectedDept.value,
      doctor: selectedDoc.value?.name || '未知医生',
      cost: 10.00
    });
    ElMessage.success('挂号成功');
    router.push('/patient-portal/appointments');
  } catch (error) {
    ElMessage.error('挂号失败，请重试');
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.booking-container {
  max-width: 800px;
  margin: 0 auto;

  .step-content {
    padding: 20px 0;
  }

  .department-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;

    .dept-item {
      background-color: #f5f7fa;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: #ecf5ff;
        border-color: #409EFF;
        color: #409EFF;
      }
    }
  }

  .confirm-step {
    max-width: 600px;
    margin: 0 auto;
  }

  .time-selection {
    max-width: 600px;
    margin: 0 auto;
    
    .date-picker-container {
      margin-bottom: 30px;
      .label {
        margin-right: 15px;
        font-weight: bold;
      }
    }

    .time-slots {
      .label {
        font-weight: bold;
        margin-bottom: 15px;
        display: block;
      }
      .slots-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        
        .time-slot-item {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
