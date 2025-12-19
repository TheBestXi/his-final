package com.his.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "schedules", indexes = {
    @Index(name = "idx_doctor_date", columnList = "doctor_id, work_date"),
    @Index(name = "idx_dept_date", columnList = "department, work_date")
})
public class Schedule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Integer scheduleId;

    @Column(name = "doctor_id", nullable = false)
    private Integer doctorId;

    @Column(name = "doctor_name", nullable = false)
    private String doctorName;

    @Column(nullable = false, length = 50)
    private String department;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    @Column(nullable = false)
    private Integer shift; // 1: 上午, 2: 下午, 3: 晚班

    @Column(nullable = false)
    private Integer quota; // 总号源

    @Column(nullable = false)
    private Integer remaining; // 剩余号源

    @Column(nullable = false)
    private Integer status = 1; // 1: 正常, 0: 停诊

    @Version
    private Integer version;
}
