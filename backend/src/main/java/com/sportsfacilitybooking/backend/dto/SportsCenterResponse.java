package com.sportsfacilitybooking.backend.dto;

import java.time.LocalDateTime;

public record SportsCenterResponse(
    String id,
    String name,
    String address,
    String city,
    String approvalStatus,
    LocalDateTime createdAt
) {}
