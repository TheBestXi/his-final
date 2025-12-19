package com.his.server.controller;

import com.his.common.result.GlobalResult;
import com.his.server.entity.Schedule;
import com.his.server.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "排班管理")
@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @Operation(summary = "查询排班")
    @GetMapping("/daily")
    public GlobalResult<List<Schedule>> listDaily(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return GlobalResult.success(scheduleService.listDailySchedules(department, date));
    }

    @Operation(summary = "创建排班 (管理员/医生)")
    @PostMapping
    public GlobalResult<Schedule> create(@RequestBody ScheduleDTO dto) {
        return GlobalResult.success(scheduleService.createSchedule(
                dto.getDoctorId(), dto.getDate(), dto.getShift(), dto.getQuota()));
    }
    
    @lombok.Data
    public static class ScheduleDTO {
        private Integer doctorId;
        private LocalDate date;
        private Integer shift;
        private Integer quota;
    }
}
