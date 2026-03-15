package com.sportsfacilitybooking.backend.dto;

import java.time.Instant;
import com.ou.springcode.entity.Role;

public record UserResponse(
    Long id,
    String username,
    String email,
    Role role,
    String fullname,
    Instant createAt,
    Instant updateAt
) {
    
}