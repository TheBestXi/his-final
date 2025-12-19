package com.his.server.service;

import com.his.common.exception.BusinessException;
import com.his.server.entity.Doctor;
import com.his.server.entity.Schedule;
import com.his.server.repository.DoctorRepository;
import com.his.server.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DoctorRepository doctorRepository;

    public List<Schedule> listDailySchedules(String department, LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        if (department != null && !department.isEmpty()) {
            return scheduleRepository.findByDepartmentAndWorkDate(department, date);
        }
        // If no department, maybe return all or empty? Returning empty for safety or all logic
        return List.of(); 
    }

    @Transactional
    public Schedule createSchedule(Integer doctorId, LocalDate date, Integer shift, Integer quota) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new BusinessException("医生不存在"));
        
        // Check duplicate
        if (scheduleRepository.findByDoctorIdAndWorkDateAndShift(doctorId, date, shift).isPresent()) {
            throw new BusinessException("该时段已有排班");
        }

        Schedule schedule = new Schedule();
        schedule.setDoctorId(doctorId);
        schedule.setDoctorName(doctor.getName());
        schedule.setDepartment(doctor.getDepartment());
        schedule.setWorkDate(date);
        schedule.setShift(shift);
        schedule.setQuota(quota);
        schedule.setRemaining(quota);
        
        return scheduleRepository.save(schedule);
    }
}
