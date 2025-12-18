package com.his.server.service;

import com.his.server.entity.Doctor;
import com.his.server.repository.DoctorRepository;
import com.his.server.entity.Appointment;
import com.his.server.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    
    private static final List<String> SLOTS = Arrays.asList(
        "09:00-10:00", "10:00-11:00", "11:00-12:00",
        "13:30-14:30", "14:30-15:30", "15:30-16:30", "16:30-17:30"
    );
    private static final int SLOT_QUOTA = 5;

    public List<Doctor> list(String department, LocalDate date) {
        List<Doctor> doctors;
        if (department != null && !department.isEmpty()) {
            doctors = doctorRepository.findByDepartment(department);
        } else {
            doctors = doctorRepository.findAll();
        }

        if (date != null) {
            // Fetch all appointments for these doctors on this date to minimize queries? 
            // Or just loop. For small dataset, looping is fine.
            for (Doctor doc : doctors) {
                // Total Quota
                long used = appointmentRepository.countByDoctorIdAndRegistrationDate(doc.getDoctorId(), date);
                int remaining = doc.getDailyQuota() - (int) used;
                doc.setRemainingQuota(Math.max(0, remaining));
                
                // Slot Quota
                List<Appointment> appts = appointmentRepository.findByDoctorIdAndRegistrationDate(doc.getDoctorId(), date);
                Map<String, Long> slotCounts = appts.stream()
                    .filter(a -> a.getTimeSlot() != null)
                    .collect(Collectors.groupingBy(Appointment::getTimeSlot, Collectors.counting()));
                
                Map<String, Integer> availability = new HashMap<>();
                for (String slot : SLOTS) {
                    long count = slotCounts.getOrDefault(slot, 0L);
                    availability.put(slot, Math.max(0, SLOT_QUOTA - (int) count));
                }
                doc.setSlotAvailability(availability);
            }
        } else {
              doctors.forEach(d -> {
                  d.setRemainingQuota(d.getDailyQuota());
                  Map<String, Integer> map = new HashMap<>();
                  SLOTS.forEach(s -> map.put(s, SLOT_QUOTA));
                  d.setSlotAvailability(map);
              });
        }
        return doctors;
    }

    public Doctor save(Doctor doctor) {
        return doctorRepository.save(doctor);
    }
    
    public Doctor getById(Integer id) {
        return doctorRepository.findById(id).orElse(null);
    }
}