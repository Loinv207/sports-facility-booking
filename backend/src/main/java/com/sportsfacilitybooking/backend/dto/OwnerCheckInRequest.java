package com.sportsfacilitybooking.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OwnerCheckInRequest(
    @NotBlank(message = "bookingId khong duoc de trong")
    String bookingId,

    @DecimalMin(value = "0.0", inclusive = true, message = "Tien mat thu them phai lon hon hoac bang 0")
    BigDecimal extraCash,

    @Size(max = 255, message = "Ghi chu toi da 255 ky tu")
    String note
) {}
