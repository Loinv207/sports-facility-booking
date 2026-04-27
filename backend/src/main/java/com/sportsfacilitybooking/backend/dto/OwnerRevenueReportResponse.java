package com.sportsfacilitybooking.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record OwnerRevenueReportResponse(
    BigDecimal totalDepositOnline,
    BigDecimal totalExtraCash,
    BigDecimal totalRevenue,
    long completedBookings,
    long confirmedBookings,
    List<OwnerRevenuePoint> chart
) {
    public record OwnerRevenuePoint(
        String label,
        BigDecimal depositOnline,
        BigDecimal extraCash,
        BigDecimal totalRevenue
    ) {}
}
