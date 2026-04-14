// package com.sportsfacilitybooking.backend.dto;



// public record FieldResponse(
//     String id,
//     String fieldName,
//     String sportsType,
//     String address,
//     String price,
//     String description,
//     String status
// ) {}


package com.sportsfacilitybooking.backend.dto;

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
    private String address;
    private String price;
    private String description;
    private String status;
}