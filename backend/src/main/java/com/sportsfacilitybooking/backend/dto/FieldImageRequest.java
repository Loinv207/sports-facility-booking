package com.sportsfacilitybooking.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record FieldImageRequest(
    @NotBlank(message = "Danh sách link ảnh không được để trống")
    String imageUrl
) {}
