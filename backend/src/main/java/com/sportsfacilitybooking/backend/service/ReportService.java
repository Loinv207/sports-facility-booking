package com.sportsfacilitybooking.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sportsfacilitybooking.backend.dto.SystemSummaryResponse;
import com.sportsfacilitybooking.backend.dto.FinanceReportResponse; 
import com.sportsfacilitybooking.backend.repository.SystemReportRepository;
import com.sportsfacilitybooking.backend.repository.BookingRepository; 
import com.sportsfacilitybooking.backend.entity.Booking;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ReportService {
    @Autowired
    private SystemReportRepository reportRepository;

    @Autowired
    private BookingRepository bookingRepository; // lọc đơn hàng PAID

    @Autowired
    private CommissionService commissionService; // lấy tỷ lệ % hoa hồng

    public SystemSummaryResponse getSystemSummary() {
        Double revenue = reportRepository.sumAllRevenue();
        Long bookings = reportRepository.sumAllBookings();
        
        return new SystemSummaryResponse(
            revenue != null ? revenue : 0.0, 
            bookings != null ? bookings : 0L
        );
    }

    // Báo cáo tài chính chi tiết
    public FinanceReportResponse getFinanceReport() {
        // Lấy danh sách đơn hàng đã thanh toán thực tế
        List<Booking> paidBookings = bookingRepository.findByStatusIn(List.of("PAID", "COMPLETED"));

        // Tính tổng doanh thu
        BigDecimal totalRevenue = paidBookings.stream()
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Lấy tỷ lệ hoa hồng từ CommissionService bạn đã làm
        BigDecimal rate = commissionService.getSystemCommission().getCommissionRate();
        
        // Tính toán: Hoa hồng = Doanh thu * (Tỷ lệ / 100)
        BigDecimal totalCommission = totalRevenue.multiply(rate)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        
        // Thực nhận = Doanh thu - Hoa hồng
        BigDecimal netAmount = totalRevenue.subtract(totalCommission);

        return new FinanceReportResponse(
                totalRevenue, 
                totalCommission, 
                netAmount, 
                (long) paidBookings.size()
        );
    }
}