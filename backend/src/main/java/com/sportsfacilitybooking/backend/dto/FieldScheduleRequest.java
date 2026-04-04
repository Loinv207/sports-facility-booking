package com.sportsfacilitybooking.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record FieldScheduleRequest(
    @NotNull(message = "Ngày áp dụng không được để trống")
    LocalDate scheduleDate,

    @NotNull(message = "Giờ bắt đầu không được để trống")
    LocalTime startTime,

    @NotNull(message = "Giờ kết thúc không được để trống")
    LocalTime endTime,

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    BigDecimal price,

    @NotNull(message = "Khoảng thời gian mỗi slot không được để trống")
    Integer slotMinutes
) {}
