package com.sportsfacilitybooking.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SystemSummaryResponse {
    private Double totalRevenue;
    private Long totalBookings;
    private Long newUsers;          // Chỉ số mới 1
    private Double occupancyRate;
}
