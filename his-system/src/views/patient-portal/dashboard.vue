<template>
  <div class="patient-dashboard">
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <h2>{{ greeting }}，祝您健康每一天！</h2>
        <p>今天是 {{ currentDate }}</p>
      </div>
      <div class="welcome-image">
        <el-icon :size="80" color="rgba(255,255,255,0.8)"><Sunny /></el-icon>
      </div>
    </div>

    <el-row :gutter="20" class="action-row">
      <el-col :span="8">
        <el-card class="action-card" shadow="hover" @click="router.push('/patient-portal/booking')">
          <div class="card-content">
            <div class="icon-wrapper blue-bg">
              <el-icon :size="32" color="#fff"><Calendar /></el-icon>
            </div>
            <div class="text-content">
              <h3>预约挂号</h3>
              <p>选择科室医生，在线预约</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="action-card" shadow="hover" @click="router.push('/patient-portal/appointments')">
          <div class="card-content">
            <div class="icon-wrapper green-bg">
              <el-icon :size="32" color="#fff"><Tickets /></el-icon>
            </div>
            <div class="text-content">
              <h3>我的挂号</h3>
              <p>查看挂号记录和就诊状态</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="action-card" shadow="hover" @click="router.push('/patient-portal/profile')">
          <div class="card-content">
            <div class="icon-wrapper orange-bg">
              <el-icon :size="32" color="#fff"><User /></el-icon>
            </div>
            <div class="text-content">
              <h3>个人档案</h3>
              <p>完善个人信息，建立健康档案</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="section-container">
      <div class="section-header">
        <div class="title-left">
          <el-icon><List /></el-icon>
          <h3>最近挂号记录</h3>
        </div>
        <el-button type="primary" link @click="router.push('/patient-portal/appointments')">查看全部 ></el-button>
      </div>
      
      <el-card shadow="never" class="table-card">
        <el-table :data="recentAppointments" style="width: 100%" :empty-text="'暂无挂号记录'">
          <el-table-column prop="date" label="就诊日期" width="180">
            <template #default="{ row }">
              <div class="date-cell">
                <el-icon><Timer /></el-icon>
                <span>{{ row.date }} {{ row.time }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="department" label="科室" width="150" />
          <el-table-column prop="doctor" label="医生" width="150" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" effect="light" round>{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
             <template #default>
               <el-button type="primary" link>查看详情</el-button>
             </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Calendar, Tickets, User, Sunny, List, Timer } from '@element-plus/icons-vue';
import { getAppointments, type Appointment } from '../../api/mockData';

const router = useRouter();
const recentAppointments = ref<Appointment[]>([]);

const currentDate = computed(() => {
  const date = new Date();
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 星期${['日','一','二','三','四','五','六'][date.getDay()]}`;
});

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return '凌晨好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
});

const getStatusType = (status: string) => {
  switch (status) {
    case '待就诊': return 'warning';
    case '已完成': return 'success';
    case '已取消': return 'info';
    default: return '';
  }
};

onMounted(async () => {
  const data = await getAppointments();
  recentAppointments.value = data.slice(0, 5); // Take first 5
});
</script>

<style lang="scss" scoped>
.patient-dashboard {
  .welcome-banner {
    background: linear-gradient(135deg, #409EFF 0%, #36d1dc 100%);
    border-radius: 12px;
    padding: 30px 40px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);

    .welcome-content {
      h2 {
        margin: 0 0 10px;
        font-size: 24px;
        font-weight: 600;
      }
      p {
        margin: 0;
        opacity: 0.9;
        font-size: 16px;
      }
    }
  }

  .action-row {
    margin-bottom: 30px;
  }

  .action-card {
    cursor: pointer;
    transition: all 0.3s;
    border: none;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }

    .card-content {
      display: flex;
      align-items: center;
      padding: 10px;

      .icon-wrapper {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        flex-shrink: 0;

        &.blue-bg { background: linear-gradient(135deg, #409EFF, #79bbff); }
        &.green-bg { background: linear-gradient(135deg, #67C23A, #95d475); }
        &.orange-bg { background: linear-gradient(135deg, #E6A23C, #f3d19e); }
      }

      .text-content {
        h3 {
          margin: 0 0 8px;
          color: #303133;
          font-size: 18px;
        }
        p {
          margin: 0;
          color: #909399;
          font-size: 13px;
        }
      }
    }
  }

  .section-container {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #EBEEF5;

      .title-left {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #303133;
        
        h3 {
          margin: 0;
          font-size: 18px;
        }
      }
    }

    .table-card {
      border: none;
      
      .date-cell {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #606266;
      }
    }
  }
}
</style>
