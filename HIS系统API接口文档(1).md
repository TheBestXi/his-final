# HIS系统API接口文档

## 目录
1. [通用响应格式](#通用响应格式)
2. [认证管理](#认证管理)
3. [患者管理](#患者管理)
4. [医生管理](#医生管理)
5. [挂号管理](#挂号管理)
6. [病历管理](#病历管理)
7. [处方管理](#处方管理)
8. [药房管理](#药房管理)
9. [财务管理](#财务管理)
10. [检查管理](#检查管理)
11. [统计相关](#统计相关)
12. [文件管理](#文件管理)

---

## 通用响应格式

所有接口返回统一的响应格式：

```json
{
  "code": 200,        // 状态码 (200成功, 500系统错误, 401未认证等)
  "message": "成功",   // 提示信息
  "data": {},         // 业务数据
  "timestamp": "2023-12-18T10:30:00"  // 响应时间戳
}
```

---

## 认证管理 (Authentication)

### 2.1 注册

**接口地址：** `POST /api/auth/register`

**请求头：**
```
Content-Type: application/json
```

**请求体：**
```json
{
  "phone": "13800138000",
  "password": "password123",
  "name": "张三",
  "gender": 1,
  "age": 30,
  "address": "北京市",
  "allergy": "无"
}
```

### 2.2 登录

**接口地址：** `POST /api/auth/login`

**请求体：**
```json
{
  "phone": "13800138000",
  "password": "password123"
}
```

### 2.3 获取当前用户

**接口地址：** `GET /api/auth/me`

**说明：** 获取当前登录用户的基本信息

### 2.4 退出登录

**接口地址：** `POST /api/auth/logout`

---

## 患者管理 (Patient Management)

### 3.1 搜索患者

**接口地址：** `GET /api/patient/search`

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | String | 是 | 患者姓名 |

**请求示例：**
```
GET /api/patient/search?name=张三
```

### 3.2 创建/更新患者

**接口地址：** `POST /api/patient`

**请求体：**
```json
{
  "name": "张三",
  "gender": 1,
  "age": 35,
  "phone": "13800138000",
  "address": "北京市朝阳区",
  "idCard": "110101199001011234",
  "medicalHistory": "高血压病史",
  "allergyHistory": "青霉素过敏"
}
```

### 3.3 获取患者详情

**接口地址：** `GET /api/patient/{id}`

---

## 医生管理 (Doctor Management)

### 4.1 查询医生列表

**接口地址：** `GET /api/doctor`

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| department | String | 否 | 科室名称 |

### 4.2 添加医生

**接口地址：** `POST /api/doctor`

**请求体：**
```json
{
  "name": "李医生",
  "title": "主任医师",
  "department": "内科",
  "phone": "13900139000"
}
```

---

## 挂号管理 (Appointment Management)

### 5.1 创建挂号单

**接口地址：** `POST /api/appointment`

**请求体：**
```json
{
  "pid": 1,
  "doctorId": 2,
  "department": "内科",
  "registrationDate": "2023-12-18",
  "registrationFee": 10.00
}
```

### 5.2 查询患者的挂号记录

**接口地址：** `GET /api/appointment/patient/{pid}`

### 5.3 更新挂号状态

**接口地址：** `PUT /api/appointment/{id}/status`

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Integer | 是 | 挂号ID |
| status | Integer | 是 | 状态值 (0: 待支付, 1: 已支付, 2: 已就诊, 3: 已取消) |

---

## 病历管理 (Medical Record Management)

### 6.1 创建病历

**接口地址：** `POST /api/medical-record`

**请求体：**
```json
{
  "pid": 1,
  "doctorId": 2,
  "appointmentId": 3,
  "chiefComplaint": "头痛",
  "presentIllness": "患者自述头痛3天",
  "physicalExamination": "体温正常，血压偏高",
  "preliminaryDiagnosis": "偏头痛"
}
```

### 6.2 查询患者病历

**接口地址：** `GET /api/medical-record/patient/{pid}`

### 6.3 查询挂号单病历

**接口地址：** `GET /api/medical-record/appointment/{appointmentId}`

---

## 处方管理 (Prescription Management)

### 7.1 开具处方

**接口地址：** `POST /api/prescription`

**请求体：**
```json
{
  "pid": 1,
  "doctorId": 2,
  "appointmentId": 3,
  "medicineId": 101,
  "dosage": "5mg",
  "dosageUnit": "片",
  "frequency": "每日三次",
  "quantity": 21
}
```

### 7.2 查询患者处方

**接口地址：** `GET /api/prescription/patient/{pid}`

---

## 药房管理 (Pharmacy Management)

### 8.1 查询药品库存

**接口地址：** `GET /api/pharmacy/inventory`

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | String | 否 | 药品名称 |
| category | String | 否 | 药品类别 |

### 8.2 查询临期药品

**接口地址：** `GET /api/pharmacy/inventory/expiring`

### 8.3 添加/更新药品

**接口地址：** `POST /api/pharmacy/inventory`

**请求体：**
```json
{
  "name": "阿莫西林",
  "specification": "0.25g*24粒",
  "manufacturer": "华北制药",
  "category": "抗生素",
  "price": 15.50,
  "quantity": 100,
  "unit": "盒",
  "expirationDate": "2024-12-31"
}
```

### 8.4 发药

**接口地址：** `POST /api/pharmacy/dispense`

**请求参数：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| prescriptionId | Integer | 是 | 处方ID |
| medicineId | Integer | 是 | 药品ID |
| quantity | Integer | 是 | 数量 |
| operator | String | 是 | 操作员 |

---

## 财务管理 (Finance Management)

### 9.1 生成账单

**接口地址：** `POST /api/finance/bill/{appointmentId}`

### 9.2 支付账单

**接口地址：** `POST /api/finance/{financeId}/pay`

### 9.3 查询挂号单账单

**接口地址：** `GET /api/finance/appointment/{appointmentId}`

---

## 检查管理 (Test Management)

### 10.1 申请检查

**接口地址：** `POST /api/test`

**请求体：**
```json
{
  "pid": 1,
  "doctorId": 2,
  "appointmentId": 3,
  "testType": 1,
  "testFee": 50.00
}
```

### 10.2 查询患者检查

**接口地址：** `GET /api/test/patient/{pid}`

### 10.3 查询挂号单检查

**接口地址：** `GET /api/test/appointment/{appointmentId}`

### 10.4 更新检查状态/结果

**接口地址：** `PUT /api/test/{testId}/status`

---

## 统计相关 (Statistics)

### 11.1 获取挂号统计

**接口地址：** `GET /api/statistics/registration`
(兼容接口)

### 11.2 获取医生工作量

**接口地址：** `GET /api/statistics/doctor/workload`
(兼容接口)

### 11.3 获取每日统计

**接口地址：** `GET /api/statistics/daily`

### 11.4 获取营收趋势

**接口地址：** `GET /api/statistics/revenue`

---

## 文件管理 (File Management)

### 12.1 文件上传

**接口地址：** `POST /api/file/upload`

**请求头：** `Content-Type: multipart/form-data`

**参数：** `file` (Binary)

**响应：** 返回文件名 (fileName)

### 12.2 文件下载

**接口地址：** `GET /api/file/{fileName}`

**注意：** 路径参数为文件名。

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未认证/未授权 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

*文档版本：v1.1*
*更新日期：2025-12-18*
