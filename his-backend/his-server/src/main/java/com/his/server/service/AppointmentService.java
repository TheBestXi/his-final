package com.his.server.service;

import com.his.common.exception.BusinessException;
import com.his.server.dto.AppointmentDTO;
import com.his.server.entity.Appointment;
import com.his.server.entity.Doctor;
import com.his.server.entity.Patient;
import com.his.server.entity.Schedule;
import com.his.server.repository.AppointmentRepository;
import com.his.server.repository.DoctorRepository;
import com.his.server.repository.PatientRepository;
import com.his.server.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ScheduleRepository scheduleRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<Appointment> listByPatient(Integer pid) {
        try {
            return appointmentRepository.findByPidOrPatientId(pid, pid);
        } catch (Exception e) {
            throw new BusinessException(500, "查询挂号记录失败: " + e.getMessage());
        }
    }

    public List<Appointment> listWaitingQueue(Integer doctorId) {
        return appointmentRepository.findByDoctorIdAndRegistrationDateAndStatusOrderBySerialNumberAsc(
            doctorId, java.time.LocalDate.now(), 1 // 1=待就诊
        );
    }

    public void callPatient(Integer appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new BusinessException("挂号单不存在"));
        
        // 广播叫号消息
        // 格式: { type: "CALL", appointmentId: 1, name: "张三", serialNumber: 5, dept: "内科" }
        java.util.Map<String, Object> message = new java.util.HashMap<>();
        message.put("type", "CALL");
        message.put("appointmentId", appointment.getAppointmentId());
        message.put("name", patientRepository.findById(appointment.getPid()).map(Patient::getName).orElse("未知"));
        message.put("serialNumber", appointment.getSerialNumber());
        message.put("department", appointment.getDepartment());
        message.put("doctorId", appointment.getDoctorId());
        
        messagingTemplate.convertAndSend("/topic/call", message);
    }

    @Transactional
    public void cancelAppointment(Integer appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new BusinessException("挂号单不存在"));
        
        if (appointment.getStatus() == 3) {
            throw new BusinessException("已完成的挂号单无法取消");
        }
        
        appointment.setStatus(0); // 0=已取消
        appointmentRepository.save(appointment);

        // 恢复号源
        if (appointment.getScheduleId() != null) {
            scheduleRepository.findById(appointment.getScheduleId()).ifPresent(schedule -> {
                schedule.setRemaining(schedule.getRemaining() + 1);
                scheduleRepository.save(schedule);
            });
        }
    }

    @Transactional
    public Appointment createAppointment(AppointmentDTO dto) {
        try {
            return doCreateAppointment(dto);
        } catch (org.springframework.orm.ObjectOptimisticLockingFailureException e) {
            throw new BusinessException("号源已被抢占，请重试");
        }
    }

    private Appointment doCreateAppointment(AppointmentDTO dto) {
        // 1. 校验患者是否存在
        Patient patient = patientRepository.findById(dto.getPid())
                .orElseThrow(() -> new BusinessException("患者不存在"));

        // 2. 校验医生是否存在
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new BusinessException("医生不存在"));

        // 3. 校验排班并扣减库存
        Schedule schedule;
        if (dto.getScheduleId() != null) {
            schedule = scheduleRepository.findById(dto.getScheduleId())
                    .orElseThrow(() -> new BusinessException("排班不存在"));
        } else {
            // 如果未传 scheduleId，尝试按 doctor + date 查找（假设只有全天一个班次，或默认取第一个）
            // 这里为了简化，建议前端必须传 scheduleId。若不传，则只校验日期。
             // 暂时简单处理：如果不传，就不扣库存（兼容旧逻辑），但建议强制。
             // 为了严谨，我们尝试查找
             List<Schedule> schedules = scheduleRepository.findByDoctorIdAndWorkDate(dto.getDoctorId(), dto.getRegistrationDate());
             if (schedules.isEmpty()) {
                 throw new BusinessException("该医生当日无排班");
             }
             schedule = schedules.get(0); // 默认取第一个
        }

        if (schedule.getRemaining() <= 0) {
            throw new BusinessException("号源已约满");
        }
        schedule.setRemaining(schedule.getRemaining() - 1);
        scheduleRepository.save(schedule);

        // 4. 创建挂号单
        Appointment appointment = new Appointment();
        appointment.setPid(patient.getPid());
        appointment.setPatientId(patient.getPid());
        appointment.setDoctorId(doctor.getDoctorId());
        appointment.setDepartment(dto.getDepartment());
        appointment.setScheduleId(schedule.getScheduleId());
        appointment.setRegistrationDate(dto.getRegistrationDate());
        appointment.setRegistrationTime(LocalTime.now());
        appointment.setRegistrationFee(dto.getRegistrationFee());
        appointment.setStatus(1); // 1=待就诊
        
        // 生成序号: 总号源 - 剩余号源
        appointment.setSerialNumber(schedule.getQuota() - schedule.getRemaining());

        // 5. 保存并广播
        Appointment savedAppointment = appointmentRepository.save(appointment);
        messagingTemplate.convertAndSend("/topic/appointments", savedAppointment);
        
        return savedAppointment;
    }

    @Transactional
    public Appointment createAppointmentBySession(Integer pid, AppointmentDTO dto) {
        if (pid == null) {
            throw new BusinessException(401, "未登录");
        }

        Patient patient = patientRepository.findById(pid)
            .orElseThrow(() -> new BusinessException("患者不存在"));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
            .orElseThrow(() -> new BusinessException("医生不存在"));

        Appointment appointment = new Appointment();
        appointment.setPid(patient.getPid());
        appointment.setPatientId(patient.getPid());
        appointment.setDoctorId(doctor.getDoctorId());
        appointment.setDepartment(dto.getDepartment());
        appointment.setRegistrationDate(dto.getRegistrationDate());
        appointment.setRegistrationTime(LocalTime.now());
        appointment.setRegistrationFee(dto.getRegistrationFee());
        appointment.setStatus(1);
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        messagingTemplate.convertAndSend("/topic/appointments", savedAppointment);
        return savedAppointment;
    }

    @Transactional
    public Appointment updateStatus(Integer appointmentId, Integer status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new BusinessException("挂号单不存在"));
        
        appointment.setStatus(status);
        
        // 如果是就诊中(2)，记录开始时间
        if (status == 2) {
            appointment.setConsultStartTime(java.time.LocalDateTime.now());
        } 
        // 如果是已完成(3)，记录结束时间
        else if (status == 3) {
            appointment.setConsultEndTime(java.time.LocalDateTime.now());
        }
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        messagingTemplate.convertAndSend("/topic/appointments", savedAppointment);
        return savedAppointment;
    }
}
