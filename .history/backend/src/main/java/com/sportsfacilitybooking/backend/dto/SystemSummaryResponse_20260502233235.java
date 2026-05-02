package com.sportsfacilitybooking.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SystemSummaryResponse {
    private Double totalRevenue;
    private Long totalBookings;
    private Long newUsers;         
    private Double occupancyRate;
}
