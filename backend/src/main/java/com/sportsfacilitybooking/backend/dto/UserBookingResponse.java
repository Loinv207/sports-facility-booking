package com.sportsfacilitybooking.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record UserBookingResponse(
    String bookingId,
    String fieldId,
    String fieldName,
    String fieldScheduleId,
    LocalDate bookingDate,
    LocalTime startTime,
    LocalTime endTime,
    BigDecimal totalPrice,
    String bookingStatus,
    String paymentId,
    String paymentMethod,
    String paymentStatus,
    LocalDateTime createdAt
) {}
