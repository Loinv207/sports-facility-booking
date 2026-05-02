
package com.sportsfacilitybooking.backend.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FieldResponse {
    private String id;
    private String fieldName;
    private String sportsType;
    private Integer sportsTypeId;
    private String address;
    private BigDecimal price;
    private Double rating;
    private String description;
    private String status;
}
