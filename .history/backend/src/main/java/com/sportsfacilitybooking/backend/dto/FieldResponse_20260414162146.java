package com.sportsfacilitybooking.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor // Quan trọng: Để tạo Constructor có đầy đủ tham số
@Builder
public record FieldResponse(
    String id,
    String fieldName,
    String sportsType,
    String address,
    String price,
    String description,
    String status
) {}
