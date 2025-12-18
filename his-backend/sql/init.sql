-- Initialize Database
CREATE DATABASE IF NOT EXISTS his_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE his_system;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Patients
DROP TABLE IF EXISTS patients;
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    gender INT NOT NULL COMMENT '1=Male, 2=Female',
    age INT NOT NULL,
    id_card VARCHAR(20),
    phone VARCHAR(20),
    address VARCHAR(200),
    medical_history TEXT,
    allergy_history TEXT,
    is_deleted INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Doctors
DROP TABLE IF EXISTS doctors;
CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    title VARCHAR(50),
    department VARCHAR(50),
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Appointments
DROP TABLE IF EXISTS appointments;
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    department VARCHAR(50),
    registration_date DATE,
    registration_time TIME,
    registration_fee DECIMAL(10, 2),
    status INT DEFAULT 1 COMMENT '1=Waiting, 2=In Progress, 3=Completed, 4=Cancelled',
    consult_start_time DATETIME,
    consult_end_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_date (registration_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Medical Records
DROP TABLE IF EXISTS medical_records;
CREATE TABLE medical_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_id INT NOT NULL,
    chief_complaint TEXT,
    present_illness TEXT,
    physical_examination TEXT,
    preliminary_diagnosis TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient (patient_id),
    INDEX idx_appt (appointment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Pharmacy Inventory
DROP TABLE IF EXISTS pharmacy_inventory;
CREATE TABLE pharmacy_inventory (
    medicine_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specification VARCHAR(100),
    manufacturer VARCHAR(100),
    category VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit VARCHAR(20),
    expiration_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Prescriptions
DROP TABLE IF EXISTS prescriptions;
CREATE TABLE prescriptions (
    prescription_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_id INT NOT NULL,
    medicine_id INT,
    medicine_name VARCHAR(100),
    dosage VARCHAR(100),
    dosage_unit VARCHAR(20),
    frequency VARCHAR(50),
    quantity INT,
    total_cost DECIMAL(10, 2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_appt (appointment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tests
DROP TABLE IF EXISTS tests;
CREATE TABLE tests (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT,
    appointment_id INT,
    test_type INT COMMENT 'Type Enum',
    test_date DATE,
    result TEXT,
    status INT DEFAULT 0 COMMENT '0=Pending, 1=Completed',
    test_fee DECIMAL(10, 2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Finance
DROP TABLE IF EXISTS finance;
CREATE TABLE finance (
    finance_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT,
    prescription_id INT,
    registration_fee DECIMAL(10, 2),
    medicine_fee DECIMAL(10, 2),
    discount DECIMAL(10, 2) DEFAULT 0,
    total_fee DECIMAL(10, 2),
    payment_status INT DEFAULT 0 COMMENT '0=Unpaid, 1=Paid',
    payment_time DATETIME,
    payment_method VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Discounts
DROP TABLE IF EXISTS discounts;
CREATE TABLE discounts (
    discount_id INT AUTO_INCREMENT PRIMARY KEY,
    discount_code VARCHAR(50) UNIQUE,
    discount_value DECIMAL(10, 2),
    valid_from DATETIME,
    valid_until DATETIME,
    description VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Statistics
DROP TABLE IF EXISTS statistics;
CREATE TABLE statistics (
    statistic_id INT AUTO_INCREMENT PRIMARY KEY,
    statistic_type VARCHAR(50),
    value DECIMAL(10, 2),
    statistic_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. User Accounts (Auth)
DROP TABLE IF EXISTS user_accounts;
CREATE TABLE user_accounts (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    status INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- Initial Data
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES 
('王医生', '主任医师', '内科', '13800138001', 30),
('张医生', '主治医师', '外科', '13800138002', 40),
('李医生', '住院医师', '儿科', '13800138003', 50),
('赵医生', '副主任医师', '妇科', '13800138004', 35),
('陈医生', '主治医师', '眼科', '13800138005', 40),
('刘医生', '主任医师', '中医科', '13800138006', 20),
('孙医生', '住院医师', '口腔科', '13800138007', 45),
('周医生', '副主任医师', '皮肤科', '13800138008', 30),
('吴医生', '主治医师', '耳鼻喉科', '13800138009', 40),
('郑医生', '主任医师', '骨科', '13800138010', 25);

INSERT INTO pharmacy_inventory (name, specification, manufacturer, category, price, stock_quantity, unit, expiration_date) VALUES 
('阿莫西林胶囊', '0.25g*24', '白云山制药', '抗生素', 25.50, 100, '盒', '2025-12-31'),
('布洛芬缓释胶囊', '0.1g*100', '中美史克', '解热镇痛', 12.00, 50, '瓶', '2024-06-30');
