package com.sportsfacilitybooking.backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FieldRequest(
    @NotBlank(message = "Ten san khong duoc de trong")
    @Size(max = 100, message = "Ten san toi da 100 ky tu")
    String fieldName,

    @NotBlank(message = "Loai san khong duoc de trong")
    @Size(max = 100, message = "Loai san toi da 100 ky tu")
    String sportsType,

    Integer sportsTypeId,

    @NotBlank(message = "Dia chi khong duoc de trong")
    @Size(max = 255, message = "Dia chi toi da 255 ky tu")
    String address,

    @DecimalMin(value = "0.0", inclusive = true, message = "Gia san phai lon hon hoac bang 0")
    BigDecimal price,

    @DecimalMin(value = "0.0", inclusive = true, message = "Rating phai tu 0 den 5")
    @DecimalMax(value = "5.0", inclusive = true, message = "Rating phai tu 0 den 5")
    Double rating,

    @Size(max = 500, message = "Mo ta toi da 500 ky tu")
    String description,

    String status
) {}
