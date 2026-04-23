package com.sportsfacilitybooking.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record OwnerBookingResponse(
    String id,
    String fieldId,
    String fieldName,
    String customerName,
    LocalDate bookingDate,
    String startTime,
    String endTime,
    BigDecimal depositAmount,
    BigDecimal extraCash,
    BigDecimal totalPrice,
    String status,
    String note,
    LocalDateTime checkedInAt,
    LocalDateTime createdAt
) {}
