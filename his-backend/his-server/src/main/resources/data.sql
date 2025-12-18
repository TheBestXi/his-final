-- Internal Medicine System
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('王医生', '主任医师', '内科', '13800138001', 30);
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('张心', '副主任医师', '心血管科', '13800138011', 30);
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('李神', '主治医师', '神经内科', '13800138012', 30);
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('赵胃', '主任医师', '消化内科', '13800138013', 30);

-- Surgery System
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('张医生', '主治医师', '外科', '13800138002', 40);
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('郑骨', '主任医师', '骨科', '13800138010', 25);
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('陈尿', '副主任医师', '泌尿外科', '13800138014', 30);
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('孙普', '主治医师', '普外科', '13800138015', 40);

-- OB/GYN & Pediatrics
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('李医生', '住院医师', '儿科', '13800138003', 50);
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('赵医生', '副主任医师', '妇科', '13800138004', 35);
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('周产', '主任医师', '产科', '13800138016', 30);

-- ENT / Opth / Stom
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('陈医生', '主治医师', '眼科', '13800138005', 40);
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('吴医生', '主治医师', '耳鼻喉科', '13800138009', 40);
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('孙医生', '住院医师', '口腔科', '13800138007', 45);

-- Others
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('周医生', '副主任医师', '皮肤科', '13800138008', 30);
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('刘医生', '主任医师', '中医科', '13800138006', 20);
INSERT INTO doctors (name, title, department, phone, daily_quota) VALUES ('吴康', '康复治疗师', '康复科', '13800138017', 20);

INSERT INTO pharmacy_inventory (name, specification, manufacturer, category, price, quantity, unit, expiration_date) VALUES ('阿莫西林胶囊', '0.25g*24', '白云山制药', '抗生素', 25.50, 100, '盒', '2025-12-31');
INSERT INTO pharmacy_inventory (name, specification, manufacturer, category, price, quantity, unit, expiration_date) VALUES ('布洛芬缓释胶囊', '0.1g*100', '中美史克', '解热镇痛', 12.00, 50, '瓶', '2024-06-30');
