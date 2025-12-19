package com.his.server.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AppointmentDTO {
    private Integer pid;
    private Integer doctorId;
    private String department;
    private Integer scheduleId;
    private LocalDate registrationDate;
    private BigDecimal registrationFee;
}
