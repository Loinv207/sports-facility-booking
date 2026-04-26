package com.sportsfacilitybooking.backend.dto;

import java.math.BigDecimal;

public record FinanceReportResponse(
    BigDecimal totalRevenue,      // Tổng doanh thu từ khách
    BigDecimal totalCommission,   // Tổng hoa hồng hệ thống nhận
    BigDecimal netAmount,         // Tiền thực nhận sau khi trừ phí
    long totalBookings            // Số lượng đơn đặt thành công
) {}