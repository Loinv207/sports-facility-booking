package com.sportsfacilitybooking.backend.dto;

public record UpdateProfileRequest(
    String fullName,
    String phoneNumber,
    String email,
    String avatarUrl
) {
}
