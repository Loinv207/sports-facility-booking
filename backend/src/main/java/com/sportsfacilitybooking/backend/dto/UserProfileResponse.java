package com.sportsfacilitybooking.backend.dto;

import java.time.Instant;
import java.time.LocalDate;

import com.sportsfacilitybooking.backend.entity.Role;

public record UserProfileResponse(
    Long id,
    String username,
    String email,
    Role role,
    String status,
    String fullName,
    String phoneNumber,
    String avatarUrl,
    LocalDate dateOfBirth,
    String gender,
    String address,
    Instant createdAt,
    Instant updatedAt
) {}
