package com.sportsfacilitybooking.backend.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sportsfacilitybooking.backend.entity.FieldSchedule;

public interface FieldScheduleRepository extends JpaRepository<FieldSchedule, String> {
    List<FieldSchedule> findByFieldIdOrderByScheduleDateAscStartTimeAsc(String fieldId);

    boolean existsByFieldIdAndScheduleDateAndStartTimeLessThanAndEndTimeGreaterThan(
        String fieldId,
        LocalDate scheduleDate,
        LocalTime endTime,
        LocalTime startTime
    );
}
