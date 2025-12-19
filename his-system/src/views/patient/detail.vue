<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <span>{{ isEdit ? '编辑患者' : '新建患者' }}</span>
      </template>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" style="max-width: 600px;">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="0" :max="150" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="既往史">
          <el-input v-model="form.medicalHistory" type="textarea" :rows="3" placeholder="请输入既往病史" />
        </el-form-item>
        <el-form-item label="过敏史">
          <el-input v-model="form.allergyHistory" type="textarea" :rows="3" placeholder="请输入过敏史" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, type FormInstance } from 'element-plus';
// import { getPatientDetail, savePatient } from '../../api/patient';
import type { Patient } from '../../api/types';

const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>();

const form = reactive<Patient>({
  patientId: 0,
  name: '',
  gender: 1,
  age: 0,
  phone: '',
  idCard: '',
  medicalHistory: '',
  allergyHistory: ''
});

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
};

const isEdit = computed(() => !!route.params.id);

onMounted(async () => {
  if (isEdit.value) {
    const id = Number(route.params.id);
    // Mock fetch
    // const res = await getPatientDetail(id);
    // Object.assign(form, res.data);
    
    // Mock
    form.patientId = id;
    form.name = '张三';
    form.gender = 1;
    form.age = 30;
    form.phone = '13800138000';
    form.idCard = '110101199001011234';
  }
});

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // await savePatient(form);
        console.log('Save patient:', form);
        ElMessage.success('保存成功');
        router.push('/patient/list');
      } catch (error) {
        console.error(error);
      }
    }
  });
};

const handleCancel = () => {
  router.back();
};
</script>
