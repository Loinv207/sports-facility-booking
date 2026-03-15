package com.sportsfacilitybooking.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
    String password
) {
    
}