<template>
  <div class="app-container">
    <el-card>
      <h2>药品库存</h2>
      <el-table :data="[]" border>
        <el-table-column label="药品名称" />
        <el-table-column label="库存" />
        <el-table-column label="有效期" />
      </el-table>
    </el-card>
  </div>
</template>
