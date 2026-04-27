package com.sportsfacilitybooking.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OwnerBookingStatusRequest(
    @NotBlank(message = "Trang thai khong duoc de trong")
    String status,

    @Size(max = 255, message = "Ghi chu toi da 255 ky tu")
    String note
) {}
