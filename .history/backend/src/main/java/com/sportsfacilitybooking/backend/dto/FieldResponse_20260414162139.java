package com.sportsfacilitybooking.backend.dto;

import lombok.Builder;

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
