package com.sportsfacilitybooking.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsfacilitybooking.backend.entity.FieldSchedule;

public interface FieldScheduleRepository extends JpaRepository<FieldSchedule, String> {
    List<FieldSchedule> findByFieldIdOrderByScheduleDateAscStartTimeAsc(String fieldId);
    boolean existsByFieldIdAndScheduleDateAndStartTimeLessThanAndEndTimeGreaterThan(
        String fieldId,
        java.time.LocalDate scheduleDate,
        java.time.LocalTime endTime,
        java.time.LocalTime startTime
    );
}
