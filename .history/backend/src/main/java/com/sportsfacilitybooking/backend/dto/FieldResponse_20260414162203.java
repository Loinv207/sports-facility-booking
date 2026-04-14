package com.sportsfacilitybooking.backend.dto;

import lombok.Builder;

@Builder
public record FieldResponse(
    String id,
    String fieldName,
    String sportsType,
    String address,
    String price,
    String description,
    String status
) {}
