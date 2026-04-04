package com.sportsfacilitybooking.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FieldRequest(
    @NotBlank(message = "Tên sân không được để trống")
    @Size(max = 100, message = "Tên sân tối đa 100 ký tự")
    String fieldName,

    @Size(max = 500, message = "Mô tả tối đa 500 ký tự")
    String description,

    @NotBlank(message = "Trạng thái không được để trống")
    String status
) {}
