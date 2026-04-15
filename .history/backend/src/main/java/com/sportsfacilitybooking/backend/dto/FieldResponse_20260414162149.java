package com.sportsfacilitybooking.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor 
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
