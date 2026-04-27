package com.sportsfacilitybooking.backend.dto;

import com.sportsfacilitybooking.backend.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank(message = "Username not null")
    @Size(min = 3, max = 50)
    String username,

    @NotBlank(message = "Email not null")
    @Email(message = "Email not correct")
    String email,

    @NotBlank(message = "Password not null")
    @Size(min = 8, message = "Min 8")
    String password,

    @NotNull(message = "Role not null")
    Role role,

    @Size(max = 100, message = "Full name max 100")
    String fullName,

    @Size(max = 20, message = "Phone max 20")
    String phoneNumber
) {
}
