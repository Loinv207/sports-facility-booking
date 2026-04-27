package com.sportsfacilitybooking.backend.dto;

import java.time.Instant;
import com.sportsfacilitybooking.backend.entity.Role;

public record UserResponse(
    Long id,
    String username,
    String email,
    Role role,
    String fullname,
    String phoneNumber,
    String avatarUrl,
    String status,
    Instant createAt,
    Instant updateAt
) {
    
}
