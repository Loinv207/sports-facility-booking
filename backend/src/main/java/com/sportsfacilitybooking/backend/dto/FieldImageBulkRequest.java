package com.sportsfacilitybooking.backend.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;

public record FieldImageBulkRequest(
    @NotEmpty(message = "Danh sách ảnh không được để trống")
    List<String> imageUrls
) {}
