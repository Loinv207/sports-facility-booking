package com.sportsfacilitybooking.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateBookingRequest(
    @NotBlank(message = "fieldScheduleId khong duoc de trong")
    String fieldScheduleId,

    @NotBlank(message = "paymentMethod khong duoc de trong")
    String paymentMethod
) {}
