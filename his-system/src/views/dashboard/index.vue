<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon blue">
              <el-icon><Tickets /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">今日挂号量</div>
              <div class="stat-value">128</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon green">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">今日收入</div>
              <div class="stat-value">¥ 12,580.00</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon orange">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">医生在岗数</div>
              <div class="stat-value">15</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span><el-icon><TrendCharts /></el-icon> 近7天营收趋势</span>
            </div>
          </template>
          <div class="chart-container">
            <div class="bar-chart">
              <div class="bar-item" v-for="(item, index) in chartData" :key="index">
                <div class="bar-track">
                  <div class="bar-fill" :style="{ height: item.percentage + '%' }">
                    <span class="bar-value">¥{{ item.value }}</span>
                  </div>
                </div>
                <span class="bar-label">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="rank-card">
          <template #header>
            <div class="card-header">
              <span><el-icon><Trophy /></el-icon> 热门医生 Top5</span>
            </div>
          </template>
          <el-table :data="topDoctors" style="width: 100%" size="small" :row-class-name="tableRowClassName">
            <el-table-column type="index" width="50" />
            <el-table-column prop="name" label="姓名">
              <template #default="{ row }">
                <span class="doctor-name">{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="department" label="科室" />
            <el-table-column prop="count" label="接诊量" align="right">
              <template #default="{ row }">
                <span class="count-badge">{{ row.count }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Tickets, Money, User, TrendCharts, Trophy } from '@element-plus/icons-vue';

const topDoctors = ref([
  { name: '张医生', department: '内科', count: 45 },
  { name: '李医生', department: '外科', count: 38 },
  { name: '王医生', department: '儿科', count: 32 },
  { name: '赵医生', department: '中医科', count: 28 },
  { name: '孙医生', department: '口腔科', count: 25 },
]);

const chartData = ref([
  { date: '12-14', value: 8500, percentage: 60 },
  { date: '12-15', value: 9200, percentage: 65 },
  { date: '12-16', value: 7800, percentage: 55 },
  { date: '12-17', value: 11000, percentage: 78 },
  { date: '12-18', value: 10500, percentage: 75 },
  { date: '12-19', value: 13500, percentage: 95 },
  { date: '12-20', value: 12580, percentage: 88 },
]);

const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex === 0) return 'top-1-row';
  if (rowIndex === 1) return 'top-2-row';
  if (rowIndex === 2) return 'top-3-row';
  return '';
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  .stat-card {
    border: none;
    border-radius: 12px;
    
    .stat-content {
      display: flex;
      align-items: center;
      padding: 10px;
      
      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        font-size: 24px;
        color: white;
        
        &.blue { background: #409EFF; box-shadow: 0 4px 10px rgba(64, 158, 255, 0.3); }
        &.green { background: #67C23A; box-shadow: 0 4px 10px rgba(103, 194, 58, 0.3); }
        &.orange { background: #E6A23C; box-shadow: 0 4px 10px rgba(230, 162, 60, 0.3); }
      }
      
      .stat-info {
        .stat-title {
          font-size: 14px;
          color: #909399;
          margin-bottom: 5px;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
        }
      }
    }
  }

  .chart-card, .rank-card {
    border: none;
    border-radius: 12px;
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: bold;
      color: #303133;
    }
  }

  .chart-container {
    height: 300px;
    padding: 20px 0;
    
    .bar-chart {
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      
      .bar-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        width: 40px;
        
        .bar-track {
          flex: 1;
          width: 100%;
          display: flex;
          align-items: flex-end;
          background: #f0f2f5;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          
          .bar-fill {
            width: 100%;
            background: linear-gradient(180deg, #409EFF 0%, #79bbff 100%);
            border-radius: 20px;
            transition: height 0.6s ease;
            position: relative;
            
            &:hover {
              background: linear-gradient(180deg, #66b1ff 0%, #a0cfff 100%);
            }
            
            .bar-value {
              position: absolute;
              top: -25px;
              left: 50%;
              transform: translateX(-50%);
              font-size: 12px;
              color: #409EFF;
              font-weight: bold;
              white-space: nowrap;
            }
          }
        }
        
        .bar-label {
          margin-top: 10px;
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  .doctor-name {
    font-weight: 500;
  }
  
  .count-badge {
    background: #f0f2f5;
    padding: 2px 8px;
    border-radius: 10px;
    color: #606266;
    font-size: 12px;
  }
}
</style>
