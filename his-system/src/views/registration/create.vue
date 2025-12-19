<template>
  <div class="app-container">
    <el-card>
      <h2>挂号办理</h2>
      <el-form label-width="100px">
        <el-form-item label="患者">
          <el-button type="primary" icon="Search">选择患者</el-button>
        </el-form-item>
        <el-form-item label="科室">
          <el-select placeholder="请选择科室">
            <el-option label="内科" value="1" />
            <el-option label="外科" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="医生">
          <el-select placeholder="请选择医生">
            <el-option label="张医生" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">确认挂号</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
