package com.sportsfacilitybooking.backend.dto;



public record FieldResponse(
    String id,
    String fieldName,
    String sportsType,
    String address,
    String price,
    String description,
    String status
) {}
