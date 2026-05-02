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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {
    @Autowired
    private SystemReportRepository reportRepository;

    @Autowired
    private BookingRepository bookingRepository; // lọc đơn hàng PAID

    @Autowired
    private CommissionService commissionService; // lấy tỷ lệ % hoa hồng

    // public SystemSummaryResponse getSystemSummary() {
    //     Double revenue = reportRepository.sumAllRevenue();
    //     Long bookings = reportRepository.sumAllBookings();
        
    //     return new SystemSummaryResponse(
    //         revenue != null ? revenue : 0.0, 
    //         bookings != null ? bookings : 0L
    //     );
    // }

    public SystemSummaryResponse getSystemSummary() {
    // Thay vì dùng reportRepository.sumAllRevenue() (có thể tính cả đơn chưa thanh toán)
    // Hãy dùng chung logic với Finance Report để số liệu khớp nhau
        List<Booking> paidBookings = bookingRepository.findByStatusIn(List.of("PAID", "COMPLETED"));
        
        BigDecimal revenue = paidBookings.stream()
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        return new SystemSummaryResponse(
            revenue.doubleValue(), 
            (long) paidBookings.size()
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

    public List<Map<String, Object>> getMonthlyStatistics() {
        // 1. Lấy tất cả đơn đã thanh toán trong năm nay
        List<Booking> paidBookings = bookingRepository.findByStatusIn(List.of("PAID", "COMPLETED"));

        // 2. Nhóm theo tháng và tính tổng doanh thu/số lượng đơn
        // Kết quả trung gian: Map<Tháng, List<Booking>>
        Map<Integer, List<Booking>> bookingsByMonth = paidBookings.stream()
                .collect(Collectors.groupingBy(b -> b.getBookingDate().getMonthValue()));

        List<Map<String, Object>> monthlyData = new ArrayList<>();

        // 3. Duyệt qua 12 tháng để đảm bảo tháng nào không có khách vẫn hiện số 0 (không bị trống biểu đồ)
        for (int i = 1; i <= 12; i++) {
            List<Booking> monthBookings = bookingsByMonth.getOrDefault(i, new ArrayList<>());
            
            BigDecimal monthlyRevenue = monthBookings.stream()
                    .map(Booking::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> stats = new HashMap<>();
            stats.put("name", "Tháng " + i);
            stats.put("revenue", monthlyRevenue);
            stats.put("bookings", (long) monthBookings.size());
            
            monthlyData.add(stats);
        }

        return monthlyData;
    }    
}