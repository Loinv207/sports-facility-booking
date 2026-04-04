package com.sportsfacilitybooking.backend.dto;

public record FieldResponse(
    String id,
    String fieldName,
    String description,
    String status
) {}
