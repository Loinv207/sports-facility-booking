package com.sportsfacilitybooking.backend.dto;

public record SportsCenterResponse(
    String id,
    String name,
    String address,
    String city,
    String phone,
    String description,
    String approvalStatus
) {}
