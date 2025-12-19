package com.his.server.repository;

import com.his.server.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    List<Schedule> findByDoctorIdAndWorkDate(Integer doctorId, LocalDate workDate);
    List<Schedule> findByDepartmentAndWorkDate(String department, LocalDate workDate);
    Optional<Schedule> findByDoctorIdAndWorkDateAndShift(Integer doctorId, LocalDate workDate, Integer shift);
}
