package com.his.server.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "patients", indexes = {
    @Index(name = "idx_name", columnList = "name"),
    @Index(name = "idx_is_deleted", columnList = "is_deleted")
})
@SQLDelete(sql = "UPDATE patients SET is_deleted = 1 WHERE patient_id = ?")
@Where(clause = "is_deleted = 0")
public class Patient extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Integer patientId;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "id_card")
    private String idCard;

    @Column(nullable = false)
    private Integer gender; // 1=男, 2=女

    @Column(nullable = false)
    private Integer age;

    @Column(length = 20)
    private String phone;

    @Column(length = 200)
    private String address;

    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(name = "allergy_history", columnDefinition = "TEXT")
    private String allergyHistory;

    @Column(name = "is_deleted", nullable = false)
    private Integer isDeleted = 0;
}
