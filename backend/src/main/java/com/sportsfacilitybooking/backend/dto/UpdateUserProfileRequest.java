package com.sportsfacilitybooking.backend.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserProfileRequest(
    @Size(max = 100, message = "Ho ten toi da 100 ky tu")
    String fullName,

    @Size(max = 20, message = "So dien thoai toi da 20 ky tu")
    String phoneNumber,

    @Email(message = "Email khong hop le")
    @Size(max = 255, message = "Email toi da 255 ky tu")
    String email,

    String avatarUrl,

    LocalDate dateOfBirth,

    @Size(max = 20, message = "Gender toi da 20 ky tu")
    String gender,

    @Size(max = 255, message = "Dia chi toi da 255 ky tu")
    String address
) {}
