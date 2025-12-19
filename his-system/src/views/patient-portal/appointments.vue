<template>
  <div class="appointments-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>我的挂号记录</span>
        </div>
      </template>

      <el-table :data="appointments" style="width: 100%" stripe v-loading="loading">
        <el-table-column prop="id" label="挂号单号" width="180" />
        <el-table-column prop="date" label="就诊日期" width="180" sortable />
        <el-table-column prop="time" label="就诊时间" width="120" />
        <el-table-column prop="department" label="科室" width="120" />
        <el-table-column prop="doctor" label="医生" width="120" />
        <el-table-column prop="cost" label="挂号费" width="100">
          <template #default="{ row }">
            ¥ {{ row.cost.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" size="small" v-if="row.status === '待就诊'" @click="handleCancel(row)">取消挂号</el-button>
            <el-button type="text" size="small" v-else>查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="10"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getAppointments, cancelAppointment, type Appointment } from '../../api/mockData';

const appointments = ref<Appointment[]>([]);
const loading = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    appointments.value = await getAppointments();
  } catch (error) {
    ElMessage.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

const handleCancel = (row: Appointment) => {
  ElMessageBox.confirm(
    '确定要取消该挂号吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await cancelAppointment(row.id);
      ElMessage.success('取消成功');
      fetchData(); // Refresh list
    })
    .catch(() => {
      // cancel
    });
};

onMounted(() => {
  fetchData();
});

const getStatusType = (status: string) => {
  switch (status) {
    case '待就诊': return 'warning';
    case '已完成': return 'success';
    case '已取消': return 'info';
    default: return '';
  }
};
</script>

<style lang="scss" scoped>
.appointments-container {
  max-width: 1000px;
  margin: 0 auto;

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
