<template>
  <div class="profile-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>个人档案 (建档)</span>
        </div>
      </template>

      <el-form :model="form" label-width="100px" style="max-width: 600px; margin: 0 auto;">
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="form.idCard" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="既往史">
          <el-input v-model="form.history" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveProfile">保存档案</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';

const form = reactive({
  name: '张三',
  gender: 1,
  idCard: '110101199001011234',
  phone: '13800138000',
  history: ''
});

const saveProfile = () => {
  ElMessage.success('档案保存成功');
};
</script>

<style lang="scss" scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
