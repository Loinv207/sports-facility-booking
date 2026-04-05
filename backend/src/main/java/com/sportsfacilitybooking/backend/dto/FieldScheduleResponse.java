package com.sportsfacilitybooking.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record FieldScheduleResponse(
    String id,
    String fieldId,
    LocalDate scheduleDate,
    LocalTime startTime,
    LocalTime endTime,
    BigDecimal price,
    String status
) {}
