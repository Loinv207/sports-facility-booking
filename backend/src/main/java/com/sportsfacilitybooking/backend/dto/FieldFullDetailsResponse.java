package com.sportsfacilitybooking.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record FieldFullDetailsResponse(
    String id,
    String fieldName,
    String sportsType,
    Integer sportsTypeId,
    String address,
    BigDecimal price,
    Double rating,
    String sportsCenterId,
    String description,
    String status,
    List<FieldImageResponse> images,
    List<FieldScheduleResponse> schedules,
    SportsCenterResponse sportsCenter
) {}
