<template>
  <div class="app-container">
    <el-card>
      <h2>检查检验</h2>
      <el-table :data="[]" border>
        <el-table-column label="检查项目" />
        <el-table-column label="患者" />
        <el-table-column label="状态" />
        <el-table-column label="操作" />
      </el-table>
    </el-card>
  </div>
</template>
