package com.sportsfacilitybooking.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FieldRequest(
    @NotBlank(message = "Tên sân không được để trống")
    @Size(max = 100, message = "Tên sân tối đa 100 ký tự")
    String fieldName,

    @NotBlank(message = "Loại sân không được để trống")
    @Size(max = 100, message = "Loại sân tối đa 100 ký tự")
    String sportsType,

    @NotBlank(message = "Địa chỉ không được để trống")
    @Size(max = 255, message = "Địa chỉ tối đa 255 ký tự")
    String address,

    String price,

    @Size(max = 500, message = "Mô tả tối đa 500 ký tự")
    String description,

    String status
) {}
