package com.sportsfacilitybooking.backend.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
    String id,
    String fieldId,
    Long userId,
    String username,
    Integer rating,
    String comment,
    LocalDateTime createdAt
) {}
