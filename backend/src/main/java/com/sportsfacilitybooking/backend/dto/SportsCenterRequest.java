package com.sportsfacilitybooking.backend.dto;

public record SportsCenterRequest(
    String name,
    String address,
    String city,
    String phone,
    String description,
    String approvalStatus
) {}
