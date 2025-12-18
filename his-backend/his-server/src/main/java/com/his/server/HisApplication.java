package com.his.server;

import com.his.server.entity.Doctor;
import com.his.server.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Arrays;

@SpringBootApplication
@EnableScheduling
@EnableJpaAuditing
@ComponentScan(basePackages = {"com.his"})
@EntityScan(basePackages = {"com.his"})
public class HisApplication {
    public static void main(String[] args) {
        SpringApplication.run(HisApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(DoctorRepository doctorRepository) {
        return args -> {
            if (doctorRepository.count() == 0) {
                System.out.println("Initializing Doctor Data...");
                doctorRepository.saveAll(Arrays.asList(
                    createDoctor("王医生", "主任医师", "内科", "13800138001", 30),
                    createDoctor("张心", "副主任医师", "心血管科", "13800138011", 30),
                    createDoctor("李神", "主治医师", "神经内科", "13800138012", 30),
                    createDoctor("赵胃", "主任医师", "消化内科", "13800138013", 30),
                    createDoctor("张医生", "主治医师", "外科", "13800138002", 40),
                    createDoctor("郑骨", "主任医师", "骨科", "13800138010", 25),
                    createDoctor("陈尿", "副主任医师", "泌尿外科", "13800138014", 30),
                    createDoctor("孙普", "主治医师", "普外科", "13800138015", 40),
                    createDoctor("李医生", "住院医师", "儿科", "13800138003", 50),
                    createDoctor("赵医生", "副主任医师", "妇科", "13800138004", 35),
                    createDoctor("周产", "主任医师", "产科", "13800138016", 30),
                    createDoctor("陈医生", "主治医师", "眼科", "13800138005", 40),
                    createDoctor("吴医生", "主治医师", "耳鼻喉科", "13800138009", 40),
                    createDoctor("孙医生", "住院医师", "口腔科", "13800138007", 45),
                    createDoctor("周医生", "副主任医师", "皮肤科", "13800138008", 30),
                    createDoctor("刘医生", "主任医师", "中医科", "13800138006", 20),
                    createDoctor("吴康", "康复治疗师", "康复科", "13800138017", 20)
                ));
                System.out.println("Doctor Data Initialized: " + doctorRepository.count());
            } else {
                System.out.println("Doctor Data already exists: " + doctorRepository.count());
            }
        };
    }

    private Doctor createDoctor(String name, String title, String department, String phone, Integer quota) {
        Doctor d = new Doctor();
        d.setName(name);
        d.setTitle(title);
        d.setDepartment(department);
        d.setPhone(phone);
        d.setDailyQuota(quota);
        return d;
    }
}
