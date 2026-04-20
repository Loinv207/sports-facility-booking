package com.sportsfacilitybooking.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SystemSummary {
    private Double totalRevenue;
    private Long totalBookings;
}
