package com.sportsfacilitybooking.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReviewRequest(
    @Min(value = 1, message = "Rating phai tu 1 den 5")
    @Max(value = 5, message = "Rating phai tu 1 den 5")
    Integer rating,

    @NotBlank(message = "Comment khong duoc de trong")
    @Size(max = 1000, message = "Comment khong duoc vuot qua 1000 ky tu")
    String comment
) {}
