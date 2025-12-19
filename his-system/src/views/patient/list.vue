<template>
  <div class="app-container">
    <el-card>
      <div class="filter-container">
        <el-input
          v-model="searchQuery.name"
          placeholder="请输入患者姓名"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" class="filter-item" icon="Search" @click="handleSearch" style="margin-left: 10px;">
          搜索
        </el-button>
        <el-button type="success" class="filter-item" icon="Plus" @click="handleCreate" style="margin-left: 10px;">
          新建患者
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%; margin-top: 20px;"
      >
        <el-table-column prop="patientId" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            <el-tag :type="row.gender === 1 ? '' : 'danger'">
              {{ row.gender === 1 ? '男' : '女' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="80" align="center" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="idCard" label="身份证号" width="200" />
        <el-table-column label="操作" align="center" min-width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="success" size="small" @click="handleRegister(row)">
              挂号
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import { Search, Plus } from '@element-plus/icons-vue';
// import { getPatientList } from '../../api/patient';
import type { Patient } from '../../api/types';

const router = useRouter();
const loading = ref(false);
const list = ref<Patient[]>([]);
const searchQuery = reactive({
  name: ''
});

const getList = async () => {
  loading.value = true;
  try {
    // Mock data if API fails
    // const res = await getPatientList(searchQuery);
    // list.value = res.data;
    
    // Mocking for demo
    await new Promise(resolve => setTimeout(resolve, 500));
    list.value = [
      { patientId: 1, name: '张三', gender: 1, age: 30, phone: '13800138000', idCard: '110101199001011234' },
      { patientId: 2, name: '李四', gender: 2, age: 28, phone: '13900139000', idCard: '110101199202025678' }
    ].filter(item => !searchQuery.name || item.name.includes(searchQuery.name));

  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  getList();
};

const handleCreate = () => {
  router.push('/patient/detail');
};

const handleEdit = (row: Patient) => {
  router.push(`/patient/detail/${row.patientId}`);
};

const handleRegister = (row: Patient) => {
  router.push({
    path: '/registration/create',
    query: { pid: row.patientId, pname: row.name }
  });
};

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.filter-container {
  display: flex;
  align-items: center;
}
</style>
