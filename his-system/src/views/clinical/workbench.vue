<template>
  <div class="workbench-container">
    <div class="left-panel">
      <el-card class="box-card" :body-style="{ padding: '0px' }">
        <template #header>
          <div class="clearfix">
            <span>候诊列表</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="refreshQueue">刷新</el-button>
          </div>
        </template>
        <div v-for="item in queue" :key="item.appointmentId" class="queue-item" :class="{ active: currentPatient?.appointmentId === item.appointmentId }" @click="selectPatient(item)">
          <div class="name">{{ item.patientName }}</div>
          <div class="status">
            <el-tag size="small" :type="getStatusType(item.status)">{{ getStatusText(item.status) }}</el-tag>
          </div>
        </div>
        <div v-if="queue.length === 0" class="empty-text">暂无候诊患者</div>
      </el-card>
    </div>

    <div class="middle-panel">
      <el-card class="box-card" style="height: 100%; overflow-y: auto;">
        <template #header>
          <div class="clearfix">
            <span>病历书写</span>
            <div style="float: right;">
              <el-button type="primary" size="small" :disabled="!isConsulting" @click="handleSaveRecord">保存病历</el-button>
              <el-button type="success" size="small" :disabled="!canStart" @click="handleStart">开始就诊</el-button>
              <el-button type="danger" size="small" :disabled="!isConsulting" @click="handleFinish">结束就诊</el-button>
            </div>
          </div>
        </template>
        
        <el-form v-if="currentPatient" :model="medicalRecord" label-position="top">
          <el-form-item label="当前患者">
             <span style="font-weight: bold; font-size: 16px;">{{ currentPatient.patientName }}</span> 
             (ID: {{ currentPatient.pid }})
          </el-form-item>
          <el-form-item label="主诉">
            <el-input v-model="medicalRecord.chiefComplaint" type="textarea" :rows="2" :disabled="!isConsulting" />
          </el-form-item>
          <el-form-item label="现病史">
            <el-input v-model="medicalRecord.presentIllness" type="textarea" :rows="3" :disabled="!isConsulting" />
          </el-form-item>
          <el-form-item label="体格检查">
            <el-input v-model="medicalRecord.physicalExam" type="textarea" :rows="3" :disabled="!isConsulting" />
          </el-form-item>
          <el-form-item label="初步诊断">
            <el-input v-model="medicalRecord.diagnosis" type="textarea" :rows="2" :disabled="!isConsulting" />
          </el-form-item>
        </el-form>
        <div v-else class="empty-placeholder">
          请选择左侧患者开始就诊
        </div>
      </el-card>
    </div>

    <div class="right-panel">
      <el-tabs type="border-card" style="height: 100%;">
        <el-tab-pane label="处方">
          <div class="tool-actions">
            <el-button type="primary" size="small" icon="Plus" :disabled="!isConsulting" @click="addPrescription">开立药品</el-button>
          </div>
          <el-table :data="prescriptions" size="small" style="width: 100%; margin-top: 10px;">
             <el-table-column prop="name" label="药品名称" />
             <el-table-column prop="usage" label="用法" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="检查">
          <div class="tool-actions">
            <el-button type="primary" size="small" icon="Plus" :disabled="!isConsulting" @click="addTest">开立检查</el-button>
          </div>
          <el-table :data="tests" size="small" style="width: 100%; margin-top: 10px;">
             <el-table-column prop="name" label="项目名称" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="历史病历">
          <div class="empty-text">暂无历史记录</div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Dialogs -->
    <el-dialog v-model="prescriptionDialogVisible" title="开立处方">
      <el-form :model="prescriptionForm">
        <el-form-item label="药品名称">
          <el-input v-model="prescriptionForm.name" placeholder="Mock: 输入药品名称" />
        </el-form-item>
        <el-form-item label="用法用量">
          <el-input v-model="prescriptionForm.usage" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="prescriptionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmPrescription">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import type { Appointment } from '../../api/types';
// import { getMyQueue } from '../../api/clinical';

const queue = ref<Appointment[]>([]);
const currentPatient = ref<Appointment | null>(null);

const medicalRecord = reactive({
  chiefComplaint: '',
  presentIllness: '',
  physicalExam: '',
  diagnosis: ''
});

const prescriptions = ref<any[]>([]);
const tests = ref<any[]>([]);

const prescriptionDialogVisible = ref(false);
const prescriptionForm = reactive({ name: '', usage: '' });

// Status: 1:待就诊, 2:就诊中, 3:已完成
const isConsulting = computed(() => currentPatient.value?.status === 2);
const canStart = computed(() => currentPatient.value?.status === 1);

const getStatusText = (status: number) => {
  switch(status) {
    case 1: return '待就诊';
    case 2: return '就诊中';
    case 3: return '已完成';
    default: return '未知';
  }
};

const getStatusType = (status: number) => {
  switch(status) {
    case 1: return 'warning';
    case 2: return 'success';
    case 3: return 'info';
    default: return '';
  }
};

const refreshQueue = async () => {
  try {
    // const res = await getMyQueue();
    // queue.value = res.data;
    
    // Mock
    queue.value = [
      { appointmentId: 101, pid: 1, patientName: '张三', status: 2, registrationDate: '2023-10-01', doctorId: 1, department: '内科', registrationFee: 10 },
      { appointmentId: 102, pid: 2, patientName: '李四', status: 1, registrationDate: '2023-10-01', doctorId: 1, department: '内科', registrationFee: 10 },
      { appointmentId: 103, pid: 3, patientName: '王五', status: 3, registrationDate: '2023-10-01', doctorId: 1, department: '内科', registrationFee: 10 }
    ];
  } catch (error) {
    console.error(error);
  }
};

const selectPatient = (patient: Appointment) => {
  currentPatient.value = patient;
  // Clear or load record
  if (patient.status === 1) {
    // Clear
    medicalRecord.chiefComplaint = '';
    medicalRecord.presentIllness = '';
    medicalRecord.physicalExam = '';
    medicalRecord.diagnosis = '';
  } else {
    // Load mock record
    medicalRecord.chiefComplaint = '头痛';
    medicalRecord.presentIllness = '持续3天';
  }
};

const handleStart = () => {
  if (currentPatient.value) {
    currentPatient.value.status = 2;
    ElMessage.success('开始就诊');
  }
};

const handleFinish = () => {
  if (currentPatient.value) {
    currentPatient.value.status = 3;
    ElMessage.success('就诊结束');
    currentPatient.value = null; // Clear selection
  }
};

const handleSaveRecord = () => {
  ElMessage.success('病历已保存');
};

const addPrescription = () => {
  prescriptionDialogVisible.value = true;
};

const confirmPrescription = () => {
  prescriptions.value.push({ ...prescriptionForm });
  prescriptionDialogVisible.value = false;
  prescriptionForm.name = '';
  prescriptionForm.usage = '';
  ElMessage.success('处方开立成功');
};

const addTest = () => {
  ElMessage.info('Mock: 开立检查弹窗');
};

onMounted(() => {
  refreshQueue();
});
</script>

<style lang="scss" scoped>
.workbench-container {
  display: flex;
  height: calc(100vh - 100px); // Adjust based on header/padding
  gap: 10px;

  .left-panel {
    width: 250px;
    display: flex;
    flex-direction: column;
    
    .queue-item {
      padding: 10px 15px;
      border-bottom: 1px solid #EBEEF5;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      &:hover {
        background-color: #F5F7FA;
      }
      
      &.active {
        background-color: #ecf5ff;
        border-right: 2px solid #409EFF;
      }
      
      .name {
        font-weight: 500;
      }
    }
  }

  .middle-panel {
    flex: 1;
    min-width: 400px;
  }

  .right-panel {
    width: 300px;
  }
  
  .empty-text {
    padding: 20px;
    text-align: center;
    color: #909399;
  }
  
  .empty-placeholder {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #909399;
    font-size: 16px;
  }
}
</style>
